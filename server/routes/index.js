import { Router } from 'express';
import publicRoutes from './publicRoutes.js';
import adminRoutes from './adminRoutes.js';
import { notFoundApi } from '../middlewares/errorHandler.js';

const api = Router();
api.use('/admin', adminRoutes);
api.use(publicRoutes);
api.use(notFoundApi);
export default api;
