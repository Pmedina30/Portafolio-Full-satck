// src/lib/supabase/admin.ts
// Cliente Supabase con Service Role Key para operaciones privilegiadas del backend (Webhooks, Cron jobs, RLS Bypass)

interface SupabaseAdminClient {
  from: (table: string) => {
    upsert: (record: Record<string, any>, options?: any) => Promise<{ data: any; error: any }>;
    update: (updates: Record<string, any>) => {
      eq: (column: string, val: any) => Promise<{ data: any; error: any }>;
    };
    select: (query?: string) => {
      eq: (column: string, val: any) => {
        single: () => Promise<{ data: any; error: any }>;
      };
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Cliente REST seguro para operaciones de administración en Next.js Server Components y API Routes.
 */
export const supabaseAdmin: SupabaseAdminClient = {
  from(table: string) {
    const baseHeaders = {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=representation',
    };

    return {
      async upsert(record: Record<string, any>) {
        if (!supabaseUrl || !serviceRoleKey) {
          console.warn('[SUPABASE_ADMIN_MOCK]: Operación upsert en', table, record);
          return { data: [record], error: null };
        }

        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              ...baseHeaders,
              Prefer: 'resolution=merge-duplicates,return=representation',
            },
            body: JSON.stringify(record),
          });
          const data = await res.json();
          return { data, error: res.ok ? null : data };
        } catch (error) {
          return { data: null, error };
        }
      },

      update(updates: Record<string, any>) {
        return {
          async eq(column: string, val: any) {
            if (!supabaseUrl || !serviceRoleKey) {
              console.warn('[SUPABASE_ADMIN_MOCK]: Operación update en', table, updates, `donde ${column}=${val}`);
              return { data: [updates], error: null };
            }

            try {
              const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${encodeURIComponent(val)}`, {
                method: 'PATCH',
                headers: baseHeaders,
                body: JSON.stringify(updates),
              });
              const data = await res.json();
              return { data, error: res.ok ? null : data };
            } catch (error) {
              return { data: null, error };
            }
          },
        };
      },

      select(query = '*') {
        return {
          eq(column: string, val: any) {
            return {
              async single() {
                if (!supabaseUrl || !serviceRoleKey) {
                  return { data: null, error: null };
                }

                try {
                  const res = await fetch(
                    `${supabaseUrl}/rest/v1/${table}?select=${encodeURIComponent(query)}&${column}=eq.${encodeURIComponent(val)}`,
                    {
                      method: 'GET',
                      headers: baseHeaders,
                    }
                  );
                  const data = await res.json();
                  return { data: Array.isArray(data) ? data[0] : data, error: res.ok ? null : data };
                } catch (error) {
                  return { data: null, error };
                }
              },
            };
          },
        };
      },
    };
  },
};
