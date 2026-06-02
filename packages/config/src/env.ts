/**
 * Public env vars (EXPO_PUBLIC_*) — safe for the client bundle.
 * The mobile app talks ONLY to the Atlas backend. Secrets (OpenAI key,
 * Spotify client secret) live on the backend and are NEVER referenced here.
 */
export const env = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  /** Atlas backend base URL. */
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333',
  /** Public Spotify client id — used for the PKCE auth request only. */
  spotifyClientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '',
  spotifyRedirectUri: process.env.EXPO_PUBLIC_SPOTIFY_REDIRECT_URI ?? 'playoff://auth/callback',
} as const;

export function assertPublicEnv(): void {
  if (!env.apiUrl) console.warn('[env] Missing EXPO_PUBLIC_API_URL');
  if (!env.spotifyClientId)
    console.warn('[env] Missing EXPO_PUBLIC_SPOTIFY_CLIENT_ID (Spotify login disabled)');
}
