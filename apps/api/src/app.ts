import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { globalLimiter } from './middleware/rate-limit.middleware';
import { aiRouter } from './modules/ai/ai.routes';
import { authRouter } from './modules/auth/auth.routes';
import { meRouter } from './modules/profile/profile.routes';
import { rankingRouter } from './modules/ranking/ranking.routes';
import { roundsRouter } from './modules/rounds/rounds.routes';
import { spotifyRouter } from './modules/spotify/spotify.routes';

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(globalLimiter);

  // Health check — no integrations required.
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/auth', authRouter);
  app.use('/spotify', spotifyRouter);
  app.use('/rounds', roundsRouter);
  app.use('/ranking', rankingRouter);
  app.use('/ai', aiRouter);
  app.use('/me', meRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
