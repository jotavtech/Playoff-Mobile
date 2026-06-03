import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { getTrackById, searchTracks } from '../../lib/spotify';
import type { SongShape } from '../../lib/spotify';
import { AppError } from '../../utils/errors';
import { ok } from '../../utils/response';
import type { SongDTO } from '../../utils/serializers';

const searchSchema = z.object({
  q: z.string().min(1, 'Parâmetro "q" obrigatório.'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/** A Spotify track shape that has not been persisted has no DB id yet. */
const toSongDTO = (track: SongShape): SongDTO => ({
  id: track.spotifyTrackId,
  spotifyTrackId: track.spotifyTrackId,
  title: track.title,
  artist: track.artist,
  album: track.album ?? undefined,
  coverUrl: track.coverUrl,
  previewUrl: track.previewUrl ?? undefined,
  externalUrl: track.externalUrl,
  durationMs: track.durationMs ?? undefined,
  popularity: track.popularity ?? undefined,
});

export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, limit } = searchSchema.parse(req.query);
    const tracks = await searchTracks(q, limit);
    ok(res, { tracks: tracks.map(toSongDTO) });
  } catch (err) {
    next(err);
  }
};

export const track = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) throw AppError.badRequest('ID da faixa obrigatório.');
    const result = await getTrackById(id);
    ok(res, { track: toSongDTO(result) });
  } catch (err) {
    next(err);
  }
};
