<<<<<<< HEAD
# Art et saveur by Aude

Stack : React + Vite + Tailwind (client/) · Express + PostgreSQL (server/, module `pg`, Node ≥ 22.13).

## Base de données PostgreSQL
    docker compose up -d      # PostgreSQL 16 sur le port 5455 (base art_et_saveur)
Les tables sont créées automatiquement au démarrage du serveur.
Connexion par défaut : `postgres://postgres:postgres@localhost:5455/art_et_saveur`.
Pour une autre base : `DATABASE_URL="postgres://user:mdp@hote:5432/base"` (ajoutez `PGSSL=1` si SSL requis).

## Admin
- URL : `/admin` · mot de passe : **4 chiffres**, `2005` par défaut (créé au 1er démarrage, stocké haché).
- Pour un autre code initial : `ADMIN_PASSWORD=1234` (4 chiffres exigés).
- 8 essais maximum par IP toutes les 15 minutes.

## Production
    npm install && npm run build
    DATABASE_URL="postgres://..." DATA_DIR=/chemin/persistant npm start
- `DATA_DIR` : photos des gâteaux (`uploads/`). Doit être sur un disque persistant.

## Développement
    npm install && npm --prefix client install
    docker compose up -d
    npm run dev:server   # port 3000
    npm run dev:client   # port 5173 (proxy vers 3000)

## Architecture du serveur (MVC)
    server/
      index.js            point d'entrée (init BDD + démarrage)
      app.js              assemblage Express (middlewares, routes, front)
      config/             env.js · database.js (pool pg) · schema.js · defaults.js
      models/             accès aux données SQL (cake, quiz, player, admin, setting)
      controllers/        logique des requêtes HTTP (renvoient du JSON = la « vue »)
      routes/             publicRoutes.js · adminRoutes.js · index.js (préfixe /api)
      middlewares/        auth · upload · loginLimiter · asyncHandler · errorHandler
      services/           logique métier (jeton admin, classement, initialisation)
      utils/              password · validators · files

Ajouter une fonctionnalité : modèle (SQL) → contrôleur (logique HTTP) → route.

## Cookies, statistiques et pages légales
- Bandeau de consentement (accepter / refuser / personnaliser), rouvrable via « Gérer les cookies » dans le footer. Rien n'est mesuré avant un « oui ».
- Statistiques **maison** (aucun service tiers) : pages vues, clics (Commander, WhatsApp, TikTok, inscription au quiz), appareil, site d'origine. Pas d'IP stockée. Consultables dans l'admin → onglet « 📊 Statistiques ».
- Durées de conservation appliquées automatiquement (`server/services/retentionService.js`) : statistiques 13 mois, anciennes parties de quiz 12 mois.
- Pages `/mentions-legales` et `/confidentialite` : **compléter `client/src/lib/legalInfo.js`** (nom, SIRET, adresse, e-mail, hébergeur…). Les champs « À compléter » sont surlignés sur la page.
=======
# art_saveur_aude
>>>>>>> 8540c8eeca5260e55aad5e0e72f41f11a75f7243
