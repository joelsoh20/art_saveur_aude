import { getConsent } from './consent.js';

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`);
const stored = (store, key) => { try { let v = store.getItem(key); if (!v) { v = uid(); store.setItem(key, v); } return v; } catch { return uid(); } };
const device = () => (window.innerWidth < 640 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop');
const referrer = () => { try { const h = new URL(document.referrer).hostname; return h && h !== location.hostname ? h : ''; } catch { return ''; } };

// Envoie un événement de fréquentation — uniquement si le visiteur a accepté les statistiques
export function track(type, label = '') {
  if (!getConsent()?.analytics || location.pathname.startsWith('/admin')) return;
  const body = {
    visitorId: stored(localStorage, 'aes_vid'), sessionId: stored(sessionStorage, 'aes_sid'),
    type, path: location.pathname, label, referrer: type === 'pageview' ? referrer() : '', device: device(),
  };
  fetch('/api/analytics/collect', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {});
}
