import { prisma } from '../../lib/prisma';
import { getTrackById } from '../../lib/spotify';
import type { SongShape } from '../../lib/spotify';
import { AppError } from '../../utils/errors';
import { serializeRound, type RoundDTO, type RoundSongInput } from '../../utils/serializers';
import type { Song } from '@prisma/client';

/** Upsert a Song row from a Spotify track shape. */
export const upsertSong = async (track: SongShape): Promise<Song> =>
  prisma.song.upsert({
    where: { spotifyTrackId: track.spotifyTrackId },
    create: {
      spotifyTrackId: track.spotifyTrackId,
      title: track.title,
      artist: track.artist,
      album: track.album,
      coverUrl: track.coverUrl,
      previewUrl: track.previewUrl,
      externalUrl: track.externalUrl,
      durationMs: track.durationMs,
      popularity: track.popularity,
    },
    update: {
      title: track.title,
      artist: track.artist,
      album: track.album,
      coverUrl: track.coverUrl,
      previewUrl: track.previewUrl,
      externalUrl: track.externalUrl,
      durationMs: track.durationMs,
      popularity: track.popularity,
    },
  });

/** Load a round with its songs + vote counts and serialize to the API shape. */
export const loadRoundDTO = async (roundId: string): Promise<RoundDTO> => {
  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: { songs: { include: { song: true } } },
  });
  if (!round) {
    throw AppError.notFound('Rodada não encontrada.', 'ROUND_NOT_FOUND');
  }

  const voteGroups = await prisma.vote.groupBy({
    by: ['songId'],
    where: { roundId },
    _count: { songId: true },
  });
  const voteMap = new Map<string, number>();
  for (const group of voteGroups) {
    voteMap.set(group.songId, group._count.songId);
  }

  const songs: RoundSongInput[] = round.songs.map((rs) => ({
    song: rs.song,
    position: rs.position,
    votes: voteMap.get(rs.songId) ?? 0,
  }));

  return serializeRound(round, songs);
};

export const listRounds = async (): Promise<RoundDTO[]> => {
  const rounds = await prisma.round.findMany({ orderBy: { createdAt: 'desc' } });
  return Promise.all(rounds.map((r) => loadRoundDTO(r.id)));
};

export const getActiveRound = async (): Promise<RoundDTO | null> => {
  const round = await prisma.round.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { startsAt: 'desc' },
  });
  return round ? loadRoundDTO(round.id) : null;
};

export interface CreateRoundInput {
  title: string;
  description?: string;
  songSpotifyIds: string[];
  createdById: string;
}

export const createRound = async (input: CreateRoundInput): Promise<RoundDTO> => {
  // Fetch + upsert all songs first (outside the transaction; Spotify is network).
  const tracks: Song[] = [];
  for (const spotifyId of input.songSpotifyIds) {
    const track = await getTrackById(spotifyId);
    tracks.push(await upsertSong(track));
  }

  const round = await prisma.round.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      status: 'DRAFT',
      createdById: input.createdById,
      songs: {
        create: tracks.map((song, index) => ({
          songId: song.id,
          position: index + 1,
        })),
      },
    },
  });

  return loadRoundDTO(round.id);
};

export const startRound = async (roundId: string): Promise<RoundDTO> => {
  const round = await prisma.round.findUnique({ where: { id: roundId } });
  if (!round) throw AppError.notFound('Rodada não encontrada.', 'ROUND_NOT_FOUND');
  if (round.status === 'FINISHED') {
    throw AppError.conflict('Rodada já foi finalizada.', 'ROUND_FINISHED');
  }

  await prisma.round.update({
    where: { id: roundId },
    data: { status: 'ACTIVE', startsAt: new Date() },
  });

  return loadRoundDTO(roundId);
};

export const finishRound = async (roundId: string): Promise<RoundDTO> => {
  const round = await prisma.round.findUnique({ where: { id: roundId } });
  if (!round) throw AppError.notFound('Rodada não encontrada.', 'ROUND_NOT_FOUND');

  const voteGroups = await prisma.vote.groupBy({
    by: ['songId'],
    where: { roundId },
    _count: { songId: true },
    orderBy: { _count: { songId: 'desc' } },
  });

  const winnerSongId = voteGroups.length > 0 ? voteGroups[0].songId : null;

  await prisma.round.update({
    where: { id: roundId },
    data: {
      status: 'FINISHED',
      endsAt: new Date(),
      winnerSongId,
    },
  });

  return loadRoundDTO(roundId);
};
