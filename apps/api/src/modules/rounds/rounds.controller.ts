import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../../utils/errors';
import { created, ok } from '../../utils/response';
import {
  createRound,
  finishRound,
  getActiveRound,
  listRounds,
  loadRoundDTO,
  startRound,
} from './rounds.service';

const createSchema = z.object({
  title: z.string().min(1, 'Título obrigatório.'),
  description: z.string().optional(),
  songSpotifyIds: z.array(z.string().min(1)).length(4, 'Informe exatamente 4 músicas.'),
});

export const getActive = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    ok(res, { round: await getActiveRound() });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { rounds: await listRounds() });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { round: await loadRoundDTO(req.params.id) });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw AppError.unauthorized();
    const body = createSchema.parse(req.body);
    const round = await createRound({ ...body, createdById: req.user.id });
    created(res, { round });
  } catch (err) {
    next(err);
  }
};

export const start = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { round: await startRound(req.params.id) });
  } catch (err) {
    next(err);
  }
};

export const finish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { round: await finishRound(req.params.id) });
  } catch (err) {
    next(err);
  }
};
