import { CORS_ORIGINS } from '../config/env.js';

// CORS sans dépendance : trie les requêtes entrantes selon l'en-tête Origin.
// - pas d'Origin (curl, même origine en GET, serveur à serveur) : acceptée
// - Origin identique au Host du serveur (front servi par ce backend) : acceptée
// - Origin présente dans CORS_ORIGINS : acceptée avec les en-têtes CORS
// - toute autre Origin : refusée (403)
export function cors(req, res, next) {
  const origin = req.headers.origin;
  if (!origin) return next();

  let sameOrigin = false;
  try {
    sameOrigin = new URL(origin).host === req.headers.host;
  } catch {
    return res.status(403).json({ error: 'Origine invalide' });
  }

  const allowed = sameOrigin || CORS_ORIGINS.includes(origin);
  if (!allowed) return res.status(403).json({ error: 'Origine non autorisée' });

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type,Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Requête préliminaire (preflight)
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}
