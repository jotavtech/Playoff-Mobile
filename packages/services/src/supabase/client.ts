import { env } from '@playoff/config';

export type SupabaseClientConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseConfig(): SupabaseClientConfig {
  return {
    url: env.supabaseUrl,
    anonKey: env.supabaseAnonKey,
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}
