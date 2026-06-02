import type { AuthResult, SpotifyExchangePayload, User } from '@playoff/types';
import { api } from './api';

export const authService = {
  /** Exchange a Spotify PKCE auth code for an Atlas session token. */
  exchangeSpotifyCode(payload: SpotifyExchangePayload): Promise<AuthResult> {
    return api.post<AuthResult>('/auth/spotify/exchange', payload, { auth: false });
  },

  me(): Promise<{ user: User }> {
    return api.get<{ user: User }>('/auth/me');
  },

  logout(): Promise<{ ok: boolean }> {
    return api.post<{ ok: boolean }>('/auth/logout');
  },
};
