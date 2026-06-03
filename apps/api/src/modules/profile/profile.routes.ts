import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { myVotes } from '../votes/votes.controller';
import * as controller from './profile.controller';

/** Mounted at /me — all routes require auth. */
export const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get('/votes', myVotes);
meRouter.get('/profile', controller.profile);
meRouter.get('/stats', controller.stats);
meRouter.get('/history', controller.history);
meRouter.get('/badges', controller.badges);
