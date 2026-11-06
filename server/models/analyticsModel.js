import { q, one, run } from '../config/database.js';

export const insert = ({ visitorId, sessionId, type, path, label, referrer, device }) =>
  run('INSERT INTO analytics_events(visitor_id,session_id,type,path,label,referrer,device) VALUES($1,$2,$3,$4,$5,$6,$7)',
    [visitorId, sessionId, type, path, label, referrer, device]);

// Synthèse des `days` derniers jours
export async function summary(days) {
  const since = [`${days} days`];
  const totals = await one(`SELECT COUNT(*) FILTER (WHERE type='pageview')::int pageviews,
      COUNT(DISTINCT visitor_id)::int visitors, COUNT(DISTINCT session_id)::int sessions,
      COUNT(*) FILTER (WHERE type='click')::int clicks
    FROM analytics_events WHERE created_at >= NOW() - $1::interval`, since);
  const perDay = await q(`SELECT to_char(d::date,'YYYY-MM-DD') AS day, COALESCE(e.pageviews,0)::int AS pageviews, COALESCE(e.visitors,0)::int AS visitors
    FROM generate_series(NOW() - $1::interval, NOW(), '1 day') d
    LEFT JOIN (SELECT created_at::date AS day, COUNT(*) FILTER (WHERE type='pageview') AS pageviews, COUNT(DISTINCT visitor_id) AS visitors
               FROM analytics_events WHERE created_at >= NOW() - $1::interval GROUP BY 1) e ON e.day = d::date
    ORDER BY d`, since);
  const pages = await q(`SELECT path label, COUNT(*)::int n FROM analytics_events WHERE type='pageview' AND created_at >= NOW() - $1::interval GROUP BY 1 ORDER BY n DESC LIMIT 10`, since);
  const devices = await q(`SELECT COALESCE(device,'inconnu') label, COUNT(DISTINCT visitor_id)::int n FROM analytics_events WHERE created_at >= NOW() - $1::interval GROUP BY 1 ORDER BY n DESC`, since);
  const referrers = await q(`SELECT referrer label, COUNT(DISTINCT session_id)::int n FROM analytics_events WHERE type='pageview' AND COALESCE(referrer,'')<>'' AND created_at >= NOW() - $1::interval GROUP BY 1 ORDER BY n DESC LIMIT 10`, since);
  const clicks = await q(`SELECT label, COUNT(*)::int n FROM analytics_events WHERE type='click' AND created_at >= NOW() - $1::interval GROUP BY 1 ORDER BY n DESC LIMIT 15`, since);
  return { totals, perDay, pages, devices, referrers, clicks };
}
