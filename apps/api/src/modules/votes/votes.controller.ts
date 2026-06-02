import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../../utils/errors';
import { ok } from '../../utils/response';
import { castVote } from './votes.service';
import { getUserHistory } from '../profile/profile.service';

const voteSchema = z.object({ songId: z.string().min(1, 'songId obrigatório.') });

export const vote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw AppError.unauthorized();
    const { songId } = voteSchema.parse(req.body);
    const round = await castVote(req.user.id, req.params.id, songId);
    ok(res, { round });
  } catch (err) {
    next(err);
  }
};

/** GET /me/votes — shares the history serializer. */
export const myVotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw AppError.unauthorized();
    ok(res, { items: await getUserHistory(req.user.id) });
  } catch (err) {
    next(err);
  }
};
