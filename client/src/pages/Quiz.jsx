import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { track } from '../lib/analytics.js';
import { Navbar, Footer } from '../components/Layout.jsx';

const KEY = 'aes_player';
const LETTERS = ['A', 'B', 'C', 'D'];

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blush-400 via-blush-300 to-blush-100 px-4 pb-20 pt-52 sm:pt-56">
        {['🍓', '🧁', '🍰', '🍪', '🥐'].map((e, i) => (
          <span key={i} aria-hidden className="pointer-events-none absolute animate-float text-4xl opacity-40" style={{ left: `${8 + i * 21}%`, top: `${22 + (i % 2) * 30}%`, animationDelay: `${i * 0.9}s` }}>{e}</span>
        ))}
        <div className="relative mx-auto max-w-lg">{children}</div>
      </main>
      <Footer />
    </>
  );
}

function Join({ onJoined }) {
  const [name, setName] = useState(''), [phone, setPhone] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { const r = await api('/api/join', { method: 'POST', body: { name, phone } }); localStorage.setItem(KEY, r.token); track('click', 'quiz_inscription'); onJoined(r.token); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="card animate-fade-up !p-8">
      <p className="text-center text-5xl">🎂</p>
      <h1 className="mt-2 text-center font-script text-5xl text-berry-500">Rejoindre le jeu</h1>
      <label htmlFor="n">Votre nom</label>
      <input id="n" value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="Ex : Marie Dupont" required />
      <label htmlFor="p">Numéro de téléphone</label>
      <input id="p" type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" placeholder="Ex : 0612345678" required />
      <p className="mt-3 min-h-[1.5rem] text-sm font-semibold text-berry-600" role="alert">{err}</p>
      <button className="btn mt-1 w-full" disabled={busy}>{busy ? 'Un instant…' : 'Rejoindre'}</button>
      <p className="mt-3 text-center text-xs text-cocoa-700/70">Votre nom et votre téléphone servent uniquement au jeu. <Link to="/confidentialite" className="underline">Politique de confidentialité</Link></p>
    </form>
  );
}

function Waiting({ s }) {
  return (
    <div className="card animate-pop text-center !p-10">
      <div className="mx-auto flex h-20 w-20 animate-pulse-soft items-center justify-center rounded-full bg-blush-100 text-4xl">⏳</div>
      <h2 className="mt-5 font-serif text-2xl font-bold">Bienvenue {s.name} !</h2>
      <p className="mt-2 text-sm text-cocoa-700/80">Vous êtes inscrit(e) dans le groupe {s.group}. Le quiz va être lancé par Aude, restez sur cette page : il démarrera tout seul.</p>
    </div>
  );
}

