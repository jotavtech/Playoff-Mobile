import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env';
import { AppError } from '../utils/errors';

export interface AuthUser {
  id: string;
  role: 'user' | 'admin';
}

export interface JwtPayload {
  sub: string;
  role: 'user' | 'admin';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const extractToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
};

const verify = (token: string): AuthUser => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return { id: decoded.sub, role: decoded.role === 'admin' ? 'admin' : 'user' };
  } catch {
    throw AppError.unauthorized('Token inválido ou expirado.', 'INVALID_TOKEN');
  }
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);
  if (!token) {
    next(AppError.unauthorized('Token de autenticação ausente.', 'MISSING_TOKEN'));
    return;
  }
  try {
    req.user = verify(token);
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = verify(token);
    } catch {
      // Ignore invalid tokens for optional auth.
    }
  }
  next();
};

export const signToken = (user: AuthUser): string =>
  jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
