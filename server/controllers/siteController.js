import QRCode from 'qrcode';
import * as Setting from '../models/settingModel.js';
import * as Quiz from '../models/quizModel.js';
import * as QuizService from '../services/quizService.js';
import { clean, normPhone } from '../utils/validators.js';

const siteUrl = async req => (await Setting.get('siteUrl')) || `${req.protocol}://${req.get('host')}`;

const joinUrl = base => `${base.replace(/\/+$/, '')}/quiz`;

// Public
export const publicInfo = async (req, res) => res.json({ whatsapp: await Setting.get('whatsapp') });

// Admin
export async function adminState(req, res) {
  const quiz = await Quiz.current();
  res.json({
    quiz, questions: await Quiz.questionsOf(quiz.id), players: await QuizService.leaderboard(quiz.id, false),
    siteUrl: await siteUrl(req), joinUrl: joinUrl(await siteUrl(req)), whatsapp: await Setting.get('whatsapp'),
  });
}

export async function updateSettings(req, res) {
  if (req.body.siteUrl !== undefined) await Setting.set('siteUrl', clean(req.body.siteUrl, 300));
  if (req.body.whatsapp !== undefined) await Setting.set('whatsapp', normPhone(req.body.whatsapp).replace(/^\+/, '').slice(0, 20));
  res.json({ ok: true });
}

export async function qrCode(req, res) {
  // Le QR code mène directement au formulaire d'inscription du quiz
  res.type('image/svg+xml').send(await QRCode.toString(joinUrl(await siteUrl(req)), { type: 'svg', margin: 1, color: { dark: '#5a2a35', light: '#ffffff' } }));
}
