import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getConsent, setConsent } from '../lib/consent.js';

// Bandeau de consentement : accepter, refuser ou choisir. Rien n'est mesuré avant un « oui ».
export default function CookieBanner() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => !getConsent());
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(() => getConsent()?.analytics ?? false);

  useEffect(() => {
    const reopen = () => { setAnalytics(getConsent()?.analytics ?? false); setCustom(true); setOpen(true); };
    window.addEventListener('aes-cookie-settings', reopen);
    return () => window.removeEventListener('aes-cookie-settings', reopen);
  }, []);

  if (!open || pathname.startsWith('/admin')) return null;
  const choose = value => { setConsent(value); setOpen(false); setCustom(false); };

  return (
    <div role="dialog" aria-label="Gestion des cookies" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl animate-fade-up rounded-3xl border border-white/60 bg-white/80 p-5 text-cocoa-800 shadow-2xl shadow-cocoa-800/20 backdrop-blur-xl sm:bottom-5 sm:p-6">
      <p className="font-serif text-lg font-bold text-berry-500">🍪 Votre vie privée</p>
      <p className="mt-1 text-sm leading-relaxed">
        Ce site peut mesurer sa fréquentation (pages vues, clics) pour s'améliorer. Ces statistiques sont anonymes, stockées chez nous et jamais revendues.
        Vous pouvez accepter ou refuser, et changer d'avis à tout moment. <Link to="/confidentialite" className="font-semibold underline">En savoir plus</Link>
      </p>

      {custom && (
        <div className="mt-3 space-y-2 rounded-2xl bg-blush-50 p-3 text-sm">
          <label className="!m-0 flex items-start gap-3 !font-normal"><input type="checkbox" checked disabled className="!mt-1 !w-4 accent-berry-500" />
            <span><b>Indispensables</b> — mémoriser votre partie de quiz et votre choix. Toujours actifs.</span></label>
          <label className="!m-0 flex cursor-pointer items-start gap-3 !font-normal"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="!mt-1 !w-4 accent-berry-500" />
            <span><b>Statistiques de fréquentation</b> — nous aider à comprendre comment le site est utilisé.</span></label>
        </div>)}

      <div className="mt-4 flex flex-wrap gap-2">
        {custom
          ? <button className="btn btn-sm" onClick={() => choose(analytics)}>Enregistrer mes choix</button>
          : <>
            <button className="btn btn-sm" onClick={() => choose(true)}>Tout accepter</button>
            <button className="btn btn-sm btn-ghost" onClick={() => choose(false)}>Refuser</button>
            <button className="px-2 text-sm font-semibold underline" onClick={() => setCustom(true)}>Personnaliser</button>
          </>}
      </div>
    </div>
  );
}
