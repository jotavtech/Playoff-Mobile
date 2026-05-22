import { env } from '@playoff/config';

/**
 * Supabase client factory — implement with @supabase/supabase-js in Phase 3+.
 * Placeholder keeps package boundaries ready for Claude Code implementation.
 */
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
