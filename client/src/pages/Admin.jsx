import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import StatsTab from './StatsTab.jsx';

const TOKEN = 'aes_admin';
const STATUS = { waiting: ['En attente', 'bg-amber-500'], running: ['Quiz en cours', 'bg-green-600'], finished: ['Terminé', 'bg-cocoa-800'] };
// Rang d'un joueur dans son groupe (la liste est triée par groupe puis score)
const rankIn = (list, i) => list.slice(0, i).filter(x => x.group_no === list[i].group_no).length + 1;
const Tag =({ s }) => <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${STATUS[s][1]}`}>{STATUS[s][0]}</span>;

function Login({ onToken }) {
  const [pw, setPw] = useState(''), [err, setErr] = useState('');
  const go = async e => { e.preventDefault(); try { const r = await api('/api/admin/login', { method: 'POST', body: { password: pw } }); sessionStorage.setItem(TOKEN, r.token); onToken(r.token); } catch (x) { setErr(x.message); } };
  return (
    <form onSubmit={go} className="card mx-auto mt-20 max-w-sm animate-pop">
      <h1 className="font-script text-5xl text-berry-500">Administration</h1>
      <label htmlFor="pw">Mot de passe</label><input id="pw" type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} placeholder="4 chiffres" value={pw} onChange={e => setPw(e.target.value.replace(/\D/g, ''))} autoFocus />
      <p className="mt-2 min-h-[1.5rem] text-sm font-semibold text-berry-600">{err}</p>
      <button className="btn w-full">Se connecter</button>
    </form>
  );
}

function QR({ token, version }) {
  const [svg, setSvg] = useState('');
  useEffect(() => { fetch('/api/admin/qr', { headers: { 'x-admin-token': token } }).then(r => r.text()).then(setSvg); }, [token, version]);
  const download = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })); a.download = 'qr-art-et-saveur.svg'; a.click(); };
  return (<><div className="mx-auto h-52 w-52 rounded-2xl border-4 border-blush-200 bg-white p-1" dangerouslySetInnerHTML={{ __html: svg }} /><button className="btn btn-sm btn-ghost mt-3" onClick={download}>Télécharger le QR</button></>);
}

// Brouillons : ce qui est saisi reste dans le navigateur jusqu'à l'enregistrement
const QUIZ_DRAFT = 'aes_quiz_draft', CAKE_DRAFT = 'aes_cake_draft';
const readDraft = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const writeDraft = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } };
const clearDraft = k => { try { localStorage.removeItem(k); } catch { /* stockage indisponible */ } };

function QuizTab({ token }) {
  const draft0 = useRef(readDraft(QUIZ_DRAFT));
  const [st, setSt] = useState(null), [qs, setQs] = useState(draft0.current?.qs ?? null), [title, setTitle] = useState(draft0.current?.title ?? ''), [msg, setMsg] = useState(''), [url, setUrl] = useState(''), [wa, setWa] = useState(''), [qrV, setQrV] = useState(0);
  const dirty = useRef(!!draft0.current);
  const load = useCallback(async () => {
    const s = await api('/api/admin/state', { token }); setSt(s);
    // Quiz verrouillé (lancé / déjà répondu) : le brouillon n'a plus de sens
    if (s.quiz.status !== 'waiting' || s.players.some(p => p.answered > 0)) { dirty.current = false; clearDraft(QUIZ_DRAFT); }
    if (!dirty.current) { setQs(s.questions.map(q => ({ text: q.text, options: [...q.options], correct: q.correct }))); setTitle(s.quiz.title || ''); }
    setUrl(u => u || s.siteUrl); setWa(w => w || s.whatsapp || '');
  }, [token]);
  useEffect(() => { load(); const t = setInterval(load, 3000); return () => clearInterval(t); }, [load]);
  useEffect(() => { if (dirty.current && qs) writeDraft(QUIZ_DRAFT, { qs, title }); }, [qs, title]);
  if (!st || !qs) return <p>Chargement…</p>;
  const act = (path, confirmMsg) => async () => { if (confirmMsg && !confirm(confirmMsg)) return; try { await api('/api/admin/' + path, { method: 'POST', token }); dirty.current = false; clearDraft(QUIZ_DRAFT); load(); } catch (e) { alert(e.message); } };
  const locked = st.quiz.status !== 'waiting' || st.players.some(p => p.answered > 0);
  const setQ = (i, patch) => { dirty.current = true; setQs(qs.map((q, j) => j === i ? { ...q, ...patch } : q)); };
  const addQ = () => { dirty.current = true; setQs([...qs, { text: '', options: ['', '', '', ''], correct: 0 }]); };
  const delQ = i => { if (qs.length <= 1) return; dirty.current = true; setQs(qs.filter((_, j) => j !== i)); };
  const save = async () => { try { await api('/api/admin/questions', { method: 'PUT', token, body: { title, questions: qs } }); dirty.current = false; clearDraft(QUIZ_DRAFT); setMsg('✅ Quiz enregistré.'); load(); } catch (e) { setMsg('⚠️ ' + e.message); } };
  const saveSettings = async () => { await api('/api/admin/settings', { method: 'POST', token, body: { siteUrl: url, whatsapp: wa } }); setQrV(v => v + 1); setMsg('✅ Paramètres enregistrés.'); };

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="font-serif text-2xl font-bold">{st.quiz.title}</h2><div className="mt-1"><Tag s={st.quiz.status} /></div></div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-sm" disabled={st.quiz.status !== 'waiting'} onClick={act('launch', 'Lancer le quiz pour tous les joueurs inscrits ?')}>🚀 Lancer le quiz</button>
          <button className="btn btn-sm btn-dark" disabled={st.quiz.status !== 'running'} onClick={act('stop', 'Terminer le quiz ?')}>⏹ Terminer</button>
          <button className="btn btn-sm btn-ghost" onClick={act('new', 'Archiver ce quiz et créer une nouvelle partie ? Les questions seront reprises.')}>♻ Nouvelle partie</button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card text-center">
          <h3 className="mb-3 font-serif text-xl font-bold">QR code du site</h3>
          <QR token={token} version={qrV} />
          {(() => {
            const link = `${(url || st.siteUrl).replace(/\/+$/, '')}/quiz`, local = /localhost|127\.0\.0\.1|^https?:\/\/192\.168\./.test(link);
            return (<>
              <p className="mt-2 break-all text-xs text-cocoa-700/70">Le QR code ouvre directement l'inscription au quiz :<br /><a href={link} target="_blank" rel="noreferrer" className="font-bold underline">{link}</a></p>
              {local && <p className="mt-2 rounded-xl bg-amber-100 p-3 text-left text-xs text-amber-900">⚠️ Cette adresse ne fonctionne que sur votre réseau/ordinateur : un téléphone qui scanne le QR n'y accèdera pas. Saisissez ci-dessous l'adresse publique du site (ex. https://artetsaveur.fr), puis cliquez sur « Enregistrer » : le QR code sera mis à jour.</p>}
            </>);
          })()}
          <label htmlFor="u" className="text-left">Adresse publique du site</label><input id="u" value={url} onChange={e => setUrl(e.target.value)} />
          <label htmlFor="w" className="text-left">N° WhatsApp pour les commandes (indicatif inclus, ex. 33612345678)</label><input id="w" value={wa} onChange={e => setWa(e.target.value)} />
          <button className="btn btn-sm mt-4" onClick={saveSettings}>Enregistrer</button>
        </div>
        <div className="card">
          <h3 className="font-serif text-xl font-bold">Joueurs inscrits ({st.players.length})</h3>
          <p className="mb-3 text-xs text-cocoa-700/70">Groupes de 10 joueurs : le 11ᵉ joueur ouvre le groupe suivant ({new Set(st.players.map(p => p.group_no)).size} groupe(s)).</p>
          <div className="max-h-96 overflow-auto"><table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase text-cocoa-700/60"><th className="p-1">Gr.</th><th>#</th><th>Nom</th><th>Téléphone</th><th>Progr.</th><th>Pts</th></tr></thead>
            <tbody>{st.players.map((p, i) => <tr key={i} className={`border-t border-blush-100 ${i > 0 && st.players[i - 1].group_no !== p.group_no ? '!border-t-2 !border-berry-400' : ''}`}><td className="p-1.5 font-bold text-berry-500">{p.group_no}</td><td>{rankIn(st.players, i)}</td><td>{p.name}</td><td>{p.phone}</td><td>{p.answered}/{p.total}</td><td className="font-bold">{p.score}</td></tr>)}
              {!st.players.length && <tr><td colSpan="6" className="p-3 text-cocoa-700/60">Aucun joueur pour l'instant.</td></tr>}</tbody></table></div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-serif text-xl font-bold">Écrire le quiz ({qs.length} question{qs.length > 1 ? 's' : ''})</h3>
        {locked && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-100 p-4 text-sm text-amber-900">
            <span>🔒 Ce quiz est {st.quiz.status === 'running' ? 'en cours' : st.quiz.status === 'finished' ? 'terminé' : 'déjà commencé par des joueurs'} : on ne peut plus le modifier. Créez une nouvelle partie : elle reprend ces questions et vous pourrez les modifier ou les supprimer.</span>
            <button type="button" className="btn btn-sm shrink-0" onClick={act('new', 'Archiver ce quiz et créer une nouvelle partie modifiable ? Les questions seront reprises.')}>♻ Nouvelle partie modifiable</button>
          </div>)}
        <label htmlFor="qt" className="!mt-3">Titre du quiz</label>
        <input id="qt" value={title} disabled={locked} maxLength={80} onChange={e => { dirty.current = true; setTitle(e.target.value); }} placeholder="Ex : Quiz de la gourmandise" />
        <p className="mt-3 text-sm text-cocoa-700/70">Choisissez la bonne réponse avec le bouton rond. Bonne réponse = 1 point, sinon 0.{locked && ' (Verrouillé : quiz lancé ou joueurs ayant déjà répondu.)'}</p>
        {qs.map((q, i) => (
          <fieldset key={i} disabled={locked} className="mt-4 rounded-2xl border-2 border-blush-100 p-4">
            <div className="flex items-center justify-between"><b className="text-berry-500">Question {i + 1}</b>
              {qs.length > 1 && <button type="button" className="text-sm text-berry-600 underline" onClick={() => delQ(i)}>Supprimer</button>}</div>
            <input className="mt-2" value={q.text} onChange={e => setQ(i, { text: e.target.value })} placeholder="Intitulé de la question" />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, j) => (
                <div key={j} className="flex items-center gap-2">
                  <input type="radio" name={`c${i}`} checked={q.correct === j} onChange={() => setQ(i, { correct: j })} className="!w-5 accent-berry-500" aria-label={`Bonne réponse ${j + 1}`} />
                  <input value={o} onChange={e => setQ(i, { options: q.options.map((x, k) => k === j ? e.target.value : x) })} placeholder={`Réponse ${j + 1}`} />
                </div>))}
            </div>
          </fieldset>))}
        <button type="button" className="btn btn-sm btn-ghost mt-4" disabled={locked || qs.length >= 30} onClick={addQ}>+ Ajouter une question</button>
        <div className="mt-5 flex items-center gap-4"><button className="btn" disabled={locked} onClick={save}>💾 Enregistrer le quiz</button><span className="text-sm font-semibold">{msg}</span></div>
      </div>
    </div>
  );
}

function CakeForm({ cake, token, onDone, onCancel }) {
  const [f, setF] = useState(() => (!cake && readDraft(CAKE_DRAFT)) || { name: cake?.name || '', description: cake?.description || '', price: cake?.price || '', emoji: cake?.emoji || '🍰' });
  useEffect(() => { if (!cake) writeDraft(CAKE_DRAFT, f); }, [cake, f]);
  const [file, setFile] = useState(null), [rm, setRm] = useState(false), [err, setErr] = useState('');
  const preview = file ? URL.createObjectURL(file) : (!rm && cake?.image_url);
  const submit = async e => {
    e.preventDefault(); const fd = new FormData(); Object.entries(f).forEach(([k, v]) => fd.append(k, v)); if (file) fd.append('image', file); if (rm) fd.append('removeImage', '1');
    try { await api(cake ? `/api/admin/cakes/${cake.id}` : '/api/admin/cakes', { method: cake ? 'PUT' : 'POST', token, form: fd }); clearDraft(CAKE_DRAFT); onDone(); } catch (x) { setErr(x.message); }
  };
  return (
    <form onSubmit={submit} className="card animate-fade-up">
      <div className="grid gap-x-4 sm:grid-cols-2">
        <div><label>Nom</label><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required /></div>
        <div><label>Prix (texte libre)</label><input value={f.price} onChange={e => setF({ ...f, price: e.target.value })} placeholder="Ex : 15 € ou sur devis" /></div>
        <div className="sm:col-span-2"><label>Description</label><input value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></div>
        <div><label>Emoji (si pas de photo)</label><input value={f.emoji} onChange={e => setF({ ...f, emoji: e.target.value })} maxLength={4} /></div>
        <div><label>Photo (JPG, PNG, WebP · 5 Mo max)</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { setFile(e.target.files[0]); setRm(false); }} /></div>
      </div>
      {preview && <div className="mt-3 flex items-center gap-3"><img src={preview} alt="" className="h-20 w-20 rounded-xl object-cover" />{!file && <button type="button" className="text-sm text-berry-600 underline" onClick={() => setRm(true)}>Retirer la photo</button>}</div>}
      <p className="mt-2 text-sm font-semibold text-berry-600">{err}</p>
      <div className="mt-3 flex gap-3"><button className="btn btn-sm">Enregistrer</button><button type="button" className="btn btn-sm btn-ghost" onClick={() => { clearDraft(CAKE_DRAFT); onCancel(); }}>Annuler</button></div>
    </form>
  );
}

function CakesTab({ token }) {
  const [cakes, setCakes] = useState([]), [edit, setEdit] = useState(null);
  const load = useCallback(() => api('/api/admin/cakes', { token }).then(setCakes), [token]);
  useEffect(() => { load(); }, [load]);
  const del = async c => { if (confirm(`Supprimer « ${c.name} » ?`)) { await api('/api/admin/cakes/' + c.id, { method: 'DELETE', token }); load(); } };
  return (
    <div className="space-y-5">
      <button className="btn btn-sm" onClick={() => setEdit({})}>+ Ajouter un gâteau</button>
      {edit && <CakeForm key={edit.id || 'new'} cake={edit.id ? edit : null} token={token} onCancel={() => setEdit(null)} onDone={() => { setEdit(null); load(); }} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cakes.map(c => (
          <div key={c.id} className="card flex gap-3 !p-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blush-100 text-4xl">{c.image_url ? <img src={c.image_url} alt="" className="h-full w-full object-cover" /> : c.emoji}</div>
            <div className="min-w-0 flex-1"><b className="block truncate">{c.name}</b><span className="text-sm text-berry-500">{c.price}</span>
              <div className="mt-2 flex gap-3 text-sm"><button className="underline" onClick={() => setEdit(c)}>Modifier</button><button className="text-berry-600 underline" onClick={() => del(c)}>Supprimer</button></div></div>
          </div>))}
      </div>
    </div>
  );
}

function HistoryTab({ token }) {
  const [list, setList] = useState([]), [open, setOpen] = useState(null), [detail, setDetail] = useState(null);
  useEffect(() => { api('/api/admin/history', { token }).then(setList); }, [token]);
  const show = async id => { if (open === id) return setOpen(null); setOpen(id); setDetail(await api('/api/admin/history/' + id, { token })); };
  const fmt = d => d ? new Date(d).toLocaleString('fr-FR') : '—';
  return (
    <div className="space-y-3">
      {list.map(z => (
        <div key={z.id} className="card !p-4">
          <button className="flex w-full flex-wrap items-center justify-between gap-2 text-left" onClick={() => show(z.id)}>
            <span><b>{z.title}</b> <span className="text-sm text-cocoa-700/60">· {fmt(z.created_at)}</span></span>
            <span className="flex items-center gap-3 text-sm"><Tag s={z.status} />{z.players} joueur(s)</span>
          </button>
          {open === z.id && detail && (
            <table className="mt-3 w-full text-sm"><thead><tr className="text-left text-xs uppercase text-cocoa-700/60"><th>Gr.</th><th>#</th><th>Nom</th><th>Téléphone</th><th>Score</th></tr></thead>
              <tbody>{detail.players.map((p, i) => <tr key={i} className="border-t border-blush-100"><td className="py-1.5 font-bold text-berry-500">{p.group_no}</td><td>{rankIn(detail.players, i)}</td><td>{p.name}</td><td>{p.phone}</td><td className="font-bold">{p.score}/{p.total}</td></tr>)}
                {!detail.players.length && <tr><td colSpan="5" className="py-2 text-cocoa-700/60">Aucun joueur.</td></tr>}</tbody></table>)}
        </div>))}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN)), [tab, setTab] = useState('quiz');
  useEffect(() => { if (token) api('/api/admin/state', { token }).catch(e => { if (e.status === 401) { sessionStorage.removeItem(TOKEN); setToken(null); } }); }, [token]);
  const tabs = [['quiz', '🎯 Quiz'], ['cakes', '🍰 Gâteaux'], ['history', '📜 Historique'], ['stats', '📊 Statistiques']];
  return (
    <div className="min-h-screen bg-blush-50">
      <header className="flex items-center justify-between bg-gradient-to-r from-blush-400 to-blush-300 px-5 py-4">
        <span className="font-script text-4xl text-white">Art et saveur <small className="text-2xl">· Admin</small></span>
        <div className="flex gap-2"><Link to="/" className="btn btn-sm btn-ghost !text-white !ring-white/60">Voir le site</Link>
          {token && <button className="btn btn-sm btn-dark" onClick={() => { sessionStorage.removeItem(TOKEN); setToken(null); }}>Déconnexion</button>}</div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">
        {!token ? <Login onToken={setToken} /> : (<>
          <nav className="mb-6 flex flex-wrap gap-2">{tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === k ? 'bg-berry-500 text-white shadow-lg' : 'bg-white text-cocoa-800 hover:bg-blush-100'}`}>{l}</button>)}</nav>
          {tab === 'quiz' && <QuizTab token={token} />}{tab === 'cakes' && <CakesTab token={token} />}{tab === 'history' && <HistoryTab token={token} />}{tab === 'stats' && <StatsTab token={token} />}
        </>)}
      </div>
    </div>
  );
}
