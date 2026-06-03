import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { aiLimiter } from '../../middleware/rate-limit.middleware';
import * as controller from './ai.controller';

export const aiRouter = Router();

// All AI routes require auth and the stricter rate limiter.
aiRouter.use(requireAuth, aiLimiter);

aiRouter.post('/curator', controller.curator);
aiRouter.post('/round-suggestion', controller.roundSuggestion);
aiRouter.post('/round-description', controller.roundDescription);
aiRouter.post('/result-insight', controller.resultInsight);
aiRouter.post('/share-caption', controller.shareCaption);
