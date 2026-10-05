// src/app/api/checkout/paypal/capture-order/route.ts
// Captura y verificación de órdenes de PayPal para activar el Pase Individual

import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { orderId, userId } = await req.json();

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (orderId o userId)' },
        { status: 400 }
      );
    }

    const captureResult = await capturePayPalOrder(orderId);

    if (captureResult.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `El estado de la orden no fue completado: ${captureResult.status}` },
        { status: 400 }
      );
    }

    const payerId = captureResult.payer?.payer_id || null;

    // Actualizar suscripción/pase en Supabase
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      paypal_order_id: orderId,
      paypal_payer_id: payerId,
      tier: 'lifetime_single_pass',
      status: 'active',
      updated_at: new Date().toISOString(),
    });

    // Desbloquear exportación sin marca de agua para el usuario
    await supabaseAdmin.from('resumes').update({ has_watermark: false }).eq('user_id', userId);

    // Sincronizar estado Pro en perfil
    await supabaseAdmin.from('profiles').upsert({
      id: userId,
      is_pro: true,
      updated_at: new Date().toISOString(),
    });

    console.info(`[PAYPAL_ORDER_CAPTURED]: Usuario ${userId} activó Pase Individual con orden ${orderId}`);

    return NextResponse.json(
      {
        success: true,
        orderId,
        status: captureResult.status,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PAYPAL_CAPTURE_ORDER_ROUTE_ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al capturar la orden en PayPal' },
      { status: 500 }
    );
  }
}
