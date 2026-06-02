import type {
  Badge as BadgeModel,
  Round as RoundModel,
  Song as SongModel,
  User as UserModel,
} from '@prisma/client';

// ---- DTO shapes (match the API contract exactly) ----

export interface UserDTO {
  id: string;
  spotifyUserId?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface SongDTO {
  id: string;
  spotifyTrackId: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  previewUrl?: string;
  externalUrl: string;
  durationMs?: number;
  popularity?: number;
}

export interface RoundSongDTO extends SongDTO {
  position: number;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

export interface RoundDTO {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'finished';
  startsAt?: string;
  endsAt?: string;
  winnerSongId?: string;
  totalVotes: number;
  songs: RoundSongDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface BadgeDTO {
  id: string;
  name: string;
  description: string;
  icon?: string;
  earnedAt?: string;
}

const iso = (d: Date): string => d.toISOString();
const undef = <T>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);

export const serializeUser = (u: UserModel): UserDTO => ({
  id: u.id,
  spotifyUserId: undef(u.spotifyUserId),
  name: u.name,
  email: undef(u.email),
  avatarUrl: undef(u.avatarUrl),
  role: u.role === 'ADMIN' ? 'admin' : 'user',
  createdAt: iso(u.createdAt),
  updatedAt: iso(u.updatedAt),
});

export const serializeSong = (s: SongModel): SongDTO => ({
  id: s.id,
  spotifyTrackId: s.spotifyTrackId,
  title: s.title,
  artist: s.artist,
  album: undef(s.album),
  coverUrl: s.coverUrl,
  previewUrl: undef(s.previewUrl),
  externalUrl: s.externalUrl,
  durationMs: undef(s.durationMs),
  popularity: undef(s.popularity),
});

export const computePercentage = (votes: number, total: number): number =>
  total <= 0 ? 0 : Math.round((votes / total) * 100);

export interface RoundSongInput {
  song: SongModel;
  position: number;
  votes: number;
}

export const serializeRound = (round: RoundModel, songs: RoundSongInput[]): RoundDTO => {
  const totalVotes = songs.reduce((sum, s) => sum + s.votes, 0);
  const isFinished = round.status === 'FINISHED';

  const serializedSongs: RoundSongDTO[] = songs
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(({ song, position, votes }) => ({
      ...serializeSong(song),
      position,
      votes,
      percentage: computePercentage(votes, totalVotes),
      isWinner: isFinished && round.winnerSongId === song.id,
    }));

  return {
    id: round.id,
    title: round.title,
    description: undef(round.description),
    status: round.status.toLowerCase() as RoundDTO['status'],
    startsAt: round.startsAt ? iso(round.startsAt) : undefined,
    endsAt: round.endsAt ? iso(round.endsAt) : undefined,
    winnerSongId: undef(round.winnerSongId),
    totalVotes,
    songs: serializedSongs,
    createdAt: iso(round.createdAt),
    updatedAt: iso(round.updatedAt),
  };
};

export const serializeBadge = (b: BadgeModel, earnedAt?: Date | null): BadgeDTO => ({
  id: b.id,
  name: b.name,
  description: b.description,
  icon: undef(b.icon),
  earnedAt: earnedAt ? iso(earnedAt) : undefined,
});
