export async function api(url, { method = 'GET', body, token, form } = {}) {
  const headers = {};
  if (token) headers['x-admin-token'] = token;
  if (body) headers['Content-Type'] = 'application/json';
  const r = await fetch(url, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'Erreur'), { status: r.status });
  return j;
}
