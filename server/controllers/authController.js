import * as Admin from '../models/adminModel.js';
import * as Token from '../services/tokenService.js';
import { loginLimiter } from '../middlewares/loginLimiter.js';
import { hash, verify, isPin } from '../utils/password.js';

export async function login(req, res) {
  const ip = req.ip;
  if (loginLimiter.blocked(ip)) return res.status(429).json({ error: 'Trop de tentatives, réessayez plus tard.' });
  const admin = await Admin.first();
  if (!verify(String(req.body.password || ''), admin.password_hash)) {
    loginLimiter.fail(ip);
    return res.status(401).json({ error: 'Mot de passe incorrect.' });
  }
  loginLimiter.reset(ip);
  res.json({ token: await Token.issue() });
}

export async function changePassword(req, res) {
  const pw = String(req.body.password || '');
  if (!isPin(pw)) return res.status(400).json({ error: 'Le mot de passe doit contenir exactement 4 chiffres.' });
  await Admin.updatePassword(hash(pw));
  res.json({ ok: true });
}
