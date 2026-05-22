import { env } from '@playoff/config';

export const spotifyConfig = {
  clientId: env.spotifyClientId,
  redirectUri: env.spotifyRedirectUri,
  scopes: [
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'streaming',
  ] as const,
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
} as const;

export function isSpotifyConfigured(): boolean {
  return Boolean(spotifyConfig.clientId);
}
