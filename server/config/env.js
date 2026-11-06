import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(here, '..', '..');

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5455/art_et_saveur';
export const PGSSL = process.env.PGSSL === '1';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2005';

// Origines autorisées (séparées par des virgules), en plus de la même origine.
// Par défaut : le serveur de dev Vite.
export const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

export const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
export const DIST = path.join(ROOT, 'client', 'dist');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Nombre maximum de joueurs par groupe : le joueur suivant ouvre un nouveau groupe
export const GROUP_SIZE = Number(process.env.GROUP_SIZE) || 10;
