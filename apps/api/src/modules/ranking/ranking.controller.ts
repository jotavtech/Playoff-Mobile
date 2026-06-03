import type { NextFunction, Request, Response } from 'express';
import { ok } from '../../utils/response';
import { rankingForRound, rankingGlobal, rankingWeekly } from './ranking.service';

export const round = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { items: await rankingForRound(req.params.id) });
  } catch (err) {
    next(err);
  }
};

export const weekly = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { items: await rankingWeekly() });
  } catch (err) {
    next(err);
  }
};

export const global = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { items: await rankingGlobal() });
  } catch (err) {
    next(err);
  }
};
