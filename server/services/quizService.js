import * as Quiz from '../models/quizModel.js';
import * as Player from '../models/playerModel.js';

// Classement d'un quiz (tous groupes). onlyDone = n'inclure que les joueurs ayant répondu à toutes les questions.
export async function leaderboard(quizId, onlyDone = true) {
  const total = await Quiz.countQuestions(quizId);
  return (await Player.ranking(quizId)).filter(r => !onlyDone || r.answered >= total).map(r => ({ ...r, total }));
}

// Classement public d'un seul groupe (sans numéros de téléphone)
export const groupLeaderboard = async (quizId, group) =>
  (await leaderboard(quizId)).filter(r => r.group_no === group).map(({ name, score }) => ({ name, score }));
