import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Rota não encontrada.' },
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof ZodError) {
    const first = err.errors[0];
    const message = first ? `${first.path.join('.')}: ${first.message}` : 'Dados inválidos.';
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message } });
    return;
  }

  // Unknown error — never leak internals/secrets.
  // eslint-disable-next-line no-console
  console.error('[error]', err instanceof Error ? err.message : err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor.' },
  });
};
