import crypto from 'node:crypto';
import { run } from '../config/database.js';
import { SCHEMA, MIGRATIONS } from '../config/schema.js';
import { DEFAULT_CAKES, DEFAULT_WHATSAPP } from '../config/defaults.js';
import { ADMIN_PASSWORD } from '../config/env.js';
import { hash, isPin } from '../utils/password.js';
import * as Admin from '../models/adminModel.js';
import * as Cake from '../models/cakeModel.js';
import * as Quiz from '../models/quizModel.js';
import * as Setting from '../models/settingModel.js';

// Crée les tables et insère les données initiales (idempotent)
export async function initDb() {
  await run(SCHEMA);
  await run(MIGRATIONS);

  if (!(await Admin.exists())) {
    if (!isPin(ADMIN_PASSWORD)) throw new Error('ADMIN_PASSWORD doit contenir exactement 4 chiffres.');
    await Admin.create(hash(ADMIN_PASSWORD));
  }
  if (!(await Quiz.exists())) await Quiz.create();
  if (!(await Cake.count()))
    for (const [i, c] of DEFAULT_CAKES.entries()) await Cake.insertSeed(c[0], c[1], c[2], c[3], i);
  if (!(await Setting.get('whatsapp'))) await Setting.set('whatsapp', DEFAULT_WHATSAPP);
  if (!(await Setting.get('secret'))) await Setting.set('secret', crypto.randomBytes(32).toString('hex'));
}
