import { Router } from 'express';
import { ah } from '../middlewares/asyncHandler.js';
import * as Cake from '../controllers/cakeController.js';
import * as Site from '../controllers/siteController.js';
import * as Quiz from '../controllers/quizController.js';
import * as Player from '../controllers/playerController.js';
import * as Analytics from '../controllers/analyticsController.js';

const r = Router();
r.get('/cakes', ah(Cake.listPublic));
r.get('/site', ah(Site.publicInfo));
r.get('/quiz/status', ah(Quiz.status));
r.get('/leaderboard', ah(Player.leaderboard));
r.post('/join', ah(Player.join));
r.get('/me/:token', ah(Player.me));
r.post('/answer', ah(Player.answer));
r.post('/analytics/collect', ah(Analytics.collect));
export default r;
