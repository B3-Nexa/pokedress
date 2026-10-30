# État du projet

## Reprendre ici

- **Objectif** : app d'inventaire du foyer (projet de cours B3), MVP centré sur la saisie en moins de 10 s.
- **Fait** :
  - vision produit (`docs/vision-produit-inventaire.md`, vocabulaire « foyer ») ;
  - spec 001 et constitution (spec-kit) : **la spec fait foi** ;
  - recherche terrain documentaire (`docs/recherche-terrain.md`) ;
  - personas proto v1.1 (`docs/personas.md`) ;
  - critères d'acceptation des 6 US (`docs/criteres-acceptation.md`, 29/10/2026) ;
  - code backend + frontend (commit « sixth commit ») ; le backend est passé en ESM (`"type": "module"`) pour que `npm run build` et `npm start` fonctionnent (30/10) ;
  - liste des fonctionnalités avec leur état dans le code (`docs/fonctionnalites.md`, 30/10) ;
  - tests E2E Cypress dans `frontend/cypress/` : **35 / 35** après correction de 3 bugs (30/10) ; tests backend Vitest 24 / 24.
  - Décisions du 29/10 : foyer plutôt que couple, mur des 100 objets assumé, spec de référence, dressing = catégorie, partage gratuit jusqu'à 2 membres, critères au format Étant donné / Quand / Alors, 1 fiche = 1 objet, vêtement `active` par défaut, `resale_price` facultatif, nombre d'objets par pièce, bandeau à 90 objets, statut « Dormant » manuel, export PDF hors MVP, 5 pièces par défaut.
- **Corrigé le 30/10** : en-têtes de test sans jeton refusés hors `NODE_ENV=test`, ajout avec photo, recherche API avec `(`.
- **Encore ouvert** (détail dans `docs/fonctionnalites.md` §4) :
  - mur des 100 objets pas protégé contre deux ajouts simultanés ;
  - photo perdue si l'envoi échoue (CA-1.7) ;
  - manques d'interface : modifier un objet, champs vêtement, prix de revente, photo de facture ;
  - hooks après `return null` dans `ItemEnrichmentModal` ;
  - l'onglet actif est gardé après une reconnexion.
- **Bloqué / à trancher par Dylan** : rien.
- **Prochaine action** : commiter, puis traiter les manques d'interface ou mener les entretiens utilisateurs (section 9 de la recherche).
- **Lancer en local** : `docker compose up -d` à la racine, `npm run dev` dans `backend/` (port 5000), `npm run dev` dans `frontend/` (port 5173). Pour les tests E2E : backend sur le port 5050 avec `MONGODB_URI=mongodb://localhost:27017/pokedress_e2e`, front avec `API_URL=http://localhost:5050` sur le port 5180, puis `CYPRESS_BASE_URL=http://localhost:5180 npm run e2e` dans `frontend/`.
- **Mesures utilisateur** (critères 👤) : aucune pour l'instant.
- **Incident Docker du 30/10** : Docker Desktop plantait sur un socket bloqué ; le dossier `%LOCALAPPDATA%\Docker\run` a été renommé en `run.old-20261030` (supprimable plus tard).
