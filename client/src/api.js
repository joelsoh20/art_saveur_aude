// URL du backend (Render) quand le front est hébergé ailleurs (Netlify).
// Vide = même origine (dev avec proxy Vite, ou front servi par Express).
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const apiUrl = path => BASE + path;
export const assetUrl = path => (path && path.startsWith('/') ? BASE + path : path);

export async function api(url, { method = 'GET', body, token, form } = {}) {
  const headers = {};
  if (token) headers['x-admin-token'] = token;
  if (body) headers['Content-Type'] = 'application/json';
  const r = await fetch(apiUrl(url), { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'Erreur'), { status: r.status });
  return j;
}
