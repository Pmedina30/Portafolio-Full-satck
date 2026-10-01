// src/lib/supabase.ts
// Arquitectura de cliente Supabase Auth con soporte híbrido:
// 1. Conexión nativa a Supabase GoTrue API si existen variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
// 2. Mock persistente en localStorage/cookies para desarrollo local inmediato y pruebas sin credenciales

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

export interface SupabaseSession {
  access_token: string;
  user: SupabaseUser;
  expires_at: number;
}

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';


const SESSION_STORAGE_KEY = 'cvforge_supabase_session';

class SupabaseAuthClient {
  private listeners: Array<(session: SupabaseSession | null) => void> = [];

  constructor() {
    // Capturar sesión tras redirección OAuth (#access_token=...&expires_in=...)
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        try {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const expiresIn = Number(hashParams.get('expires_in')) || 3600;
          const errorDesc = hashParams.get('error_description');

          if (accessToken) {
            const payloadBase64 = accessToken.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));
            const user: SupabaseUser = {
              id: payload.sub,
              email: payload.email || '',
              user_metadata: payload.user_metadata || {},
              created_at: new Date().toISOString(),
            };
            const session: SupabaseSession = {
              access_token: accessToken,
              user,
              expires_at: Date.now() + expiresIn * 1000,
            };
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
            this.notify(session);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          } else if (errorDesc) {
            console.warn('Supabase Auth Redirect Error:', errorDesc);
            sessionStorage.setItem('cvforge_auth_error', decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        } catch (e) {
          console.error('Error parseando parámetros de autenticación:', e);
        }
      }

