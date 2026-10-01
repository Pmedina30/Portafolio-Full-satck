// src/app/api/webhooks/lemonsqueezy/route.ts
// Webhook criptográfico para Lemon Squeezy (Merchant of Record)
// Manejo transaccional para compras únicas y suscripciones Pro

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      console.error('[LEMON_WEBHOOK]: Firma ausente o LEMONSQUEEZY_WEBHOOK_SECRET no configurado.');
      return NextResponse.json({ error: 'Firma o secreto ausente' }, { status: 400 });
    }

    // 1. Verificación criptográfica HMAC-SHA256 con protección contra ataques de temporización (timing attack)
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      console.error('[LEMON_WEBHOOK]: Firma HMAC-SHA256 inválida.');
      return NextResponse.json({ error: 'Firma no válida' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || {};
    const userId = customData.user_id;

    console.log(`[LEMON_WEBHOOK]: Evento recibido -> ${eventName} para usuario -> ${userId || 'N/A'}`);

    // 2. Procesamiento de Eventos Transaccionales
    switch (eventName) {
      // Compra única completada (Pase individual sin marca de agua)
      case 'order_created': {
        const order = payload.data;
        const customerId = order.attributes.customer_id;
        const orderId = order.id;
        const variantId = order.attributes.first_order_item?.variant_id;
        const userEmail = order.attributes.user_email;

        if (userId) {
          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            lemon_customer_id: customerId.toString(),
            lemon_order_id: orderId.toString(),
            lemon_variant_id: variantId?.toString() || null,
            tier: 'lifetime_single_pass',
            status: 'active',
            updated_at: new Date().toISOString(),
          });

          // Remover marca de agua en todos los CVs del usuario
          await supabaseAdmin.from('resumes').update({ has_watermark: false }).eq('user_id', userId);
          console.info(`[LEMON_ORDER_SUCCESS]: Usuario ${userId} activó pase individual.`);
        }
        break;
      }

      // Suscripción Pro Creada (Suscripción Mensual Pro)
      case 'subscription_created': {
        const subscription = payload.data;
        const customerId = subscription.attributes.customer_id;
        const subscriptionId = subscription.id;
        const variantId = subscription.attributes.variant_id;
        const renewsAt = subscription.attributes.renews_at;

        if (userId) {
          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            lemon_customer_id: customerId.toString(),
            lemon_subscription_id: subscriptionId.toString(),
            lemon_variant_id: variantId.toString(),
            tier: 'pro_monthly',
            status: 'active',
            current_period_end: renewsAt,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          });

          // Desbloquear exportación Pro sin marca de agua
          await supabaseAdmin.from('resumes').update({ has_watermark: false }).eq('user_id', userId);
          console.info(`[LEMON_SUB_CREATED]: Suscripción Pro activa para usuario ${userId}.`);
        }
        break;
      }

      // Suscripción Pro Renovada o Actualizada
      case 'subscription_updated': {
        const subscription = payload.data;
        const subscriptionId = subscription.id;
        const status = subscription.attributes.status; // 'active', 'past_due', 'unpaid', 'cancelled'
        const renewsAt = subscription.attributes.renews_at;
        const endsAt = subscription.attributes.ends_at;

        const dbStatus = status === 'active' ? 'active' : status === 'past_due' ? 'past_due' : 'canceled';

        const { data: subRecord } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('lemon_subscription_id', subscriptionId.toString())
          .single();

        if (subRecord?.user_id) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: dbStatus,
              current_period_end: renewsAt || endsAt,
              updated_at: new Date().toISOString(),
            })
            .eq('lemon_subscription_id', subscriptionId.toString());

          // Si el estado pasó a impagado o cancelado, reactivar marca de agua
          if (dbStatus === 'canceled' || dbStatus === 'past_due') {
            await supabaseAdmin.from('resumes').update({ has_watermark: true }).eq('user_id', subRecord.user_id);
          }
        }
        break;
      }

      // Suscripción Cancelada (marcada para terminar al final del ciclo)
      case 'subscription_cancelled': {
        const subscription = payload.data;
        const subscriptionId = subscription.id;

        await supabaseAdmin
          .from('subscriptions')
          .update({
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
          })
          .eq('lemon_subscription_id', subscriptionId.toString());
        break;
      }

      // Suscripción Expirada Definitivamente
      case 'subscription_expired': {
        const subscription = payload.data;
        const subscriptionId = subscription.id;

        const { data: subRecord } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('lemon_subscription_id', subscriptionId.toString())
          .single();

        if (subRecord?.user_id) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'canceled',
              tier: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('lemon_subscription_id', subscriptionId.toString());

          // Restaurar marca de agua
          await supabaseAdmin.from('resumes').update({ has_watermark: true }).eq('user_id', subRecord.user_id);
        }
        break;
      }

      default:
        console.log(`[LEMON_WEBHOOK_UNHANDLED]: Evento ${eventName} ignorado.`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('[LEMON_WEBHOOK_EXCEPTION]:', error);
    return NextResponse.json({ error: error.message || 'Error interno de webhook' }, { status: 500 });
  }
}
