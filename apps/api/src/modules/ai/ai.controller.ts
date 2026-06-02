import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ok } from '../../utils/response';
import * as service from './ai.service';

const promptSchema = z.object({ prompt: z.string().min(1, 'prompt obrigatório.') });
const roundIdSchema = z.object({ roundId: z.string().min(1, 'roundId obrigatório.') });

export const curator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { prompt } = promptSchema.parse(req.body);
    ok(res, await service.curator(req.user?.id, prompt));
  } catch (err) {
    next(err);
  }
};

export const roundSuggestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { prompt } = promptSchema.parse(req.body);
    ok(res, await service.roundSuggestion(req.user?.id, prompt));
  } catch (err) {
    next(err);
  }
};

export const roundDescription = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { roundId } = roundIdSchema.parse(req.body);
    ok(res, { description: await service.roundDescription(req.user?.id, roundId) });
  } catch (err) {
    next(err);
  }
};

export const resultInsight = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { roundId } = roundIdSchema.parse(req.body);
    ok(res, { insight: await service.resultInsight(req.user?.id, roundId) });
  } catch (err) {
    next(err);
  }
};

export const shareCaption = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { roundId } = roundIdSchema.parse(req.body);
    ok(res, { caption: await service.shareCaption(req.user?.id, roundId) });
  } catch (err) {
    next(err);
  }
};
