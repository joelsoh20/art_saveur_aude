import pg from 'pg';
import { DATABASE_URL, PGSSL } from './env.js';

export const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: PGSSL ? { rejectUnauthorized: false } : undefined });

// q = toutes les lignes · one = première ligne · run = résultat brut. `c` = client de transaction optionnel.
export const q = async (sql, params = [], c = pool) => (await c.query(sql, params)).rows;
export const one = async (sql, params = [], c = pool) => (await c.query(sql, params)).rows[0];
export const run = (sql, params = [], c = pool) => c.query(sql, params);

export const tx = async fn => {
  const c = await pool.connect();
  try { await c.query('BEGIN'); const r = await fn(c); await c.query('COMMIT'); return r; }
  catch (e) { await c.query('ROLLBACK'); throw e; }
  finally { c.release(); }
};
