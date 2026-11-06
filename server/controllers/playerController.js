import crypto from 'node:crypto';
import * as Quiz from '../models/quizModel.js';
import * as Player from '../models/playerModel.js';
import * as QuizService from '../services/quizService.js';
import { clean, normPhone, validPhone } from '../utils/validators.js';

export async function join(req, res) {
  const name = clean(req.body.name), phone = normPhone(req.body.phone), quiz = await Quiz.current();
  if (!name) return res.status(400).json({ error: 'Veuillez saisir votre nom.' });
  if (!validPhone(phone)) return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
  let p = await Player.findByQuizAndPhone(quiz.id, phone);
  if (p) {
    if (p.name.toLowerCase() !== name.toLowerCase()) return res.status(409).json({ error: 'Ce numéro est déjà inscrit avec un autre nom.' });
  } else {
    if (quiz.status === 'finished') return res.status(403).json({ error: 'Ce quiz est terminé. Revenez à la prochaine partie !' });
    const token = crypto.randomUUID();
    try { await Player.create(quiz.id, name, phone, token); }
    catch (e) { if (e.code !== '23505') throw e; } // même numéro inscrit en parallèle : on relit le joueur
    p = await Player.findByQuizAndPhone(quiz.id, phone);
    if (p.name.toLowerCase() !== name.toLowerCase()) return res.status(409).json({ error: 'Ce numéro est déjà inscrit avec un autre nom.' });
  }
  res.json({ token: p.token, name: p.name, group: p.group_no });
}

export async function me(req, res) {
  const p = await Player.findByToken(req.params.token);
  if (!p) return res.status(404).json({ error: 'unknown' });
  const quiz = await Quiz.current();
  if (p.quiz_id !== quiz.id) return res.status(404).json({ error: 'old' });
  const qs = await Quiz.questionsOf(quiz.id), { s, n } = await Player.scoreOf(p.id);
  const out = { status: quiz.status, total: qs.length, score: s, answered: n, name: p.name, group: p.group_no, done: n >= qs.length };
  if (quiz.status === 'running' && n < qs.length) out.question = { index: n, text: qs[n].text, options: qs[n].options };
  res.json(out);
}

export async function answer(req, res) {
  const p = await Player.findByToken(String(req.body.token));
  const quiz = await Quiz.current();
  if (!p || p.quiz_id !== quiz.id) return res.status(404).json({ error: 'Joueur inconnu.' });
  if (quiz.status !== 'running') return res.status(403).json({ error: "Le quiz n'est pas en cours." });
  const qs = await Quiz.questionsOf(quiz.id), { n } = await Player.scoreOf(p.id), question = qs[n];
  if (!question || Number(req.body.question) !== n) return res.status(400).json({ error: 'Question invalide.' });
  const choice = Number(req.body.choice), point = choice === question.correct ? 1 : 0;
  await Player.addAnswer(p.id, question.id, choice, point);
  res.json({ correct: question.correct, point, score: (await Player.scoreOf(p.id)).s });
}

// Classement du groupe du joueur (identifié par son jeton) : les groupes ne se mélangent pas
export async function leaderboard(req, res) {
  const quiz = await Quiz.current();
  const p = await Player.findByToken(String(req.query.token || ''));
  if (!p || p.quiz_id !== quiz.id) return res.json([]);
  res.json(await QuizService.groupLeaderboard(quiz.id, p.group_no));
}
