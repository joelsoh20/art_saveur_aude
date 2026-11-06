// Consentement aux cookies / traceurs (RGPD) : mémorisé dans le navigateur du visiteur
const KEY = 'aes_consent';

export const getConsent = () => {
  try { const c = JSON.parse(localStorage.getItem(KEY)); return c && typeof c.analytics === 'boolean' ? c : null; } catch { return null; }
};

export function setConsent(analytics) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ analytics, at: Date.now() }));
    if (!analytics) localStorage.removeItem('aes_vid'); // refus / retrait : on supprime l'identifiant visiteur
  } catch { /* stockage indisponible */ }
  window.dispatchEvent(new Event('aes-consent'));
}

// Permet de rouvrir la fenêtre de choix depuis le footer
export const openCookieSettings = () => window.dispatchEvent(new Event('aes-cookie-settings'));
