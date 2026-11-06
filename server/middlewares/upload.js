import multer from 'multer';
import crypto from 'node:crypto';
import { UPLOAD_DIR } from '../config/env.js';

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

export const uploadImage = multer({
  storage: multer.diskStorage({ destination: UPLOAD_DIR, filename: (r, f, cb) => cb(null, crypto.randomUUID() + (EXT[f.mimetype] || '.bin')) }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (r, f, cb) => cb(null, f.mimetype in EXT),
}).single('image');
