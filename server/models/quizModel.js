import { q, one, run, tx } from '../config/database.js';
import { DEFAULT_QUESTIONS } from '../config/defaults.js';

export const current = () => one('SELECT * FROM quizzes ORDER BY id DESC LIMIT 1');
export const exists = async () => !!(await one('SELECT 1 FROM quizzes'));

export const questionsOf = async quizId =>
  (await q('SELECT * FROM questions WHERE quiz_id=$1 ORDER BY position', [quizId])).map(x => ({ ...x, options: JSON.parse(x.options) }));
export const countQuestions = async quizId => (await one('SELECT COUNT(*)::int c FROM questions WHERE quiz_id=$1', [quizId])).c;

// Crée un quiz (copie des questions d'un quiz précédent, sinon questions par défaut)
export const create = copyFrom => tx(async c => {
  const { id } = await one("INSERT INTO quizzes(title,status) VALUES($1,'waiting') RETURNING id",
    [`Quiz du ${new Date().toLocaleDateString('fr-FR')}`], c);
  const qs = copyFrom
    ? (await q('SELECT text, options, correct FROM questions WHERE quiz_id=$1 ORDER BY position', [copyFrom], c)).map(r => [r.text, JSON.parse(r.options), r.correct])
    : DEFAULT_QUESTIONS;
  for (const [i, x] of qs.entries())
    await run('INSERT INTO questions(quiz_id,position,text,options,correct) VALUES($1,$2,$3,$4,$5)', [id, i, x[0], JSON.stringify(x[1]), x[2]], c);
  return id;
});

export const replaceQuestions = (quizId, questions) => tx(async c => {
  await run('DELETE FROM questions WHERE quiz_id=$1', [quizId], c);
  for (const [i, x] of questions.entries())
    await run('INSERT INTO questions(quiz_id,position,text,options,correct) VALUES($1,$2,$3,$4,$5)',
      [quizId, i, x.text, JSON.stringify(x.options), x.correct], c);
});

export const hasAnswers = async quizId =>
  !!(await one('SELECT 1 FROM answers a JOIN players p ON p.id=a.player_id WHERE p.quiz_id=$1', [quizId]));

export const setTitle = (id, title) => run('UPDATE quizzes SET title=$1 WHERE id=$2', [title, id]);
export const start =id => run("UPDATE quizzes SET status='running', started_at=NOW() WHERE id=$1", [id]);
export const finish = id => run("UPDATE quizzes SET status='finished', ended_at=NOW() WHERE id=$1 AND status!='finished'", [id]);

export const history = () => q(`SELECT z.id,z.title,z.status,z.created_at,z.started_at,z.ended_at,
  (SELECT COUNT(*)::int FROM players WHERE quiz_id=z.id) players FROM quizzes z ORDER BY z.id DESC`);
