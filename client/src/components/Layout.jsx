import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { openCookieSettings } from '../lib/consent.js';
import { track } from '../lib/analytics.js';

export const TIKTOK_URL = 'https://www.tiktok.com/@art.et.saveurs.by.aude?_r=1&_t=ZS-9B9PEQMihF7';

// Bouton « Suivre sur TikTok » (réutilisé dans le footer et la section contact)
export function TikTokLink({ className = '' }) {
  return (
    <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('click', 'tiktok')} aria-label="Suivre Art et saveur by Aude sur TikTok"
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition hover:-translate-y-0.5 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M19.6 6.7a5 5 0 0 1-3.9-4.4V2h-3.5v13.4a2.9 2.9 0 1 1-2-2.8V9.1a6.4 6.4 0 1 0 5.5 6.3V8.8a8.5 8.5 0 0 0 4.9 1.6V6.9a5 5 0 0 1-1 -.2z" /></svg>
      TikTok
    </a>
  );
}

export function Navbar({ light }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const links = [['Accueil', '/'], ['Nos gâteaux', '/#gateaux'], ['Quiz', '/quiz'], ['À propos', '/#apropos'], ['Contact', '/#contact']];
  return (
    <header className="absolute inset-x-0 top-0 z-30 animate-fade-in">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pt-6">
        <Link to="/" className="font-script text-5xl text-white drop-shadow-md sm:text-6xl">Art et saveur <span className="text-blush-100">by Aude</span></Link>
        <button className="mt-3 text-sm uppercase tracking-widest text-white sm:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu">{open ? '✕ Fermer' : '☰ Menu'}</button>
        <nav className={`${open ? 'flex' : 'hidden'} mt-3 flex-col items-center gap-3 rounded-2xl bg-cocoa-800/40 px-6 py-4 backdrop-blur sm:mt-5 sm:flex sm:flex-row sm:gap-9 sm:bg-transparent sm:p-0 sm:backdrop-blur-none`}>
          {links.map(([t, to]) => (
            <Link key={t} to={to} onClick={() => setOpen(false)}
              className={`border-b-2 pb-1 text-xs font-semibold uppercase tracking-[.2em] text-white transition hover:border-white ${pathname === to ? 'border-white' : 'border-transparent'}`}>{t}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-cocoa-800 px-5 pb-10 pt-6 text-center text-blush-100">
      {/* Transition ondulée : deux vagues (une claire, une pleine) qui montent au-dessus du footer */}
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full -mb-px block h-16 w-full fill-current text-cocoa-800 sm:h-24">
        <path className="opacity-40" d="M0,70 C240,8 470,118 720,76 C970,34 1200,16 1440,64 L1440,140 L0,140 Z" />
        <path d="M0,96 C220,44 520,124 770,92 C1010,62 1240,44 1440,92 L1440,140 L0,140 Z" />
      </svg>
      <p className="font-script text-4xl">Art et saveur <span className="text-blush-300">by Aude</span></p>
      <TikTokLink className="mt-4 bg-white/10 text-blush-100 ring-1 ring-white/30 hover:bg-white/20" />
      <p className="mt-4 text-xs uppercase tracking-widest opacity-70">© {new Date().getFullYear()} · Tous droits réservés</p>
      <nav aria-label="Informations légales" className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
        <Link to="/mentions-legales" className="opacity-80 transition hover:opacity-100 hover:underline">Mentions légales</Link>
        <Link to="/confidentialite" className="opacity-80 transition hover:opacity-100 hover:underline">Politique de confidentialité</Link>
        <button type="button" onClick={openCookieSettings} className="opacity-80 transition hover:opacity-100 hover:underline">Gérer les cookies</button>
      </nav>
      <Link to="/admin" className="mt-4 inline-block text-xs opacity-40 transition hover:opacity-100">Espace administrateur</Link>
    </footer>
  );
}
