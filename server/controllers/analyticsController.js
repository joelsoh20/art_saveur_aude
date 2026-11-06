import * as Analytics from '../models/analyticsModel.js';
import { clean } from '../utils/validators.js';

const TYPES = new Set(['pageview', 'click']);
const DEVICES = new Set(['mobile', 'tablet', 'desktop']);
const ID = /^[A-Za-z0-9-]{8,64}$/;

// Anti-spam simple : 120 événements / minute / IP
const hits = new Map();
const tooMany = ip => {
  const now = Date.now(), h = (hits.get(ip) || []).filter(t => now - t < 60e3);
  h.push(now); hits.set(ip, h);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v.at(-1) > 60e3) hits.delete(k);
  return h.length > 120;
};

// Public : enregistre un événement (le front n'envoie rien sans consentement)
export async function collect(req, res) {
  if (tooMany(req.ip)) return res.status(429).end();
  const b = req.body || {};
  if (!ID.test(String(b.visitorId)) || !ID.test(String(b.sessionId)) || !TYPES.has(b.type) || !String(b.path || '').startsWith('/')) return res.status(400).end();
  if (String(b.path).startsWith('/admin')) return res.status(204).end(); // l'espace admin n'est jamais suivi
  await Analytics.insert({
    visitorId: b.visitorId, sessionId: b.sessionId, type: b.type, path: clean(b.path, 120),
    label: clean(b.label, 80) || null, referrer: clean(b.referrer, 80) || null, device: DEVICES.has(b.device) ? b.device : null,
  });
  res.status(204).end();
}

// Admin : synthèse sur 7 / 30 / 90 jours
export async function stats(req, res) {
  const days = [7, 30, 90].includes(Number(req.query.days)) ? Number(req.query.days) : 30;
  res.json({ days, ...(await Analytics.summary(days)) });
}
