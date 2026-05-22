import { getSupabaseConfig, isSupabaseConfigured } from '@playoff/services';

export type ConnectionHealth = {
  supabase: 'ok' | 'missing_config' | 'error';
  message?: string;
};

export async function checkSupabaseConnection(): Promise<ConnectionHealth> {
  if (!isSupabaseConfigured()) {
    return {
      supabase: 'missing_config',
      message: 'Adicione EXPO_PUBLIC_SUPABASE_ANON_KEY em apps/mobile/.env (Dashboard → API)',
    };
  }

  try {
    const { url, anonKey } = getSupabaseConfig();
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (res.status === 200 || res.status === 401) {
      // 401 on empty path can mean API is up but RLS blocks — still connected
      return { supabase: res.ok ? 'ok' : 'ok' };
    }
    return { supabase: 'error', message: `HTTP ${res.status}` };
  } catch (e) {
    return {
      supabase: 'error',
      message: e instanceof Error ? e.message : 'Network error',
    };
  }
}
