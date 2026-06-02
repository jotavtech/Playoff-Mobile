import { prisma } from '../../lib/prisma';
import { exchangeCodeForTokens, fetchSpotifyProfile } from '../../lib/spotify';
import { signToken } from '../../middleware/auth.middleware';
import { serializeUser, type UserDTO } from '../../utils/serializers';

export interface AuthResult {
  token: string;
  user: UserDTO;
}

/**
 * Full PKCE login flow:
 * 1. Exchange the authorization code for Spotify tokens.
 * 2. Fetch the Spotify profile.
 * 3. Upsert our User by spotifyUserId, storing tokens.
 * 4. Issue a backend JWT.
 */
export const loginWithSpotifyCode = async (
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<AuthResult> => {
  const tokens = await exchangeCodeForTokens(code, codeVerifier, redirectUri);
  const profile = await fetchSpotifyProfile(tokens.accessToken);

  const name = profile.display_name?.trim() || `Atlas User ${profile.id.slice(0, 6)}`;
  const avatarUrl = profile.images?.[0]?.url ?? null;
  const email = profile.email ?? null;

  const user = await prisma.user.upsert({
    where: { spotifyUserId: profile.id },
    create: {
      spotifyUserId: profile.id,
      name,
      email,
      avatarUrl,
      spotifyAccessToken: tokens.accessToken,
      spotifyRefreshToken: tokens.refreshToken,
      spotifyTokenExpiresAt: tokens.expiresAt,
    },
    update: {
      name,
      email,
      avatarUrl,
      spotifyAccessToken: tokens.accessToken,
      // Spotify may omit a new refresh token; keep the previous one if so.
      ...(tokens.refreshToken ? { spotifyRefreshToken: tokens.refreshToken } : {}),
      spotifyTokenExpiresAt: tokens.expiresAt,
    },
  });

  const token = signToken({
    id: user.id,
    role: user.role === 'ADMIN' ? 'admin' : 'user',
  });

  return { token, user: serializeUser(user) };
};
