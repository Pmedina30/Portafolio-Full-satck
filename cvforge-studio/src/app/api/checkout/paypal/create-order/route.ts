// src/app/api/checkout/paypal/create-order/route.ts
// Generador de órdenes de pago único en PayPal para el Pase Individual ($4.99)

import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, plan } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado o ID de usuario ausente' },
        { status: 401 }
      );
    }

    const amount = plan === 'pro' ? '9.99' : '4.99';
    const description =
      plan === 'pro'
        ? 'CVForge Studio - Plan Pro Mensual'
        : 'CVForge Studio - Pase Individual de Descarga (Sin Marca de Agua)';

    const order = await createPayPalOrder({
      amount,
      currency: 'USD',
      userId,
      userEmail,
      description,
    });

    return NextResponse.json({ id: order.id, approveUrl: order.approveUrl }, { status: 200 });
  } catch (error: any) {
    console.error('[PAYPAL_CREATE_ORDER_ROUTE_ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al iniciar orden en PayPal' },
      { status: 500 }
    );
  }
}
