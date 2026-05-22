import { createClient, type SupabaseClientOptions } from '@supabase/supabase-js';

import { getSupabaseConfig } from './client';
import type { PlayoffSupabase, SupabaseStorageAdapter } from './types';

export function createSupabaseClient(
  storage?: SupabaseStorageAdapter,
  options?: SupabaseClientOptions<'public'>,
): PlayoffSupabase {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    throw new Error(
      'Supabase não configurado: defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  return createClient(url, anonKey, {
    auth: {
      storage: storage ?? undefined,
      autoRefreshToken: true,
      persistSession: Boolean(storage),
      detectSessionInUrl: false,
    },
    ...options,
  });
}
