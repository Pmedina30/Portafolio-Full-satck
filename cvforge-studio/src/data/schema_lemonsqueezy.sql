-- ==============================================================================
-- CVForge Studio — Migración Supabase para Lemon Squeezy (MoR Payments)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Actualizar tabla de Subscriptions para Lemon Squeezy
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS lemon_customer_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_order_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_variant_id TEXT;

-- 2. Índices de Búsqueda Rápida para Webhooks
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_sub ON public.subscriptions (lemon_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_cust ON public.subscriptions (lemon_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_order ON public.subscriptions (lemon_order_id);

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
