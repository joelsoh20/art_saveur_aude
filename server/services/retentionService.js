import { run } from '../config/database.js';

// Applique les durées de conservation annoncées dans la politique de confidentialité :
//  - statistiques de fréquentation : 13 mois
//  - anciennes parties de quiz (joueurs, réponses, questions) : 12 mois (la partie en cours n'est jamais supprimée)
export async function purgeOldData() {
  await run("DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '13 months'");
  await run("DELETE FROM quizzes WHERE created_at < NOW() - INTERVAL '12 months' AND id <> (SELECT MAX(id) FROM quizzes)");
}

// Une fois au démarrage puis chaque jour
export function startRetention() {
  const go = () => purgeOldData().catch(e => console.error('Purge des anciennes données :', e.message));
  go();
  setInterval(go, 24 * 3600e3).unref();
}
