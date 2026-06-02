import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/errors';
import {
  serializeBadge,
  serializeUser,
  type BadgeDTO,
  type UserDTO,
} from '../../utils/serializers';

export interface ProfileStats {
  votesCount: number;
  roundsCount: number;
  correctCount: number;
}

export interface HistoryItem {
  voteId: string;
  round: { id: string; title: string; status: 'draft' | 'active' | 'finished' };
  song: { id: string; title: string; artist: string; coverUrl: string };
  result: 'won' | 'lost' | 'pending';
  createdAt: string;
}

export interface Profile {
  user: UserDTO;
  stats: ProfileStats;
  badges: BadgeDTO[];
}

export const getUserStats = async (userId: string): Promise<ProfileStats> => {
  const votes = await prisma.vote.findMany({
    where: { userId },
    include: { round: { select: { status: true, winnerSongId: true } } },
  });

  const votesCount = votes.length;
  const roundsCount = new Set(votes.map((v) => v.roundId)).size;
  const correctCount = votes.filter(
    (v) => v.round.status === 'FINISHED' && v.round.winnerSongId === v.songId,
  ).length;

  return { votesCount, roundsCount, correctCount };
};

export const getUserHistory = async (userId: string): Promise<HistoryItem[]> => {
  const votes = await prisma.vote.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      round: { select: { id: true, title: true, status: true, winnerSongId: true } },
      song: { select: { id: true, title: true, artist: true, coverUrl: true } },
    },
  });

  return votes.map((v) => {
    let result: HistoryItem['result'] = 'pending';
    if (v.round.status === 'FINISHED') {
      result = v.round.winnerSongId === v.songId ? 'won' : 'lost';
    }
    return {
      voteId: v.id,
      round: {
        id: v.round.id,
        title: v.round.title,
        status: v.round.status.toLowerCase() as HistoryItem['round']['status'],
      },
      song: {
        id: v.song.id,
        title: v.song.title,
        artist: v.song.artist,
        coverUrl: v.song.coverUrl,
      },
      result,
      createdAt: v.createdAt.toISOString(),
    };
  });
};

export const getUserBadges = async (userId: string): Promise<BadgeDTO[]> => {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    orderBy: { earnedAt: 'desc' },
    include: { badge: true },
  });
  return userBadges.map((ub) => serializeBadge(ub.badge, ub.earnedAt));
};

export const getProfile = async (userId: string): Promise<Profile> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('Usuário não encontrado.', 'USER_NOT_FOUND');

  const [stats, badges] = await Promise.all([getUserStats(userId), getUserBadges(userId)]);

  return { user: serializeUser(user), stats, badges };
};
