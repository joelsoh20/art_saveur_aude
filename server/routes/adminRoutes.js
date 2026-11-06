import { Router } from 'express';
import { ah } from '../middlewares/asyncHandler.js';
import { requireAdmin } from '../middlewares/auth.js';
import { uploadImage } from '../middlewares/upload.js';
import * as Auth from '../controllers/authController.js';
import * as Site from '../controllers/siteController.js';
import * as Quiz from '../controllers/quizController.js';
import * as Cake from '../controllers/cakeController.js';
import * as Analytics from '../controllers/analyticsController.js';

const r = Router();
r.post('/login', ah(Auth.login));

// Tout ce qui suit nécessite d'être connecté
r.use(requireAdmin);
r.post('/password', ah(Auth.changePassword));

r.get('/state', ah(Site.adminState));
r.post('/settings', ah(Site.updateSettings));
r.get('/qr', ah(Site.qrCode));

r.put('/questions', ah(Quiz.saveQuestions));
r.post('/launch', ah(Quiz.launch));
r.post('/stop', ah(Quiz.stop));
r.post('/new', ah(Quiz.startNew));
r.get('/history', ah(Quiz.history));
r.get('/history/:id', ah(Quiz.historyDetail));

r.get('/analytics', ah(Analytics.stats));

r.get('/cakes', ah(Cake.listAll));
r.post('/cakes', uploadImage, ah(Cake.create));
r.put('/cakes/:id', uploadImage, ah(Cake.update));
r.delete('/cakes/:id', ah(Cake.remove));
export default r;
