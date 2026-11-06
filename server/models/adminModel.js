import { one, run } from '../config/database.js';

export const first = () => one('SELECT * FROM admins ORDER BY id LIMIT 1');
export const exists = async () => !!(await one('SELECT 1 FROM admins'));
export const create = passwordHash => run('INSERT INTO admins(password_hash) VALUES($1)', [passwordHash]);
export const updatePassword = passwordHash => run('UPDATE admins SET password_hash=$1', [passwordHash]);
