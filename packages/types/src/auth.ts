export type AuthProvider = 'spotify';

export type AuthSession = {
  userId: string;
  provider: AuthProvider;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type SpotifyProfile = {
  id: string;
  displayName: string;
  email: string | null;
  imageUrl: string | null;
};
