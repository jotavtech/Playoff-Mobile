import { env } from './env';
import { AppError } from '../utils/errors';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

/** Plain shape we expose to the rest of the app for a track. */
export interface SongShape {
  spotifyTrackId: string;
  title: string;
  artist: string;
  album: string | null;
  coverUrl: string;
  previewUrl: string | null;
  externalUrl: string;
  durationMs: number | null;
  popularity: number | null;
}

interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album?: { name?: string; images?: SpotifyImage[] };
  preview_url?: string | null;
  external_urls?: { spotify?: string };
  duration_ms?: number;
  popularity?: number;
}

interface SpotifySearchResponse {
  tracks?: { items?: SpotifyTrack[] };
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

// ---- client-credentials token cache (server-to-server search) ----

let appToken: { value: string; expiresAt: number } | null = null;

const basicAuthHeader = (): string => {
  const credentials = `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

const getAppToken = async (): Promise<string> => {
  const now = Date.now();
  if (appToken && appToken.expiresAt > now + 10_000) {
    return appToken.value;
  }

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
  });

  if (!res.ok) {
    throw AppError.badGateway('Falha ao autenticar com o Spotify.', 'SPOTIFY_AUTH_ERROR');
  }

  const data = (await res.json()) as TokenResponse;
  appToken = {
    value: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return appToken.value;
};

// ---- mapping ----

export const mapTrackToSong = (track: SpotifyTrack): SongShape => {
  const cover = track.album?.images?.[0]?.url ?? '';
  return {
    spotifyTrackId: track.id,
    title: track.name,
    artist: track.artists?.map((a) => a.name).join(', ') ?? 'Desconhecido',
    album: track.album?.name ?? null,
    coverUrl: cover,
    previewUrl: track.preview_url ?? null,
    externalUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
    durationMs: typeof track.duration_ms === 'number' ? track.duration_ms : null,
    popularity: typeof track.popularity === 'number' ? track.popularity : null,
  };
};

// ---- public helpers ----

export const searchTracks = async (query: string, limit = 20): Promise<SongShape[]> => {
  try {
    const token = await getAppToken();
    const params = new URLSearchParams({
      q: query,
      type: 'track',
      limit: String(Math.min(Math.max(limit, 1), 50)),
    });
    const res = await fetch(`${SPOTIFY_API_BASE}/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw AppError.badGateway('Falha ao buscar músicas no Spotify.', 'SPOTIFY_SEARCH_ERROR');
    }
    const data = (await res.json()) as SpotifySearchResponse;
    return (data.tracks?.items ?? []).map(mapTrackToSong);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.badGateway('Spotify indisponível no momento.', 'SPOTIFY_UNAVAILABLE');
  }
};

export const getTrackById = async (trackId: string): Promise<SongShape> => {
  try {
    const token = await getAppToken();
    const res = await fetch(`${SPOTIFY_API_BASE}/tracks/${encodeURIComponent(trackId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 404) {
      throw AppError.notFound('Faixa não encontrada no Spotify.', 'TRACK_NOT_FOUND');
    }
    if (!res.ok) {
      throw AppError.badGateway('Falha ao obter faixa do Spotify.', 'SPOTIFY_TRACK_ERROR');
    }
    const data = (await res.json()) as SpotifyTrack;
    return mapTrackToSong(data);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.badGateway('Spotify indisponível no momento.', 'SPOTIFY_UNAVAILABLE');
  }
};

// ---- PKCE / user-auth flow ----

export interface SpotifyProfile {
  id: string;
  display_name?: string;
  email?: string;
  images?: SpotifyImage[];
}

export interface ExchangeResult {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date;
}

/**
 * Exchange an authorization code (PKCE) for tokens at the Spotify token endpoint.
 */
export const exchangeCodeForTokens = async (
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<ExchangeResult> => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: env.SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    throw AppError.badGateway(
      'Falha ao trocar o código de autorização com o Spotify.',
      'SPOTIFY_EXCHANGE_ERROR',
    );
  }

  const data = (await res.json()) as TokenResponse;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
};

export const refreshUserToken = async (refreshToken: string): Promise<ExchangeResult> => {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: env.SPOTIFY_CLIENT_ID,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    throw AppError.badGateway('Falha ao renovar o token do Spotify.', 'SPOTIFY_REFRESH_ERROR');
  }

  const data = (await res.json()) as TokenResponse;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
};

export const fetchSpotifyProfile = async (accessToken: string): Promise<SpotifyProfile> => {
  const res = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw AppError.badGateway('Falha ao obter o perfil do Spotify.', 'SPOTIFY_PROFILE_ERROR');
  }
  return (await res.json()) as SpotifyProfile;
};
