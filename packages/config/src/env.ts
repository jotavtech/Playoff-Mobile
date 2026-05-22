/**
 * Public env vars (EXPO_PUBLIC_*) — safe for client bundle.
 * Secrets must NEVER be prefixed with EXPO_PUBLIC_.
 */
export const env = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  spotifyClientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '',
  spotifyRedirectUri: process.env.EXPO_PUBLIC_SPOTIFY_REDIRECT_URI ?? 'playoff://auth/callback',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
} as const;

export function assertPublicEnv(): void {
  const required = ['supabaseUrl', 'supabaseAnonKey', 'spotifyClientId'] as const;
  for (const key of required) {
    if (!env[key]) {
      console.warn(`[env] Missing EXPO_PUBLIC config: ${key}`);
    }
  }
}
