import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Navbar, Footer, TikTokLink } from '../components/Layout.jsx';
import Reveal from '../components/Reveal.jsx';
import { track } from '../lib/analytics.js';
import profil from '../assets/Profil.jpeg';

// 33663615524 -> +33 6 63 61 55 24 (numéros français), sinon +<numéro>
const prettyPhone = d => /^33\d{9}$/.test(d) ? `+33 ${d[2]} ${d.slice(3).match(/../g).join(' ')}` : `+${d}`;

// Carte compacte : largeur fixée par le slider (2 / 3 / 4 cartes visibles)
function CakeCard({ cake, whatsapp }) {
  const href = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Bonjour Aude, je souhaite commander : ${cake.name}`)}` : '#contact';
  return (
    <article className="group flex h-full shrink-0 snap-start basis-[calc((100%-1rem)/2)] flex-col rounded-xl border border-white/60 bg-white/70 p-2 shadow-md shadow-blush-300/30 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:shadow-xl sm:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-3rem)/4)]">
      <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-blush-100 to-blush-300">
        {cake.image_url
          ? <img src={cake.image_url} alt={cake.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
          : <div className="flex h-full items-center justify-center text-5xl transition duration-500 group-hover:scale-125 group-hover:rotate-6">{cake.emoji}</div>}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-0.5 pt-2">
        <h3 className="font-serif text-sm font-bold leading-tight text-cocoa-900 sm:text-base">{cake.name}</h3>
        <div className="my-1.5 h-px w-full bg-cocoa-800/15" />
        {cake.price && <p className="text-[11px] font-semibold text-berry-500 sm:text-xs">{cake.price}</p>}
        <a href={href} target={whatsapp ? '_blank' : undefined} rel="noreferrer" onClick={() => track('click', 'commander: ' + cake.name)} className="btn btn-sm mt-auto self-start !px-3 !py-1 !text-[9px]" style={{ marginTop: '0.5rem' }}>Commander</a>
      </div>
    </article>
  );
}

// Slider horizontal (défilement tactile + flèches) : 2 colonnes sur téléphone
function CakeSlider({ cakes, whatsapp }) {
  const ref = useRef(null), paused = useRef(false);
  const go = dir => ref.current?.scrollBy({ left: dir * ref.current.clientWidth, behavior: 'smooth' });

  // Défilement automatique : une carte toutes les 3 s, retour au début en fin de liste.
  // Pause pendant le survol / le toucher, et si l'utilisateur préfère moins d'animations.
  useEffect(() => {
    const el = ref.current;
    if (!el || cakes.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (paused.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: el.firstElementChild.offsetWidth + 16, behavior: 'smooth' });
    }, 3000);
    return () => clearInterval(id);
  }, [cakes.length]);
  const pause = v => () => { paused.current = v; };
  const arrow = 'absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-berry-500 shadow-lg transition hover:scale-110 hover:bg-white sm:flex';
  return (
    <div className="relative" onMouseEnter={pause(true)} onMouseLeave={pause(false)} onTouchStart={pause(true)} onTouchEnd={() => setTimeout(pause(false), 4000)}>
      <button type="button" aria-label="Précédent" onClick={() => go(-1)} className={`${arrow} -left-5`}>‹</button>
      <div ref={ref} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cakes.map(c => <CakeCard key={c.id} cake={c} whatsapp={whatsapp} />)}
      </div>
      <button type="button" aria-label="Suivant" onClick={() => go(1)} className={`${arrow} -right-5`}>›</button>
    </div>
  );
}

