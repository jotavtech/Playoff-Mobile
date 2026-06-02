import { Router } from 'express';
import * as controller from './ranking.controller';

export const rankingRouter = Router();

rankingRouter.get('/round/:id', controller.round);
rankingRouter.get('/weekly', controller.weekly);
rankingRouter.get('/global', controller.global);