      // Escuchar cambios de storage entre pestañas
      window.addEventListener('storage', (e) => {
        if (e.key === SESSION_STORAGE_KEY) {
          const session = this.getSessionSync();
          this.notify(session);
        }
      });
    }
  }

  private notify(session: SupabaseSession | null) {
    this.listeners.forEach((callback) => callback(session));
  }

  public getSessionSync(): SupabaseSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed: SupabaseSession = JSON.parse(raw);
      if (parsed.expires_at && parsed.expires_at < Date.now()) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  public async getSession(): Promise<{ data: { session: SupabaseSession | null }; error: Error | null }> {
    return { data: { session: this.getSessionSync() }, error: null };
  }

  public onAuthStateChange(callback: (event: string, session: SupabaseSession | null) => void) {
    this.listeners.push(callback);
    callback('INITIAL_SESSION', this.getSessionSync());

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter((cb) => cb !== callback);
          },
        },
      },
    };
  }

  public async signUp({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options?: { data?: { full_name?: string } };
  }): Promise<{ data: { user: SupabaseUser | null; session: SupabaseSession | null }; error: Error | null }> {
    // Si hay credenciales reales de Supabase configuradas, conectamos directamente con Supabase REST API
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5180';
        const res = await fetch(`${SUPABASE_URL}/auth/v1/signup?redirect_to=${encodeURIComponent(origin)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            email,
            password,
            data: options?.data || {},
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error_description || json.msg || json.message || 'Error en registro');
        }

        const accessToken = json.access_token || json.session?.access_token;
        if (accessToken) {
          const session: SupabaseSession = {
            access_token: accessToken,
            user: json.user,
            expires_at: Date.now() + 3600 * 1000 * 24 * 7,
          };
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
          this.notify(session);
          return { data: { user: json.user, session }, error: null };
        } else {
          // Usuario registrado pero requiere confirmación de correo
          return { data: { user: json.user, session: null }, error: null };
        }
      } catch (err: any) {
        return { data: { user: null, session: null }, error: err };
      }
    }

    // Modo local / demostración de alta fidelidad
    await new Promise((r) => setTimeout(r, 600));

    const newUser: SupabaseUser = {
      id: `usr_${Date.now()}`,
      email,
      user_metadata: {
        full_name: options?.data?.full_name || email.split('@')[0],
      },
      created_at: new Date().toISOString(),
    };

    const session: SupabaseSession = {
      access_token: `cvforge_token_${Date.now()}`,
      user: newUser,
      expires_at: Date.now() + 3600 * 1000 * 24 * 7, // 7 días
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    this.notify(session);

    return { data: { user: newUser, session }, error: null };
  }

  public async signInWithPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ data: { user: SupabaseUser | null; session: SupabaseSession | null }; error: Error | null }> {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ email, password }),
        });

        const json = await res.json();
        if (!res.ok) {
          const rawErr = json.error_description || json.msg || json.message || '';
          if (rawErr.toLowerCase().includes('email not confirmed')) {
            throw new Error('Tu correo electrónico aún no ha sido confirmado. Por favor revisa tu bandeja de entrada o haz clic en el enlace de verificación recibido.');
          }
          if (rawErr.toLowerCase().includes('invalid login credentials')) {
            throw new Error('Credenciales inválidas. Verifica tu correo o contraseña.');
          }
          throw new Error(rawErr || 'Error al iniciar sesión.');
        }

        const session: SupabaseSession = {
          access_token: json.access_token,
          user: json.user,
          expires_at: Date.now() + (json.expires_in || 3600) * 1000,
        };

        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        this.notify(session);
        return { data: { user: json.user, session }, error: null };
      } catch (err: any) {
        return { data: { user: null, session: null }, error: err };
      }
    }

    // Validación local
    await new Promise((r) => setTimeout(r, 600));

    const existingUser: SupabaseUser = {
      id: 'usr_verified_executive',
      email,
      user_metadata: {
        full_name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      },
      created_at: new Date().toISOString(),
    };

    const session: SupabaseSession = {
      access_token: `cvforge_token_${Date.now()}`,
      user: existingUser,
      expires_at: Date.now() + 3600 * 1000 * 24 * 7,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    this.notify(session);

    return { data: { user: existingUser, session }, error: null };
  }

  public async signInWithOAuth({
    provider,
  }: {
    provider: 'github' | 'google';
  }): Promise<{ data: { provider: string; url: string | null }; error: Error | null }> {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const targetUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(
        window.location.origin
      )}`;

      try {
        const check = await fetch(targetUrl, {
          method: 'GET',
          headers: { apikey: SUPABASE_ANON_KEY },
        });

        if (!check.ok) {
          const body = await check.json().catch(() => null);
          if (body?.msg?.includes('not enabled') || check.status === 400) {
            return {
              data: { provider, url: null },
              error: new Error(
                `El inicio con ${provider === 'google' ? 'Google' : 'GitHub'} aún no está habilitado en tu panel de Supabase. Puedes ingresar con Email y Contraseña o habilitar el proveedor en Supabase Auth.`
              ),
            };
          }
        }
      } catch (err: any) {
        // En caso de bloqueo CORS o preflight en cliente, si no es fatal permitimos la navegación
        if (err.message && err.message.includes('habilitado')) {
          return { data: { provider, url: null }, error: err };
        }
      }

      window.location.href = targetUrl;
      return { data: { provider, url: targetUrl }, error: null };
    }

    // Simulación instantánea para desarrollo
    await new Promise((r) => setTimeout(r, 500));
    const providerName = provider === 'github' ? 'GitHub' : 'Google';
    const oauthUser: SupabaseUser = {
      id: `usr_${provider}_${Date.now()}`,
      email: `alex.desarrollador@${provider}.com`,
      user_metadata: {
        full_name: `Alex Rivera (${providerName})`,
        avatar_url:
          provider === 'github'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
            : undefined,
      },
      created_at: new Date().toISOString(),
    };

    const session: SupabaseSession = {
      access_token: `oauth_token_${Date.now()}`,
      user: oauthUser,
      expires_at: Date.now() + 3600 * 1000 * 24 * 7,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    this.notify(session);

    return { data: { provider, url: null }, error: null };
  }

  public async signOut(): Promise<{ error: Error | null }> {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.notify(null);
    return { error: null };
  }
}

export const supabase = {
  auth: new SupabaseAuthClient(),
};
