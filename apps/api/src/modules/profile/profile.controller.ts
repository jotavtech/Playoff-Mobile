import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/errors';
import { ok } from '../../utils/response';
import { getProfile, getUserBadges, getUserHistory, getUserStats } from './profile.service';

const requireUser = (req: Request): string => {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
};

export const profile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, await getProfile(requireUser(req)));
  } catch (err) {
    next(err);
  }
};

export const stats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, await getUserStats(requireUser(req)));
  } catch (err) {
    next(err);
  }
};

export const history = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { items: await getUserHistory(requireUser(req)) });
  } catch (err) {
    next(err);
  }
};

export const badges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ok(res, { badges: await getUserBadges(requireUser(req)) });
  } catch (err) {
    next(err);
  }
};
