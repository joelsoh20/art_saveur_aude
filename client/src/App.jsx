import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home.jsx';
import Quiz from './pages/Quiz.jsx';
import Admin from './pages/Admin.jsx';
import { Mentions, Privacy } from './pages/Legal.jsx';
import CookieBanner from './components/CookieBanner.jsx';
import { track } from './lib/analytics.js';

export default function App() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); else setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 50); }, [pathname, hash]);

  // Statistiques : une page vue à chaque changement de page (envoyée seulement si le visiteur a accepté)
  useEffect(() => { track('pageview'); }, [pathname]);
  // Si le visiteur accepte après coup, on compte la page qu'il est en train de regarder
  useEffect(() => {
    const onConsent = () => track('pageview');
    window.addEventListener('aes-consent', onConsent);
    return () => window.removeEventListener('aes-consent', onConsent);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/mentions-legales" element={<Mentions />} />
        <Route path="/confidentialite" element={<Privacy />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <CookieBanner />
    </>
  );
}
