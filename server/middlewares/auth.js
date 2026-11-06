import { ah } from './asyncHandler.js';
import * as Token from '../services/tokenService.js';

// Protège les routes admin (jeton dans l'en-tête x-admin-token ou ?t=)
export const requireAdmin = ah(async (req, res, next) =>
  (await Token.isValid(req.get('x-admin-token') || req.query.t)) ? next() : res.status(401).json({ error: 'Non autorisé' }));
