import rateLimit from 'express-rate-limit';

const jsonError = (code: string, message: string) => ({ error: { code, message } });

/** Global limiter applied to all routes. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonError('RATE_LIMITED', 'Muitas requisições. Tente novamente em instantes.'),
});

/** Stricter limiter for the expensive AI endpoints. */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonError(
    'AI_RATE_LIMITED',
    'Você atingiu o limite de pedidos à IA. Aguarde um momento.',
  ),
});
