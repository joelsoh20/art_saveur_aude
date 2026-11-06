import fs from 'node:fs';
import path from 'node:path';
import { UPLOAD_DIR } from '../config/env.js';

// Supprime l'image d'un gâteau si elle a été téléversée localement
export const rmImage = url => {
  if (url?.startsWith('/uploads/')) fs.rm(path.join(UPLOAD_DIR, path.basename(url)), () => {});
};
