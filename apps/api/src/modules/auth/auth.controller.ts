import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/errors';
import { ok } from '../../utils/response';
import { serializeUser } from '../../utils/serializers';
import { loginWithSpotifyCode } from './spotify-auth.service';

const exchangeSchema = z.object({
  code: z.string().min(1, 'code obrigatório.'),
  codeVerifier: z.string().min(1, 'codeVerifier obrigatório.'),
  redirectUri: z.string().min(1, 'redirectUri obrigatório.'),
});

export const exchange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, codeVerifier, redirectUri } = exchangeSchema.parse(req.body);
    const result = await loginWithSpotifyCode(code, codeVerifier, redirectUri);
    ok(res, result);
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw AppError.unauthorized();
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw AppError.notFound('Usuário não encontrado.', 'USER_NOT_FOUND');
    ok(res, { user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  // Stateless JWT: client discards the token. Endpoint exists for symmetry.
  ok(res, { ok: true });
};