export default function Home() {
  const [cakes, setCakes] = useState([]);
  const [site, setSite] = useState({});
  useEffect(() => { api('/api/cakes').then(setCakes).catch(() => {}); api('/api/site').then(setSite).catch(() => {}); }, []);

  return (
    <>
      <Navbar />
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-12 pt-40 sm:pt-44">
        <div className="relative mx-auto max-w-3xl rounded-3xl bg-white/40 p-6 text-center shadow-xl shadow-blush-300/30 backdrop-blur-md sm:p-10">
          <h1 className="mt-6 animate-fade-up font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">Des gâteaux faits main, élégants et gourmands</h1>
          <p className="mx-auto mt-3 max-w-lg animate-fade-up text-cocoa-700 [animation-delay:.2s]">Pour chaque moment de votre vie : anniversaires, mariages, fêtes ou simple plaisir.</p>
          <div className="mt-8 flex animate-fade-up flex-wrap justify-center gap-4 [animation-delay:.4s]">
            <a href="#gateaux" className="btn animate-pulse-soft">Découvrir</a>
            <Link to="/quiz" className="btn btn-dark">🎂 Jouer au quiz</Link>
          </div>
        </div>
      </section>

      <section id="gateaux" className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><h2 className="text-center font-script text-6xl text-berry-500">Nos gâteaux</h2><p className="mx-auto mt-2 max-w-md text-center text-sm text-cocoa-700/80">Préparés avec passion, sur commande.</p></Reveal>
        <Reveal><div className="mt-10"><CakeSlider cakes={cakes} whatsapp={site.whatsapp} /></div></Reveal>
      </section>

      <section className="px-5 py-10">
        <Reveal><div className="mx-auto max-w-3xl rounded-[4rem] border border-white/50 bg-berry-500/30 px-8 py-14 text-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md [text-shadow:0_1px_6px_rgba(0,0,0,0.35)] sm:rounded-[6rem] sm:px-16">
          <p className="font-script text-5xl">Le Quiz de la gourmandise</p>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-90">1 point par bonne réponse. Rejoignez la partie avec votre nom et votre numéro de téléphone !</p>
          <Link to="/quiz" className="btn mt-7 !bg-none !bg-white !text-berry-500">Rejoindre le jeu</Link>
        </div></Reveal>
      </section>

      <section id="apropos" className="px-5 py-16">
        <Reveal>
          <div className="mx-auto grid max-w-5xl items-center gap-8 rounded-[3rem] border border-white/60 bg-white/45 p-6 shadow-xl shadow-blush-300/30 backdrop-blur-xl sm:p-10 md:grid-cols-2">
            <img src={profil} alt="Un gâteau réalisé par Aude" loading="lazy" className="mx-auto aspect-[3/4] w-full max-w-[19rem] rounded-[2rem] object-cover object-center shadow-lg" />
            <div>
              <h2 className="font-script text-6xl text-berry-500">À propos</h2>
              <p className="mt-4 leading-relaxed text-cocoa-800">Chez <b>Art et saveur by Aude</b>, chaque gâteau est une petite œuvre d'art. Des ingrédients choisis, des recettes travaillées et une décoration soignée pour faire de vos moments des souvenirs sucrés.</p>
              {/* <p className="mt-3 text-xs italic text-cocoa-700/70">(Texte à personnaliser par Aude)</p> */}
            </div>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="bg-blush-100 px-5 pb-32 pt-20 text-center">
        <Reveal>
          <h2 className="font-script text-6xl text-berry-500">Contact</h2>
          <p className="mt-3 text-cocoa-700">Une envie, un événement ? Passez commande directement.</p>
          {site.whatsapp
            ? <><a className="btn mt-6" target="_blank" rel="noreferrer" onClick={() => track('click', 'whatsapp')} href={`https://wa.me/${site.whatsapp}`}>Écrire sur WhatsApp</a>
              <p className="mt-3 text-sm font-semibold text-cocoa-700">{prettyPhone(site.whatsapp)}</p></>
            : <p className="mt-4 text-sm text-cocoa-700/60">Les coordonnées seront ajoutées prochainement.</p>}
          <div className="mt-5"><TikTokLink className="bg-cocoa-800 text-white shadow-lg shadow-cocoa-800/20" /></div>
        </Reveal>
      </section>
      <Footer />
    </>
  );
}
