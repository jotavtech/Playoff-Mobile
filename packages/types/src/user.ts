export type User = {
  id: string;
  spotifyId: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
};

export type UserSettings = {
  userId: string;
  reducedMotion: boolean;
  lowEndMode: boolean;
  hapticsEnabled: boolean;
};
