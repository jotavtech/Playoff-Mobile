import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import * as controller from './auth.controller';

export const authRouter = Router();

authRouter.post('/spotify/exchange', controller.exchange);
authRouter.get('/me', requireAuth, controller.me);
authRouter.post('/logout', controller.logout);
