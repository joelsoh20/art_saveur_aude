import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { UPLOAD_DIR, DIST } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));
  app.use('/api', apiRoutes);
  app.use(errorHandler);

  // Front React (build Vite)
  if (fs.existsSync(DIST)) {
    app.use(express.static(DIST));
    app.get('*', (req, res) => res.sendFile(path.join(DIST, 'index.html')));
  }
  return app;
}
