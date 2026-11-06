// Limite les tentatives de connexion admin : 8 échecs max par IP sur 15 minutes
const WINDOW = 15 * 60e3, MAX = 8;
const attempts = new Map();

export const loginLimiter = {
  blocked(ip) {
    const a = attempts.get(ip);
    if (!a) return false;
    if (Date.now() - a.t > WINDOW) { attempts.delete(ip); return false; }
    return a.n >= MAX;
  },
  fail(ip) {
    const a = attempts.get(ip);
    if (!a || Date.now() - a.t > WINDOW) attempts.set(ip, { n: 1, t: Date.now() });
    else a.n++;
  },
  reset: ip => attempts.delete(ip),
};
