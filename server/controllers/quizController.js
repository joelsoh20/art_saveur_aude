import * as Quiz from '../models/quizModel.js';
import * as QuizService from '../services/quizService.js';
import { clean } from '../utils/validators.js';

const MAX_QUESTIONS = 30;

// Public
export const status = async (req, res) => res.json({ status: (await Quiz.current()).status });

// Admin
export async function saveQuestions(req, res) {
  const quiz = await Quiz.current();
  if (quiz.status === 'running') return res.status(409).json({ error: 'Impossible de modifier pendant le quiz.' });
  if (quiz.status === 'finished') return res.status(409).json({ error: 'Quiz terminé : créez une nouvelle partie.' });
  const qs = req.body.questions;
  if (!Array.isArray(qs) || qs.length < 1 || qs.length > MAX_QUESTIONS) return res.status(400).json({ error: `Il faut entre 1 et ${MAX_QUESTIONS} questions.` });
  for (const [i, x] of qs.entries()) {
    const opts = (x.options || []).map(o => clean(o));
    if (!clean(x.text, 300) || opts.length !== 4 || opts.some(o => !o) || ![0, 1, 2, 3].includes(Number(x.correct)))
      return res.status(400).json({ error: `Question ${i + 1} incomplète.` });
  }
  if (await Quiz.hasAnswers(quiz.id)) return res.status(409).json({ error: 'Des joueurs ont déjà répondu.' });
  const title = clean(req.body.title, 80);
  if (title) await Quiz.setTitle(quiz.id, title);
  await Quiz.replaceQuestions(quiz.id, qs.map(x => ({ text: clean(x.text, 300), options: x.options.map(o => clean(o)), correct: Number(x.correct) })));
  res.json({ ok: true });
}

export async function launch(req, res) {
  const quiz = await Quiz.current();
  if (quiz.status !== 'waiting') return res.status(409).json({ error: 'Ce quiz a déjà été lancé.' });
  await Quiz.start(quiz.id);
  res.json({ ok: true });
}

export async function stop(req, res) {
  await Quiz.finish((await Quiz.current()).id);
  res.json({ ok: true });
}

export async function startNew(req, res) {
  const quiz = await Quiz.current();
  if (quiz.status === 'running') await Quiz.finish(quiz.id);
  await Quiz.create(quiz.id);
  res.json({ ok: true });
}

export const history = async (req, res) => res.json(await Quiz.history());

export async function historyDetail(req, res) {
  const id = Number(req.params.id);
  res.json({ questions: await Quiz.questionsOf(id), players: await QuizService.leaderboard(id, false) });
}
