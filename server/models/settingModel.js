import { one, run } from '../config/database.js';

export const get = async (key, def = '') => (await one('SELECT value FROM settings WHERE key=$1', [key]))?.value ?? def;
export const set = (key, value) =>
  run('INSERT INTO settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value', [key, value]);
