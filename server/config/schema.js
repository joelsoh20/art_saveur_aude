export const SCHEMA = `
CREATE TABLE IF NOT EXISTS admins (id SERIAL PRIMARY KEY, password_hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS cakes (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT DEFAULT '', price TEXT DEFAULT '',
  image_url TEXT, emoji TEXT DEFAULT '🍰', position INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY, title TEXT, status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT NOW(), started_at TIMESTAMPTZ, ended_at TIMESTAMPTZ);
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY, quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL, text TEXT NOT NULL, options TEXT NOT NULL, correct INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY, quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  name TEXT NOT NULL, phone TEXT NOT NULL, token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE (quiz_id, phone));
CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY, player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  choice INTEGER NOT NULL, point INTEGER NOT NULL, answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (player_id, question_id));
`;

// Migration : groupe de jeu du joueur (groupes de GROUP_SIZE joueurs)
export const MIGRATIONS = `
ALTER TABLE players ADD COLUMN IF NOT EXISTS group_no INTEGER NOT NULL DEFAULT 1;

-- Statistiques de fréquentation (uniquement avec le consentement du visiteur, aucune adresse IP stockée)
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY, visitor_id TEXT NOT NULL, session_id TEXT NOT NULL,
  type TEXT NOT NULL, path TEXT NOT NULL, label TEXT, referrer TEXT, device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events (created_at);
`;
