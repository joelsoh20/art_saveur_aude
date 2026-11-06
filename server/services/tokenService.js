import crypto from 'node:crypto';
import * as Setting from '../models/settingModel.js';

// Jeton admin signé (HMAC) : "<expiration>.<signature>"
export const sign = async exp =>
  `${exp}.${crypto.createHmac('sha256', await Setting.get('secret')).update(String(exp)).digest('hex')}`;

export const issue = (ttlMs = 12 * 3600e3) => sign(Date.now() + ttlMs);

export const isValid = async token => {
  const [exp, sig] = String(token || '').split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = (await sign(exp)).split('.')[1];
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
};
