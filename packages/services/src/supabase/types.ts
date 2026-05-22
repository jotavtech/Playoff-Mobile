import type { SupabaseClient } from '@supabase/supabase-js';

export type PlayoffSupabase = SupabaseClient;

export type SupabaseStorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};
