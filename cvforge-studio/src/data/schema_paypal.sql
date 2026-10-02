-- ==============================================================================
-- CVForge Studio — Migración Supabase para Integración de Pagos con PayPal
-- Soporte para: PayPal Subscriptions (Plan Pro) y PayPal Orders (Pase Individual)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Actualizar tabla de Subscriptions con columnas específicas de PayPal
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS paypal_payer_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_plan_id TEXT;

-- 2. Índices de Búsqueda Rápida para Webhooks y Consultas de Estado
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_sub ON public.subscriptions (paypal_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_payer ON public.subscriptions (paypal_payer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_order ON public.subscriptions (paypal_order_id);

-- 3. Función auxiliar para verificar si un usuario tiene acceso Pro activo
CREATE OR REPLACE FUNCTION public.is_user_pro(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.subscriptions
        WHERE user_id = target_user_id
          AND status = 'active'
          AND tier IN ('pro_monthly', 'lifetime_single_pass')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
