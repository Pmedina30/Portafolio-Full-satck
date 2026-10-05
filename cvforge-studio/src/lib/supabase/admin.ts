// src/lib/supabase/admin.ts
// Cliente Supabase con Service Role Key para operaciones privilegiadas del backend (Webhooks, API Routes, RLS Bypass)

export interface QueryFilterBuilder {
  eq: (column: string, val: any) => QueryFilterBuilder;
  single: () => Promise<{ data: any; error: any }>;
  then: <TResult1 = { data: any; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ) => Promise<TResult1 | TResult2>;
}

export interface SupabaseAdminClient {
  auth: {
    getUser: (token: string) => Promise<{ data: { user: any | null }; error: any | null }>;
  };
  from: (table: string) => {
    upsert: (record: Record<string, any>, options?: any) => Promise<{ data: any; error: any }> & {
      select: () => Promise<{ data: any; error: any }> & {
        single: () => Promise<{ data: any; error: any }>;
      };
    };
    update: (updates: Record<string, any>) => {
      eq: (column: string, val: any) => Promise<{ data: any; error: any }>;
    };
    select: (query?: string) => QueryFilterBuilder;
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Cliente REST seguro para operaciones de administración en Next.js Server Components y API Routes.
 */
export const supabaseAdmin: SupabaseAdminClient = {
  auth: {
    async getUser(token: string) {
      if (!supabaseUrl || !token) {
        return { data: { user: null }, error: new Error('Token ausente') };
      }
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          },
        });
        if (res.ok) {
          const user = await res.json();
          return { data: { user }, error: null };
        }
        return { data: { user: null }, error: await res.json() };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },
  },

  from(table: string) {
    const baseHeaders = {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=representation',
    };

    return {
      upsert(record: Record<string, any>) {
        const runUpsert = async () => {
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
        };

        const promise = runUpsert() as any;
        promise.select = () => {
          const sel = runUpsert() as any;
          sel.single = () => runUpsert();
          return sel;
        };
        return promise;
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
        const filters: Array<{ column: string; val: any }> = [];

        const executeQuery = async () => {
          if (!supabaseUrl || !serviceRoleKey) {
            return { data: null, error: null };
          }

          try {
            const filterQuery = filters
              .map((f) => `&${f.column}=eq.${encodeURIComponent(f.val)}`)
              .join('');
            const res = await fetch(
              `${supabaseUrl}/rest/v1/${table}?select=${encodeURIComponent(query)}${filterQuery}`,
              {
                method: 'GET',
                headers: baseHeaders,
              }
            );
            const data = await res.json();
            return { data, error: res.ok ? null : data };
          } catch (error) {
            return { data: null, error };
          }
        };

        const builder: QueryFilterBuilder = {
          eq(column: string, val: any) {
            filters.push({ column, val });
            return builder;
          },
          async single() {
            const { data, error } = await executeQuery();
            return { data: Array.isArray(data) ? data[0] : data, error };
          },
          then(onfulfilled, onrejected) {
            return executeQuery().then(onfulfilled, onrejected);
          },
        };

        return builder;
      },
    };
  },
};
