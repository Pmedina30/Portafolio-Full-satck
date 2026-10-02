// src/lib/paypal.ts
// Servicio de Integración Oficial con la API REST de PayPal v1 / v2
// Compatible con Next.js 15+ App Router, Server Actions y API Routes

export interface CreateOrderParams {
  amount: string;
  currency?: string;
  userId: string;
  userEmail?: string;
  description?: string;
}

export interface CaptureOrderResult {
  id: string;
  status: string;
  payer?: {
    payer_id?: string;
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  purchase_units?: Array<{
    reference_id?: string;
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }>;
    };
    custom_id?: string;
  }>;
}

export interface VerifyWebhookParams {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
  webhookId: string;
  eventBody: any;
}

// Configuración de credenciales y entornos
const PAYPAL_CLIENT_ID =
  process.env.PAYPAL_CLIENT_ID ||
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  'BAAWuhowGxNVOG8IWnsC-0GOKqGYqlOzdw80GJXFizhP1kcLRMP-miLwMq68675pLuNQTS3e3DU4m8MKhw';

const PAYPAL_CLIENT_SECRET =
  process.env.PAYPAL_CLIENT_SECRET ||
  'EBiWb0CVwsAm48OOJl1NALMH3zMf0c9bPup5UPGXPUaj4E2AnC0MuRCuaGQR6c9eAa-P0zdYRKpXKPUa';

const PAYPAL_MODE = (process.env.PAYPAL_MODE || 'sandbox').toLowerCase();
const PAYPAL_API_BASE =
  PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Cache en memoria para token OAuth
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Obtiene o reutiliza un token de acceso OAuth 2.0 de PayPal.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60 * 1000) {
    return cachedToken;
  }

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('Variables de entorno PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET no configuradas.');
  }

  const authString = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[PAYPAL_AUTH_ERROR]:', errorText);
    throw new Error(`Error al autenticar con PayPal (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600) * 1000;

  return cachedToken as string;
}

/**
 * Crea una orden de pago único en PayPal (Pase Individual sin marca de agua).
 */
export async function createPayPalOrder({
  amount,
  currency = 'USD',
  userId,
  userEmail,
  description = 'CVForge Studio - Pase Individual de Descarga',
}: CreateOrderParams): Promise<{ id: string; approveUrl?: string }> {
  const accessToken = await getPayPalAccessToken();

  const payload: Record<string, any> = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        custom_id: userId,
        description,
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
    application_context: {
      brand_name: 'CVForge Studio',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING',
    },
  };

  if (userEmail) {
    payload.payer = {
      email_address: userEmail,
    };
  }

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[PAYPAL_CREATE_ORDER_ERROR]:', err);
    throw new Error(`Error creando orden en PayPal: ${err}`);
  }

  const orderData = await res.json();
  const approveLink = orderData.links?.find((l: any) => l.rel === 'approve')?.href;

  return {
    id: orderData.id,
    approveUrl: approveLink,
  };
}

/**
 * Captura los fondos de una orden aprobada por el comprador.
 */
export async function capturePayPalOrder(orderId: string): Promise<CaptureOrderResult> {
  const accessToken = await getPayPalAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[PAYPAL_CAPTURE_ORDER_ERROR]:', err);
    throw new Error(`Error al capturar orden ${orderId} en PayPal: ${err}`);
  }

  return await res.json();
}

/**
 * Obtiene los detalles de una suscripción activa o cancelada en PayPal.
 */
export async function getPayPalSubscription(subscriptionId: string): Promise<any> {
  const accessToken = await getPayPalAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[PAYPAL_GET_SUB_ERROR]:', err);
    throw new Error(`Error consultando suscripción ${subscriptionId}: ${err}`);
  }

  return await res.json();
}

/**
 * Cancela una suscripción en PayPal.
 */
export async function cancelPayPalSubscription(subscriptionId: string, reason = 'Cancelado por el usuario'): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    console.error('[PAYPAL_CANCEL_SUB_ERROR]:', err);
    throw new Error(`Error cancelando suscripción en PayPal: ${err}`);
  }

  return true;
}

/**
 * Verifica la firma criptográfica oficial de un webhook recibido de PayPal.
 * Utiliza el endpoint oficial de PayPal: /v1/notifications/verify-webhook-signature
 */
export async function verifyPayPalWebhookSignature({
  authAlgo,
  certUrl,
  transmissionId,
  transmissionSig,
  transmissionTime,
  webhookId,
  eventBody,
}: VerifyWebhookParams): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();

    const verificationPayload = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: eventBody,
    };

    const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationPayload),
    });

    if (!res.ok) {
      console.error('[PAYPAL_WEBHOOK_VERIFY_HTTP_ERROR]:', await res.text());
      return false;
    }

    const result = await res.json();
    return result.verification_status === 'SUCCESS';
  } catch (err) {
    console.error('[PAYPAL_WEBHOOK_VERIFY_EXCEPTION]:', err);
    return false;
  }
}
