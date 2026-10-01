// src/lib/lemonsqueezy.ts
// Servicio de Integración con Lemon Squeezy (Merchant of Record)
// API v1: https://docs.lemonsqueezy.com/api

const LEMON_API_BASE = 'https://api.lemonsqueezy.com/v1';

export interface CreateCheckoutParams {
  variantId: string;
  userId: string;
  userEmail: string;
  userName?: string;
  redirectUrl?: string;
}

export interface LemonCheckoutResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      url: string;
      store_id: number;
      variant_id: number;
      custom_price: number | null;
      checkout_data: {
        email: string;
        name: string;
        custom: Record<string, any>;
      };
    };
  };
}

/**
 * Genera una sesión de checkout alojada en Lemon Squeezy para suscripciones o pases únicos.
 */
export async function createLemonSqueezyCheckout({
  variantId,
  userId,
  userEmail,
  userName = '',
  redirectUrl,
}: CreateCheckoutParams): Promise<string> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!apiKey || !storeId) {
    throw new Error('Variables de entorno LEMONSQUEEZY_API_KEY o LEMONSQUEEZY_STORE_ID no configuradas.');
  }

  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email: userEmail,
          name: userName,
          custom: {
            user_id: userId,
          },
        },
        product_options: {
          redirect_url: redirectUrl || `${appUrl}/dashboard?payment=success`,
        },
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: storeId.toString(),
          },
        },
        variant: {
          data: {
            type: 'variants',
            id: variantId.toString(),
          },
        },
      },
    },
  };

  const response = await fetch(`${LEMON_API_BASE}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[LEMON_SQUEEZY_CHECKOUT_ERROR]:', errorBody);
    throw new Error(`Error de Lemon Squeezy (${response.status}): ${errorBody}`);
  }

  const json: LemonCheckoutResponse = await response.json();
  return json.data.attributes.url;
}

/**
 * Consulta la URL del Portal de Clientes de Lemon Squeezy para gestionar facturas y métodos de pago.
 */
export async function getCustomerPortalUrl(customerId: string): Promise<string | null> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${LEMON_API_BASE}/customers/${customerId}`, {
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) return null;
    const json = await response.json();
    return json.data?.attributes?.urls?.customer_portal || null;
  } catch (err) {
    console.error('[LEMON_PORTAL_ERROR]:', err);
    return null;
  }
}
