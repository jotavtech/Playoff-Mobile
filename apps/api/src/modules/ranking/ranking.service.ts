import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/errors';
import { computePercentage, serializeSong, type SongDTO } from '../../utils/serializers';

export interface RankingItem {
  position: number;
  song: SongDTO;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

interface AggregatedVote {
  songId: string;
  _count: { songId: number };
}

const buildRanking = async (
  groups: AggregatedVote[],
  winnerSongIds: Set<string>,
): Promise<RankingItem[]> => {
  if (groups.length === 0) return [];

  const total = groups.reduce((sum, g) => sum + g._count.songId, 0);
  const songIds = groups.map((g) => g.songId);
  const songs = await prisma.song.findMany({ where: { id: { in: songIds } } });
  const songMap = new Map(songs.map((s) => [s.id, s]));

  return groups
    .filter((g) => songMap.has(g.songId))
    .map((g, index) => {
      const song = songMap.get(g.songId)!;
      const votes = g._count.songId;
      return {
        position: index + 1,
        song: serializeSong(song),
        votes,
        percentage: computePercentage(votes, total),
        isWinner: winnerSongIds.has(g.songId),
      };
    });
};

export const rankingForRound = async (roundId: string): Promise<RankingItem[]> => {
  const round = await prisma.round.findUnique({ where: { id: roundId } });
  if (!round) throw AppError.notFound('Rodada não encontrada.', 'ROUND_NOT_FOUND');

  const groups = await prisma.vote.groupBy({
    by: ['songId'],
    where: { roundId },
    _count: { songId: true },
    orderBy: { _count: { songId: 'desc' } },
  });

  const winners = new Set<string>();
  if (round.status === 'FINISHED' && round.winnerSongId) {
    winners.add(round.winnerSongId);
  }

  return buildRanking(groups, winners);
};

const rankByWindow = async (since?: Date): Promise<RankingItem[]> => {
  const groups = await prisma.vote.groupBy({
    by: ['songId'],
    where: since ? { createdAt: { gte: since } } : undefined,
    _count: { songId: true },
    orderBy: { _count: { songId: 'desc' } },
    take: 50,
  });

  // Mark a song as winner if it has won any finished round.
  const winnerRounds = await prisma.round.findMany({
    where: { status: 'FINISHED', winnerSongId: { not: null } },
    select: { winnerSongId: true },
  });
  const winners = new Set(
    winnerRounds.map((r) => r.winnerSongId).filter((id): id is string => Boolean(id)),
  );

  return buildRanking(groups, winners);
};

export const rankingWeekly = (): Promise<RankingItem[]> => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return rankByWindow(since);
};

export const rankingGlobal = (): Promise<RankingItem[]> => rankByWindow();