function Question({ s, token, refresh }) {
  const q = s.question;
  const [res, setRes] = useState(null), [picked, setPicked] = useState(null), [err, setErr] = useState('');
  const answer = async i => {
    if (res) return; setPicked(i);
    try { const r = await api('/api/answer', { method: 'POST', body: { token, question: q.index, choice: i } }); setRes(r);
      if (r.point) confetti({ particleCount: 40, spread: 60, origin: { y: .7 }, colors: ['#e0526a', '#f1c3c4', '#fff'] });
      setTimeout(refresh, 1800);
    } catch (e) { setErr(e.message); setPicked(null); setTimeout(refresh, 1200); }
  };
  return (
    <div key={q.index} className="card animate-slide !p-7">
      <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-blush-100"><div className="h-full rounded-full bg-gradient-to-r from-blush-400 to-berry-400 transition-all duration-700" style={{ width: `${(q.index + (res ? 1 : 0)) / s.total * 100}%` }} /></div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-cocoa-700/70">
        <span>Question {q.index + 1} / {s.total}</span><span className="rounded-full bg-blush-100 px-3 py-1 text-berry-500">Score : {res ? res.score : s.score}</span>
      </div>
      <h2 className="mt-4 font-serif text-xl font-bold leading-snug text-cocoa-900 sm:text-2xl">{q.text}</h2>
      <div className="mt-5 space-y-3">
        {q.options.map((o, i) => {
          let cls = 'border-blush-200 hover:border-blush-500 hover:bg-blush-50';
          if (res) cls = i === res.correct ? 'border-green-500 bg-green-50 animate-pop' : i === picked ? 'border-berry-500 bg-red-50 animate-shake' : 'border-blush-100 opacity-50';
          return (
            <button key={i} disabled={!!res || picked !== null} onClick={() => answer(i)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3.5 text-left transition duration-300 ${cls}`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-200 text-sm font-bold text-cocoa-800">{LETTERS[i]}</span>
              <span>{o}</span>
              {res && i === res.correct && <span className="ml-auto">✅</span>}{res && i === picked && !res.point && <span className="ml-auto">❌</span>}
            </button>
          );
        })}
      </div>
      <p className="mt-4 min-h-[1.5rem] text-center font-semibold" role="status">{err || (res ? (res.point ? '🎉 Bravo, +1 point !' : 'Raté… 0 point.') : '')}</p>
    </div>
  );
}

// Message de motivation personnalisé (prénom + niveau de réussite)
function motivation(name, score, total) {
  const first = String(name || '').trim().split(/\s+/)[0] || '';
  const who = first ? `, ${first}` : '';
  const r = total ? score / total : 0, missing = total - score;
  if (r === 1) return { emoji: '🏆', title: `Parfait${who} !`, text: 'Tu as tout réussi comme un chef !' };
  if (r >= 0.75) return { emoji: '🌟', title: `Bravo${who} !`, text: `Quel beau score ! Il ne vous manque que ${missing} point${missing > 1 ? 's' : ''} pour le sans-faute : à la prochaine partie, vous l'aurez.` };
  if (r >= 0.5) return { emoji: '🍰', title: `Bien joué${who} !`, text: 'Vous avez déjà le goût des bonnes choses. Encore un petit effort et vous serez imbattable !' };
  if (r > 0) return { emoji: '🧁', title: `Courage${who} !`, text: 'Chaque grand pâtissier a commencé par une première cuillerée. Vous progressez, continuez à goûter et à apprendre !' };
  return { emoji: '💪', title: `Ne lâchez rien${who} !`, text: "Zéro cette fois, mais même les plus grands pâtissiers ont raté leur premier gâteau. La prochaine fois sera la bonne : on croit en vous !" };
}

function Result({ s, token }) {
  const [lb, setLb] = useState([]);
  const [shown, setShown] = useState(0);
  const fired = useRef(false);
  useEffect(() => { const load = () => api('/api/leaderboard?token=' + token).then(setLb).catch(() => {}); load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, [token]);
  useEffect(() => {
    let n = 0; const t = setInterval(() => { n++; setShown(n); if (n >= s.score) clearInterval(t); }, 180); if (!s.score) setShown(0);
    if (s.score >= s.total / 2 && !fired.current) { fired.current = true; const end = Date.now() + 1800;
      (function f() { confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors: ['#e0526a', '#f1c3c4', '#fff'] }); confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#e0526a', '#f1c3c4', '#fff'] }); if (Date.now() < end) requestAnimationFrame(f); })(); }
    return () => clearInterval(t);
  }, [s.score, s.total]);
  const msg = motivation(s.name, s.score, s.total);
  return (
    <div className="space-y-6">
      <div className="card animate-pop text-center !p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-cocoa-700/70">Votre score</p>
        <p className="font-serif text-7xl font-bold text-berry-500">{shown}<span className="text-3xl text-cocoa-700/50"> / {s.total}</span></p>
        <div className="mt-4 rounded-2xl bg-blush-50 px-5 py-4">
          <p className="text-3xl">{msg.emoji}</p>
          <p className="mt-1 font-serif text-xl font-bold text-berry-500">{msg.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-cocoa-800">{msg.text}</p>
        </div>
      </div>
      <div className="card animate-fade-up">
        <h3 className="font-script text-4xl text-berry-500">🏅 Classement</h3>
        <p className="text-xs font-semibold uppercase tracking-widest text-cocoa-700/60">Groupe {s.group}</p>
        <ol className="mt-3 divide-y divide-blush-100">
          {lb.slice(0, 10).map((r, i) => (
            <li key={i} className="flex items-center gap-3 py-2.5"><span className="w-7 text-center">{['🥇', '🥈', '🥉'][i] || i + 1}</span><span className="flex-1">{r.name}</span><b>{r.score}</b></li>
          ))}
          {!lb.length && <li className="py-2 text-sm text-cocoa-700/60">Aucun résultat pour l'instant.</li>}
        </ol>
      </div>
    </div>
  );
}

export default function Quiz() {
  const [token, setToken] = useState(() => localStorage.getItem(KEY));
  const [s, setS] = useState(null);
  const timer = useRef();
  const refresh = useCallback(async () => {
    clearTimeout(timer.current);
    if (!token) return;
    try { const r = await api('/api/me/' + token); setS(r); timer.current = setTimeout(refresh, r.status === 'waiting' ? 2500 : r.done ? 8000 : 4000); }
    catch (e) { if (e.status === 404) { localStorage.removeItem(KEY); setToken(null); setS(null); } else timer.current = setTimeout(refresh, 3000); }
  }, [token]);
  useEffect(() => { refresh(); return () => clearTimeout(timer.current); }, [refresh]);

  let body;
  if (!token) body = <Join onJoined={setToken} />;
  else if (!s) body = <p className="text-center text-white">Chargement…</p>;
  else if (s.done || (s.status === 'finished' && !s.question)) body = <Result s={s} token={token} />;
  else if (s.status === 'waiting') body = <Waiting s={s} />;
  else if (s.question) body = <Question key={s.question.index} s={s} token={token} refresh={refresh} />;
  return <Shell>{body}</Shell>;
}
