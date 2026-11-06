import { useEffect, useState } from 'react';
import { api } from '../api.js';

// Liste avec barres proportionnelles
function Bars({ rows, empty = "Aucune donnée pour l'instant." }) {
  const max = Math.max(1, ...rows.map(r => r.n));
  return (
    <ul className="space-y-2 text-sm">
      {rows.map(r => (
        <li key={r.label}>
          <div className="flex justify-between gap-3"><span className="truncate">{r.label}</span><b>{r.n}</b></div>
          <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-blush-100">
            <div className="h-full rounded-full bg-gradient-to-r from-blush-400 to-berry-400" style={{ width: `${(r.n / max) * 100}%` }} />
          </div>
        </li>))}
      {!rows.length && <li className="text-cocoa-700/60">{empty}</li>}
    </ul>
  );
}

// Onglet « Statistiques » de l'admin : fréquentation anonyme des visiteurs ayant accepté les cookies
export default function StatsTab({ token }) {
  const [days, setDays] = useState(30), [d, setD] = useState(null), [err, setErr] = useState('');
  useEffect(() => { setD(null); setErr(''); api('/api/admin/analytics?days=' + days, { token }).then(setD).catch(e => setErr(e.message)); }, [token, days]);
  if (err) return <p className="font-semibold text-berry-600">{err}</p>;
  if (!d) return <p>Chargement…</p>;

  const max = Math.max(1, ...d.perDay.map(x => x.pageviews));
  const kpi = [['👀 Visiteurs', d.totals.visitors], ['📄 Pages vues', d.totals.pageviews], ['🕒 Visites', d.totals.sessions], ['👆 Clics suivis', d.totals.clicks]];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-cocoa-700/70">Mesures anonymes, uniquement pour les visiteurs qui ont accepté les statistiques : les chiffres reflètent donc un minimum.</p>
        <div className="flex gap-2">
          {[7, 30, 90].map(n => (
            <button key={n} onClick={() => setDays(n)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${days === n ? 'bg-berry-500 text-white' : 'bg-white hover:bg-blush-100'}`}>{n} jours</button>))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpi.map(([l, v]) => (
          <div key={l} className="card text-center !p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-cocoa-700/60">{l}</p>
            <p className="font-serif text-4xl font-bold text-berry-500">{v}</p>
          </div>))}
      </div>

      <div className="card">
        <h3 className="font-serif text-xl font-bold">Pages vues par jour</h3>
        <div className="mt-4 flex h-40 items-end gap-0.5 sm:gap-1">
          {d.perDay.map(x => (
            <div key={x.day} title={`${x.day} : ${x.pageviews} pages vues, ${x.visitors} visiteur(s)`}
              className="flex-1 rounded-t bg-gradient-to-t from-blush-400 to-berry-400"
              style={{ height: `${Math.max((x.pageviews / max) * 100, x.pageviews ? 4 : 1)}%`, opacity: x.pageviews ? 1 : 0.25 }} />))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-cocoa-700/60"><span>{d.perDay[0]?.day}</span><span>{d.perDay.at(-1)?.day}</span></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card"><h3 className="mb-3 font-serif text-xl font-bold">Pages les plus vues</h3><Bars rows={d.pages} /></div>
        <div className="card"><h3 className="mb-3 font-serif text-xl font-bold">Clics sur les boutons</h3><Bars rows={d.clicks} /></div>
        <div className="card"><h3 className="mb-3 font-serif text-xl font-bold">Appareils</h3><Bars rows={d.devices} /></div>
        <div className="card"><h3 className="mb-3 font-serif text-xl font-bold">D'où viennent les visiteurs</h3><Bars rows={d.referrers} empty="Accès direct (aucun site d'origine)." /></div>
      </div>
    </div>
  );
}
