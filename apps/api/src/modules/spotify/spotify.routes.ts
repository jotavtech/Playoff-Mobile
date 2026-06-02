import { Router } from 'express';
import * as controller from './spotify.controller';

export const spotifyRouter = Router();

spotifyRouter.get('/search', controller.search);
spotifyRouter.get('/tracks/:id', controller.track);
