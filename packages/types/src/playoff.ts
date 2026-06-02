/**
 * Atlas Playoff — shared domain contract.
 * These shapes are the canonical JSON returned by the Atlas backend API
 * and consumed by the mobile app. Keep backend responses identical to these.
 */

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  spotifyUserId?: string | null;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Song {
  /** Stable identifier — DB id when persisted, otherwise the Spotify track id. */
  id: string;
  spotifyTrackId: string;
  title: string;
  artist: string;
  album?: string | null;
  coverUrl: string;
  previewUrl?: string | null;
  externalUrl: string;
  durationMs?: number | null;
  popularity?: number | null;
}

export type RoundStatus = 'draft' | 'active' | 'finished';

/** A song as it appears inside a round, carrying its live tally. */
export interface RoundSong extends Song {
  position: number;
  votes: number;
  /** 0–100, share of the round's total votes. */
  percentage: number;
  isWinner: boolean;
}

export interface Round {
  id: string;
  title: string;
  description?: string | null;
  status: RoundStatus;
  startsAt?: string | null;
  endsAt?: string | null;
  winnerSongId?: string | null;
  totalVotes: number;
  songs: RoundSong[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileStats {
  votesCount: number;
  roundsCount: number;
  correctCount: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  earnedAt?: string | null;
}

export interface Profile {
  user: User;
  stats: ProfileStats;
  badges: Badge[];
}

export type VoteResult = 'won' | 'lost' | 'pending';

export interface HistoryItem {
  voteId: string;
  round: { id: string; title: string; status: RoundStatus };
  song: { id: string; title: string; artist: string; coverUrl: string };
  result: VoteResult;
  createdAt: string;
}

export interface RankingItem {
  position: number;
  song: Song;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

export type RankingScope = 'round' | 'weekly' | 'global';

/** AI curator response — text plus optional resolved, real Spotify songs. */
export interface AiCuratorResult {
  message: string;
  roundName?: string;
  roundDescription?: string;
  criteria?: string;
  searchTerms?: string[];
  songs?: Song[];
}

/** PKCE auth exchange payload sent from the mobile app to the backend. */
export interface SpotifyExchangePayload {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

export interface AuthResult {
  token: string;
  user: User;
}
