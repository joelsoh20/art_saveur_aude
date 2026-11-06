import { q, one, run, tx } from '../config/database.js';
import { GROUP_SIZE } from '../config/env.js';

export const findByQuizAndPhone = (quizId, phone) => one('SELECT * FROM players WHERE quiz_id=$1 AND phone=$2', [quizId, phone]);
export const findByToken = token => one('SELECT * FROM players WHERE token=$1', [token]);

// Inscrit le joueur dans le dernier groupe s'il n'est pas plein (GROUP_SIZE), sinon ouvre un nouveau groupe.
// Le verrou garantit qu'un groupe ne dépasse jamais sa taille même si plusieurs joueurs arrivent ensemble.
export const create = (quizId, name, phone, token) => tx(async c => {
  await run('SELECT pg_advisory_xact_lock($1)', [quizId], c);
  const last = await one('SELECT group_no g, COUNT(*)::int n FROM players WHERE quiz_id=$1 GROUP BY group_no ORDER BY group_no DESC LIMIT 1', [quizId], c);
  const group = !last ? 1 : last.n >= GROUP_SIZE ? last.g + 1 : last.g;
  await run('INSERT INTO players(quiz_id,name,phone,token,group_no) VALUES($1,$2,$3,$4,$5)', [quizId, name, phone, token, group], c);
  return group;
});

export const scoreOf = playerId =>
  one('SELECT COALESCE(SUM(point),0)::int s, COUNT(*)::int n FROM answers WHERE player_id=$1', [playerId]);
export const addAnswer = (playerId, questionId, choice, point) =>
  run('INSERT INTO answers(player_id,question_id,choice,point) VALUES($1,$2,$3,$4)', [playerId, questionId, choice, point]);

// Classement brut d'un quiz : par groupe, puis score décroissant (égalité : le plus rapide)
export const ranking = quizId => q(`SELECT p.name, p.phone, p.group_no, COALESCE(SUM(a.point),0)::int score, COUNT(a.id)::int answered FROM players p
  LEFT JOIN answers a ON a.player_id=p.id WHERE p.quiz_id=$1 GROUP BY p.id ORDER BY p.group_no, score DESC, MAX(a.answered_at) ASC`, [quizId]);
