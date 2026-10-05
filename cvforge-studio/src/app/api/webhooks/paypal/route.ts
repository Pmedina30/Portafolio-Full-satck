// src/app/api/webhooks/paypal/route.ts
// Webhook oficial para PayPal con verificación criptográfica
// Manejo transaccional para pagos únicos (Pase Individual) y suscripciones recurrentes Pro

import { NextRequest, NextResponse } from 'next/server';
import { verifyPayPalWebhookSignature } from '@/lib/paypal';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const event = JSON.parse(rawBody);

    const authAlgo = req.headers.get('paypal-auth-algo');
    const certUrl = req.headers.get('paypal-cert-url');
    const transmissionId = req.headers.get('paypal-transmission-id');
    const transmissionSig = req.headers.get('paypal-transmission-sig');
    const transmissionTime = req.headers.get('paypal-transmission-time');
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    // 1. Verificación Criptográfica Oficial de PayPal
    if (webhookId && authAlgo && certUrl && transmissionId && transmissionSig && transmissionTime) {
      const isValid = await verifyPayPalWebhookSignature({
        authAlgo,
        certUrl,
        transmissionId,
        transmissionSig,
        transmissionTime,
        webhookId,
        eventBody: event,
      });

      if (!isValid) {
        console.error('[PAYPAL_WEBHOOK]: Firma criptográfica inválida.');
        return NextResponse.json({ error: 'Firma de webhook inválida' }, { status: 401 });
      }
    } else {
      console.warn('[PAYPAL_WEBHOOK]: PAYPAL_WEBHOOK_ID no configurado o cabeceras faltantes. Procediendo con advertencia de seguridad.');
    }

    const eventType = event.event_type;
    const resource = event.resource || {};

    console.info(`[PAYPAL_WEBHOOK]: Evento recibido -> ${eventType} (ID: ${event.id})`);

    // 2. Procesamiento de Eventos Transaccionales
    switch (eventType) {
      // Captura de Pago Completada (Pase Individual o Cobro Recurrente)
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const customId = resource.custom_id;
        const payerId = resource.payer_id;
        const captureId = resource.id;

        if (customId) {
          await supabaseAdmin.from('subscriptions').upsert({
            user_id: customId,
            paypal_order_id: captureId,
            paypal_payer_id: payerId,
            tier: 'lifetime_single_pass',
            status: 'active',
            updated_at: new Date().toISOString(),
          });

          // Actualizar estado Pro en perfil
          await supabaseAdmin.from('profiles').upsert({
            id: customId,
            is_pro: true,
            updated_at: new Date().toISOString(),
          });

          await supabaseAdmin.from('resumes').update({ has_watermark: false }).eq('user_id', customId);
          console.info(`[PAYPAL_WEBHOOK_CAPTURE_SUCCESS]: Usuario ${customId} activó pase individual.`);
        }
        break;
      }

      // Suscripción Pro Activada o Creada
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.CREATED': {
        const subscriptionId = resource.id;
        const customId = resource.custom_id;
        const planId = resource.plan_id;
        const nextBilling = resource.billing_info?.next_billing_time;
        const payerId = resource.subscriber?.payer_id;

        if (customId) {
          await supabaseAdmin.from('subscriptions').upsert({
            user_id: customId,
            paypal_subscription_id: subscriptionId,
            paypal_plan_id: planId,
            paypal_payer_id: payerId,
            tier: 'pro_monthly',
            status: 'active',
            current_period_end: nextBilling,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          });

          // Actualizar estado Pro en perfil
          await supabaseAdmin.from('profiles').upsert({
            id: customId,
            is_pro: true,
            updated_at: new Date().toISOString(),
          });

          await supabaseAdmin.from('resumes').update({ has_watermark: false }).eq('user_id', customId);
          console.info(`[PAYPAL_WEBHOOK_SUB_ACTIVATED]: Suscripción Pro activada para ${customId}.`);
        }
        break;
      }

      // Cobro recurrente exitoso de ciclo de suscripción
      case 'PAYMENT.SALE.COMPLETED': {
        const subscriptionId = resource.billing_agreement_id;
        if (subscriptionId) {
          const { data: subRecord } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('paypal_subscription_id', subscriptionId)
            .single();

          if (subRecord?.user_id) {
            // Extender periodo por 30 días
            const nextPeriod = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            await supabaseAdmin
              .from('subscriptions')
              .update({
                status: 'active',
                current_period_end: nextPeriod,
                updated_at: new Date().toISOString(),
              })
              .eq('paypal_subscription_id', subscriptionId);

            await supabaseAdmin.from('profiles').update({
              is_pro: true,
              updated_at: new Date().toISOString(),
            }).eq('id', subRecord.user_id);

            await supabaseAdmin.from('resumes').update({ has_watermark: false }).eq('user_id', subRecord.user_id);
            console.info(`[PAYPAL_WEBHOOK_RENEWAL]: Suscripción ${subscriptionId} renovada.`);
          }
        }
        break;
      }

      // Suscripción Cancelada o Suspendida
      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        const subscriptionId = resource.id;
        const { data: subRecord } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('paypal_subscription_id', subscriptionId)
          .single();

        if (subRecord?.user_id) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: eventType.includes('CANCELLED') ? 'canceled' : 'past_due',
              cancel_at_period_end: true,
              updated_at: new Date().toISOString(),
            })
            .eq('paypal_subscription_id', subscriptionId);

          // Revocar is_pro en perfiles
          await supabaseAdmin
            .from('profiles')
            .update({
              is_pro: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', subRecord.user_id);

          console.info(`[PAYPAL_WEBHOOK_SUB_CANCELLED]: Suscripción ${subscriptionId} cancelada/suspendida para ${subRecord.user_id}.`);
        }
        break;
      }

      // Suscripción Expirada Definitivamente
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const subscriptionId = resource.id;
        const { data: subRecord } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('paypal_subscription_id', subscriptionId)
          .single();

        if (subRecord?.user_id) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'canceled',
              tier: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('paypal_subscription_id', subscriptionId);

          // Revocar is_pro en perfiles
          await supabaseAdmin
            .from('profiles')
            .update({
              is_pro: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', subRecord.user_id);

          // Reactivar marca de agua al terminar plan
          await supabaseAdmin.from('resumes').update({ has_watermark: true }).eq('user_id', subRecord.user_id);
          console.info(`[PAYPAL_WEBHOOK_SUB_EXPIRED]: Suscripción ${subscriptionId} expirada.`);
        }
        break;
      }

      default:
        console.log(`[PAYPAL_WEBHOOK_UNHANDLED]: Evento ${eventType} no requiere acción directa.`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('[PAYPAL_WEBHOOK_EXCEPTION]:', error);
    return NextResponse.json({ error: error.message || 'Error interno de webhook' }, { status: 500 });
  }
}
