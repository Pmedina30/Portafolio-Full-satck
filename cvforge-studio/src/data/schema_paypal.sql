-- ==============================================================================
-- CVForge Studio — Migración Supabase para Integración de Pagos con PayPal
-- Soporte para: PayPal Subscriptions (Plan Pro), PayPal Orders y Perfiles Pro
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Tabla de Perfiles de Usuario con Estado Pro
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    is_pro BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asegurar columna is_pro si la tabla ya existía
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON public.profiles (is_pro);

-- 2. Actualizar tabla de Subscriptions con columnas específicas de PayPal
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT DEFAULT 'free',
    status TEXT DEFAULT 'inactive',
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS paypal_payer_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_plan_id TEXT;

-- 3. Índices de Búsqueda Rápida para Webhooks y Consultas de Estado
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_sub ON public.subscriptions (paypal_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_payer ON public.subscriptions (paypal_payer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_order ON public.subscriptions (paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions (user_id, status);

-- 4. Función auxiliar para verificar si un usuario tiene acceso Pro activo
CREATE OR REPLACE FUNCTION public.is_user_pro(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = target_user_id AND is_pro = true
    ) OR EXISTS (
        SELECT 1 FROM public.subscriptions
        WHERE user_id = target_user_id
          AND status = 'active'
          AND tier IN ('pro_monthly', 'lifetime_single_pass')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Políticas de Seguridad RLS (Row Level Security)
-- Activar RLS en tablas críticas
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para Resumes: Solo el propietario puede editar o borrar
DROP POLICY IF EXISTS "Users can only view their own resumes or published ones" ON public.resumes;
CREATE POLICY "Users can only view their own resumes or published ones"
ON public.resumes FOR SELECT
USING (auth.uid() = user_id OR is_published = true);

DROP POLICY IF EXISTS "Users can only insert their own resumes" ON public.resumes;
CREATE POLICY "Users can only insert their own resumes"
ON public.resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own resumes" ON public.resumes;
CREATE POLICY "Users can only update their own resumes"
ON public.resumes FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own resumes" ON public.resumes;
CREATE POLICY "Users can only delete their own resumes"
ON public.resumes FOR DELETE
USING (auth.uid() = user_id);

-- Políticas para Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile name/email" ON public.profiles;
CREATE POLICY "Users can update own profile name/email"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);
