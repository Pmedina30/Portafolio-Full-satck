// src/app/api/checkout/paypal/activate-subscription/route.ts
// Activación y validación de Suscripción Pro recurrente en PayPal ($9.99/mes)

import { NextRequest, NextResponse } from 'next/server';
import { getPayPalSubscription } from '@/lib/paypal';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, userId } = await req.json();

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (subscriptionId o userId)' },
        { status: 400 }
      );
    }

    // Consultar detalles de la suscripción directamente a PayPal
    const subData = await getPayPalSubscription(subscriptionId);

    const validStatuses = ['ACTIVE', 'APPROVAL_PENDING', 'APPROVED'];
    if (!validStatuses.includes(subData.status)) {
      return NextResponse.json(
        { error: `La suscripción no está activa en PayPal. Estado: ${subData.status}` },
        { status: 400 }
      );
    }

    const nextBillingTime =
      subData.billing_info?.next_billing_time ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Guardar o actualizar registro en la base de datos Supabase
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      paypal_subscription_id: subscriptionId,
      paypal_plan_id: subData.plan_id || null,
      paypal_payer_id: subData.subscriber?.payer_id || null,
      tier: 'pro_monthly',
      status: 'active',
      current_period_end: nextBillingTime,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    });

    // Desbloquear exportación Pro sin marca de agua
    await supabaseAdmin.from('resumes').update({ has_watermark: false }).eq('user_id', userId);

    console.info(`[PAYPAL_SUB_ACTIVATED]: Suscripción Pro activa para usuario ${userId} (ID: ${subscriptionId})`);

    return NextResponse.json(
      {
        success: true,
        subscriptionId,
        status: subData.status,
        nextBillingTime,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PAYPAL_ACTIVATE_SUB_ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al validar y activar suscripción de PayPal' },
      { status: 500 }
    );
  }
}
