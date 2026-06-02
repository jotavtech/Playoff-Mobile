import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/errors';
import { loadRoundDTO } from '../rounds/rounds.service';
import type { RoundDTO } from '../../utils/serializers';

export const castVote = async (
  userId: string,
  roundId: string,
  songId: string,
): Promise<RoundDTO> => {
  const round = await prisma.round.findUnique({ where: { id: roundId } });
  if (!round) throw AppError.notFound('Rodada não encontrada.', 'ROUND_NOT_FOUND');
  if (round.status !== 'ACTIVE') {
    throw AppError.conflict('A rodada não está ativa para votação.', 'ROUND_NOT_ACTIVE');
  }

  // Song must belong to this round.
  const roundSong = await prisma.roundSong.findUnique({
    where: { roundId_songId: { roundId, songId } },
  });
  if (!roundSong) {
    throw AppError.badRequest('Música não pertence a esta rodada.', 'SONG_NOT_IN_ROUND');
  }

  // One vote per user per round — upsert allows changing the chosen song.
  await prisma.vote.upsert({
    where: { userId_roundId: { userId, roundId } },
    create: { userId, roundId, songId },
    update: { songId },
  });

  return loadRoundDTO(roundId);
};
