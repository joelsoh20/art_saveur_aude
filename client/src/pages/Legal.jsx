import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout.jsx';
import { LEGAL } from '../lib/legalInfo.js';
import { openCookieSettings } from '../lib/consent.js';

// Valeur à compléter : surlignée tant que le texte contient « À compléter »
const V = ({ children }) => /À compléter/.test(children)
  ? <mark className="rounded bg-amber-200 px-1.5 py-0.5 text-amber-900">{children}</mark>
  : <b>{children}</b>;

function Page({ title, children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pb-20 pt-52 sm:pt-56">
        <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/60 bg-white/70 p-6 text-cocoa-800 shadow-xl shadow-blush-300/30 backdrop-blur-xl sm:p-10 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-berry-500 [&_li]:mt-1 [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:ml-5 [&_ul]:mt-2 [&_ul]:list-disc">
          <h1 className="font-script text-5xl text-berry-500 sm:text-6xl">{title}</h1>
          <p className="!mt-1 text-xs uppercase tracking-widest text-cocoa-700/60">Dernière mise à jour : {LEGAL.updated}</p>
          {children}
          <p className="!mt-10 text-sm"><Link to="/" className="font-semibold underline">← Retour à l'accueil</Link></p>
        </article>
      </main>
      <Footer />
    </>
  );
}

export function Mentions() {
  return (
    <Page title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>Le site <b>{LEGAL.brand}</b> est édité par :</p>
      <ul>
        <li>Exploitante : <V>{LEGAL.owner}</V></li>
        <li>Statut : <V>{LEGAL.status}</V></li>
        <li>Adresse : <V>{LEGAL.address}</V></li>
        <li>E-mail : <V>{LEGAL.email}</V></li>
        <li>Téléphone : <V>{LEGAL.phone}</V></li>
      </ul>
      <p>Directeur de la publication : <V>{LEGAL.director}</V></p>

      <h2>Hébergement</h2>
      <p>Le site est hébergé par : <V>{LEGAL.host}</V></p>

      <h2>Propriété intellectuelle</h2>
      <p>L'ensemble du contenu du site (textes, photographies, créations, logo, mise en page) est la propriété de {LEGAL.brand}, sauf mention contraire. Toute reproduction, représentation ou réutilisation, même partielle, sans autorisation écrite préalable est interdite.</p>

      <h2>Responsabilité</h2>
      <p>Les informations présentes sur le site (gâteaux, prix, disponibilités) sont données à titre indicatif et peuvent évoluer ; toute commande est confirmée directement avec la pâtissière. Le site peut contenir des liens vers des services tiers (WhatsApp, TikTok) dont {LEGAL.brand} ne maîtrise pas le contenu ni les pratiques.</p>

      <h2>Données personnelles et cookies</h2>
      <p>Le traitement de vos données est détaillé dans notre <Link to="/confidentialite" className="font-semibold underline">politique de confidentialité</Link>. Vous pouvez à tout moment <button className="font-semibold underline" onClick={openCookieSettings}>modifier vos choix en matière de cookies</button>.</p>

      <h2>Droit applicable</h2>
      <p>Les présentes mentions sont soumises au droit français. En cas de litige, les tribunaux français sont seuls compétents.</p>
    </Page>
  );
}

export function Privacy() {
  return (
    <Page title="Politique de confidentialité">
      <p>{LEGAL.brand} respecte votre vie privée et le Règlement général sur la protection des données (RGPD). Cette page explique quelles données sont collectées, pourquoi, et comment exercer vos droits.</p>

      <h2>Responsable du traitement</h2>
      <p><V>{LEGAL.owner}</V> — {LEGAL.brand}. Contact : <V>{LEGAL.email}</V> ou WhatsApp <V>{LEGAL.phone}</V>.</p>

      <h2>Données collectées</h2>
      <p><b>1. Participation au quiz.</b> Lorsque vous rejoignez le jeu, nous enregistrons votre <b>nom</b>, votre <b>numéro de téléphone</b>, vos réponses, votre score et votre groupe de jeu. Ces données servent uniquement à organiser le jeu, afficher le classement de votre groupe (votre nom et votre score, jamais votre téléphone) et, le cas échéant, vous contacter. Base légale : votre participation volontaire au jeu. Conservation : pendant la durée du jeu puis dans l'historique des parties pendant 12 mois au maximum ; suppression anticipée sur simple demande.</p>
      <p><b>2. Statistiques de fréquentation (uniquement si vous les acceptez).</b> Nous enregistrons les pages consultées, certains clics (boutons « Commander », WhatsApp, TikTok, inscription au quiz), le type d'appareil (mobile, tablette, ordinateur), le site d'origine éventuel et un identifiant aléatoire. <b>Aucune adresse IP, aucun nom ni numéro de téléphone n'est associé à ces statistiques.</b> Base légale : votre consentement. Conservation : 13 mois maximum.</p>
      <p><b>3. Commandes.</b> Les commandes passent par WhatsApp : les échanges relèvent alors de la politique de confidentialité de WhatsApp. Nous ne conservons pas ces échanges sur le site.</p>

      <h2>Ce qui est stocké dans votre navigateur</h2>
      <ul>
        <li><b>aes_consent</b> — votre choix concernant les cookies (indispensable).</li>
        <li><b>aes_player</b> — vous reconnaître et reprendre votre partie de quiz (indispensable).</li>
        <li><b>aes_vid</b> et <b>aes_sid</b> — identifiants aléatoires pour les statistiques (<i>uniquement si vous les avez acceptées</i> ; supprimés si vous refusez).</li>
      </ul>
      <p>Aucun cookie publicitaire n'est utilisé et aucune donnée n'est vendue ni cédée à des tiers à des fins commerciales.</p>

      <h2>Destinataires</h2>
      <p>Vos données ne sont accessibles qu'à l'exploitante du site et à l'hébergeur technique (<V>{LEGAL.host}</V>), qui agit pour notre compte. Les données sont hébergées sur des serveurs situés en Europe.</p>

      <h2>Vos droits</h2>
      <p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement à tout moment. Pour les exercer, contactez-nous (coordonnées ci-dessus) ; nous répondons dans un délai d'un mois. Vous pouvez également introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="font-semibold underline">CNIL</a>.</p>

      <h2>Gérer vos choix</h2>
      <p>Vous pouvez accepter, refuser ou modifier votre choix à tout moment :</p>
      <p><button className="btn btn-sm" onClick={openCookieSettings}>🍪 Gérer mes cookies</button></p>
    </Page>
  );
}
