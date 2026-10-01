// src/app/api/checkout/lemonsqueezy/route.ts
// Generador de enlaces de Checkout seguro para Lemon Squeezy (MoR)

import { NextRequest, NextResponse } from 'next/server';
import { createLemonSqueezyCheckout } from '@/lib/lemonsqueezy';

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, userEmail, userName } = await req.json();

    if (!userId || !userEmail) {
      return NextResponse.json({ error: 'Usuario no autenticado o email faltante' }, { status: 401 });
    }

    const isProSubscription = plan === 'pro';
    const variantId = isProSubscription
      ? process.env.LEMON_VARIANT_ID_PRO
      : process.env.LEMON_VARIANT_ID_ONE_TIME;

    if (!variantId) {
      return NextResponse.json(
        {
          error: `Variant ID no configurado para el plan "${plan}". Revisa LEMON_VARIANT_ID_PRO o LEMON_VARIANT_ID_ONE_TIME.`,
        },
        { status: 500 }
      );
    }

    const checkoutUrl = await createLemonSqueezyCheckout({
      variantId,
      userId,
      userEmail,
      userName,
    });

    return NextResponse.json({ url: checkoutUrl }, { status: 200 });
  } catch (error: any) {
    console.error('[LEMON_CHECKOUT_ROUTE_ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error al iniciar checkout en Lemon Squeezy' }, { status: 500 });
  }
}
