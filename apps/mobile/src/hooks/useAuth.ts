import { env } from '@playoff/config';
import * as AuthSession from 'expo-auth-session';
import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const SCOPES = ['user-read-email', 'user-read-private', 'user-top-read'];

/** Reads the current auth state. */
export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  return {
    user,
    status,
    isGuest,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}

/**
 * Spotify Authorization Code + PKCE. The mobile app obtains the code and
 * verifier, then hands them to the Atlas backend for the token exchange so the
 * client secret never lives on the device.
 */
export function useSpotifyLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const [exchanging, setExchanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'playoff', path: 'auth/callback' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: env.spotifyClientId,
      scopes: SCOPES,
      usePKCE: true,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery,
  );

  useEffect(() => {
    if (!response) return;
    if (response.type === 'error') {
      setError('A autorização com o Spotify foi cancelada ou falhou.');
      return;
    }
    if (response.type !== 'success' || !request?.codeVerifier) return;

    const code = response.params.code;
    if (!code) return;

    setExchanging(true);
    setError(null);
    authService
      .exchangeSpotifyCode({ code, codeVerifier: request.codeVerifier, redirectUri })
      .then(({ token, user }) => setSession(token, user))
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Não foi possível concluir o login com o Spotify.',
        );
      })
      .finally(() => setExchanging(false));
  }, [response, request, redirectUri, setSession]);

  const login = useCallback(() => {
    setError(null);
    return promptAsync();
  }, [promptAsync]);

  return {
    login,
    error,
    /** False until the auth request is built — disable the button meanwhile. */
    ready: Boolean(request) && Boolean(env.spotifyClientId),
    isLoading: exchanging,
  };
}
