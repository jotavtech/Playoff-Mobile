import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { vote } from '../votes/votes.controller';
import * as controller from './rounds.controller';

export const roundsRouter = Router();

roundsRouter.get('/active', controller.getActive);
roundsRouter.get('/', controller.getAll);
roundsRouter.get('/:id', controller.getOne);
roundsRouter.post('/', requireAuth, controller.create);
roundsRouter.post('/:id/start', requireAuth, controller.start);
roundsRouter.post('/:id/finish', requireAuth, controller.finish);
roundsRouter.post('/:id/vote', requireAuth, vote);
