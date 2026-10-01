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
    // Escuchar cambios de storage entre pestañas
    if (typeof window !== 'undefined') {
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
        const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
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

        const session: SupabaseSession = {
          access_token: json.access_token || `tok_${Date.now()}`,
          user: json.user,
          expires_at: Date.now() + 3600 * 1000 * 24 * 7,
        };

        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        this.notify(session);
        return { data: { user: json.user, session }, error: null };
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
          throw new Error(json.error_description || json.msg || json.message || 'Credenciales inválidas');
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
      window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(
        window.location.origin
      )}`;
      return { data: { provider, url: null }, error: null };
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
