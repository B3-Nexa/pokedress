# Liste des fonctionnalités

> Version 2 du 30/10/2026. Établie à partir du README, de la spec (`specs/001-universal-containment/spec.md`, qui fait foi), de [criteres-acceptation.md](criteres-acceptation.md) et d'une **lecture du code** `backend/` + `frontend/` au 30/10/2026.
>
> **Priorité** : P1 = cœur du MVP · P2 = MVP · P3 = MVP, en dernier · Plus tard = après le MVP.
> **Offre** : Gratuit = inclus jusqu'à 100 objets et 2 membres · Premium = abonnement.
> **État du code** : ✅ fait (API + interface) · 🟡 partiel · ❌ absent.
> **E2E** : renvoie au test Cypress qui couvre la fonctionnalité (`frontend/cypress/e2e/`).

## 1. MVP

### Compte

| ID | Fonctionnalité | Ce que ça fait | Prio | Offre | État | Réf. | E2E |
|---|---|---|---|---|---|---|---|
| F-01 | **Inscription** | Créer un compte (prénom, email, mot de passe d'au moins 6 caractères), en créant un foyer ou en rejoignant un foyer avec un code. | P1 | Gratuit | ✅ | CA-5.1, CA-5.3 | `01-compte` |
| F-02 | **Connexion / déconnexion** | Se connecter avec email et mot de passe (jeton valable 30 jours) ; se déconnecter depuis l'onglet Foyer. | P1 | Gratuit | ✅ | CA-0.2 | `01-compte` |

### Saisie

| ID | Fonctionnalité | Ce que ça fait | Prio | Offre | État | Réf. | E2E |
|---|---|---|---|---|---|---|---|
| F-03 | **Ajout rapide** | Bouton « + » central : nom, pièce et catégorie obligatoires, tout le reste facultatif. | P1 | Gratuit | ✅ | US1 · CA-1.1 à 1.3 | `02-ajout-rapide` |
| F-04 | **Ajout enchaîné** | « + Enchaîner » (ou Entrée) : enregistre, vide le nom, garde la pièce et la catégorie. | P1 | Gratuit | ✅ | CA-1.4, 1.5 | `02-ajout-rapide` |
| F-05 | **Photo facultative** | Prendre ou choisir une photo, compressée sur le téléphone, sans détourage. | P1 | Gratuit | 🟡 ajout avec photo réparé le 30/10 ; reste que si l'envoi de la photo échoue, l'objet est perdu (CA-1.7) | CA-1.6, 1.7 | `02-ajout-rapide` |
| F-06 | **Compléter plus tard** | Fiche de l'objet : prix, marque, date d'achat, fin de garantie, notes. | P3 | Gratuit | 🟡 pas d'envoi de photo de facture dans l'interface (le champ existe dans l'API) | CA-6.3 | `07-fiche-objet` |
| F-07 | **Modifier un objet** | Corriger le nom, la pièce ou la catégorie d'un objet. | P2 | Gratuit | 🟡 possible via l'API (`PATCH`), absent de l'interface | — | — |
| F-08 | **Supprimer un objet** | Depuis la fiche, avec confirmation. Libère une place sous le mur des 100. | P2 | Gratuit | ✅ | CA-6.8 | `07-fiche-objet` |

### Consultation

| ID | Fonctionnalité | Ce que ça fait | Prio | Offre | État | Réf. | E2E |
|---|---|---|---|---|---|---|---|
| F-09 | **Vue par pièce** | Une carte par pièce avec son compteur, qu'on déplie pour voir les objets. | P1 | Gratuit | ✅ | CA-2.1 | `03-vues` |
| F-10 | **Vue par catégorie** | Objets regroupés par catégorie avec sous-total (catégories vides masquées). | P1 | Gratuit | ✅ | CA-2.2 | `03-vues` |
| F-11 | **Pièces par défaut** | 5 pièces créées avec le foyer : Salon, Cuisine, Chambre, Salle de bain, Cave/Garage. | P1 | Gratuit | ✅ | CA-2.5 | `03-vues` |
| F-12 | **Ajouter une pièce** | Onglet Foyer > « Gérer les pièces ». | P2 | Gratuit | ✅ | — | `06-foyer` |
| F-13 | **Rangement dans un meuble** | Rattacher un objet à un meuble ou une caisse (facultatif). | P2 | Gratuit | ❌ modèle `Container` présent, aucune route ni interface | FR-004 | — |

### Éviter les doublons

| ID | Fonctionnalité | Ce que ça fait | Prio | Offre | État | Réf. | E2E |
|---|---|---|---|---|---|---|---|
| F-14 | **Alerte doublon à la saisie** | Bandeau dès 2 caractères (300 ms), accents et majuscules ignorés, sans bloquer. | P1 | Gratuit | ✅ | CA-3.1 à 3.5 | `04-doublons-recherche` |
| F-15 | **Recherche** | Par nom, marque ou pièce, avec un message clair quand rien n'est trouvé. | P1 | Gratuit | ✅ (filtrage côté navigateur sur les objets chargés) | CA-3.6 à 3.8 | `04-doublons-recherche` |

### Dressing (catégorie « Dressing & Vêtements »)

| ID | Fonctionnalité | Ce que ça fait | Prio | Offre | État | Réf. | E2E |
|---|---|---|---|---|---|---|---|
| F-16 | **Onglet Dressing** | Vue filtrée sur la catégorie, avec compteur de pièces. | P2 | Gratuit | ✅ | US4 | `05-dressing` |
| F-17 | **Statut d'usage** | « Porté régulièrement » par défaut ; boutons « Marquer dormant » et « À revendre » en 1 clic. | P2 | Gratuit | ✅ | CA-4.2, 4.5 | `05-dressing` |
| F-18 | **Filtre par statut** | Tous / Portés / Dormants / À donner ou revendre. | P2 | Gratuit | ✅ | CA-4.4 | `05-dressing` |
| F-19 | **Champs vêtement** | Type, taille, saison (facultatifs). | P2 | Gratuit | 🟡 acceptés par l'API, absents de l'interface | CA-4.1, 4.3 | — |
| F-20 | **Prix de revente** | Prix facultatif et total « € estimés ». | P2 | Gratuit | 🟡 total affiché, mais aucun champ pour saisir le prix dans l'interface | CA-4.6 | — |

### Foyer

| ID | Fonctionnalité | Ce que ça fait | Prio | Offre | État | Réf. | E2E |
|---|---|---|---|---|---|---|---|
| F-21 | **Code d'invitation** | Code à 6 caractères affiché dans l'en-tête et l'onglet Foyer, avec bouton « Copier ». | P2 | Gratuit | ✅ | CA-5.1, 5.2 | `06-foyer` |
| F-22 | **Rejoindre un foyer** | Inscription avec le code (majuscules et espaces tolérés) ; message clair si le code est faux. | P2 | Gratuit | ✅ | CA-5.3 à 5.5 | `06-foyer` |
| F-23 | **Inventaire partagé** | Les deux membres voient et enrichissent le même inventaire ; liste des membres. | P2 | Gratuit | ✅ | CA-5.7 | `06-foyer` |
| F-24 | **Limite de 2 membres** | Le 3e membre est refusé en version gratuite. | P2 | Gratuit → **Premium** | ✅ | CA-5.6 | `06-foyer` |

### Tableau de bord et offre

| ID | Fonctionnalité | Ce que ça fait | Prio | Offre | État | Réf. | E2E |
|---|---|---|---|---|---|---|---|
| F-25 | **North Star Metric** | Total d'objets (1 fiche = 1 objet) dans l'onglet Stats. | P3 | Gratuit | ✅ | CA-6.1 | `08-stats-mur` |
| F-26 | **Objets par pièce** | Décompte brut par pièce, sans pourcentage. | P3 | Gratuit | ✅ | CA-6.2 | `08-stats-mur` |
| F-27 | **Valeur estimée** | Somme des prix renseignés, « sur X objets sur Y ». | P3 | Gratuit | ✅ | CA-6.4 | `08-stats-mur` |
| F-28 | **Avertissement à 90 objets** | Bandeau « Plus que N objets ». | P3 | Gratuit | 🟡 visible dans Stats, mais le badge de l'en-tête est masqué sous 640 px | CA-6.7 | `08-stats-mur` |
| F-29 | **Mur des 100 objets** | Le 101e ajout est refusé avec un message ; la lecture reste libre. | P3 | Gratuit → **Premium** | 🟡 deux ajouts simultanés à 99 objets peuvent passer tous les deux (comptage puis insertion) | CA-6.5, 6.6, 6.9 | `08-stats-mur` |
| F-30 | **Passer premium** | Souscrire pour avoir des objets et des membres illimités. | P3 | **Premium** | ❌ aucune page ni route (le plan n'est modifiable qu'en base) | vision | — |

### Socle

| ID | Fonctionnalité | Ce que ça fait | État | Réf. |
|---|---|---|---|---|
| F-31 | **Isolation des foyers** | Un foyer ne voit jamais les données d'un autre. | ✅ (les en-têtes de test sans jeton ne sont plus acceptés hors `NODE_ENV=test` depuis le 30/10) | CA-0.1 |
| F-32 | **Mobile d'abord** | Barre de navigation basse, « + » central, cibles d'au moins 44 px. | ✅ | CA-0.3 |

---

## 2. Plus tard (hors MVP)

| Fonctionnalité | Pourquoi plus tard |
|---|---|
| Export PDF pour l'assurance (premium) | Bénéfice secondaire (A-004). |
| Statistiques du dressing (premium) | L'API calcule déjà `dressing_stats`, mais rien ne l'affiche. |
| Reconnaissance d'objets par photo (IA) | Les concurrents se trompent souvent. Si elle arrive, elle doit seulement suggérer, et rester corrigeable. |
| « Dernière fois porté » et passage automatique en Dormant | Le statut manuel suffit au MVP. |
| Aide à la revente (export Vinted, prix indicatif) | Les vrais freins sont le temps et le prix. |
| Ajout hors ligne | Absent de la spec actuelle. |

## 3. Hors périmètre

- Localisation fine des objets. Attention : le README promet de savoir « où c'est rangé », ce qui contredit la vision.
- Champs nombreux, codes-barres, export CSV détaillé.
- Détourage automatique des photos.

## 4. Problèmes repérés en lisant le code

| # | Gravité | Problème | Où |
|---|---|---|---|
| 1 | ✅ Corrigé le 30/10 | En-têtes de test `x-household-id` / `x-user-id` acceptés sans jeton, même en production. Ils ne sont plus acceptés que si `NODE_ENV=test` (Vitest). | `backend/src/middleware/auth.middleware.ts` |
| 2 | ✅ Corrigé le 30/10 | Ajout avec photo en échec (400) : en `multipart/form-data`, `quantity` arrivait en texte. Le schéma convertit maintenant les nombres envoyés en texte (`quantity`, `resale_price`, `purchase_price`). | `backend/src/schemas/item.schema.ts` |
| 3 | ✅ Corrigé le 30/10 | Recherche API avec `(` en erreur 500 : le texte saisi est maintenant échappé avant de construire l'expression régulière. | `backend/src/services/item.service.ts` (`getItems`) |
| 4 | 🟠 Règle métier | Mur des 100 objets : deux ajouts simultanés à 99 objets peuvent passer tous les deux. | `ItemService.createItem` |
| 5 | 🟡 Écart | Photo : si l'envoi échoue, l'objet est perdu (CA-1.7). | `FastAddModal` + `POST /api/items` |
| 6 | 🟡 Écart | Il manque dans l'interface : modifier nom, pièce et catégorie ; champs vêtement ; prix de revente ; photo de facture. | frontend |
| 7 | 🟡 Qualité | `ItemEnrichmentModal` appelle ses `useState` après un `return null` (règle des hooks enfreinte). Pas de plantage constaté en E2E, mais c'est fragile. | `frontend/src/components/inventory/ItemEnrichmentModal.tsx` |
| 8 | 🟡 Ergonomie | Après déconnexion puis reconnexion, l'app rouvre le dernier onglet (« Foyer ») au lieu de l'inventaire. | `frontend/src/App.tsx` (`activeTab` non réinitialisé) |

## 5. Résultat des tests E2E (30/10/2026)

Cypress 14.5.4, Electron, écran 375 × 812, MongoDB lancé avec `docker compose`, base `pokedress_e2e`.

- **Premier passage : 32 tests réussis sur 35.** Les 3 échecs ont révélé les problèmes 1, 2 et 3.
- **Après correction : 35 / 35.** Les 24 tests Vitest du backend passent toujours.

| Fichier | Résultat |
|---|---|
| `01-compte` | 4 / 4 |
| `02-ajout-rapide` | 4 / 4 |
| `03-vues` | 3 / 3 |
| `04-doublons-recherche` | 5 / 5 |
| `05-dressing` | 2 / 2 |
| `06-foyer` | 5 / 5 |
| `07-fiche-objet` | 4 / 4 |
| `08-stats-mur` | 3 / 3 |
| `09-securite-api` | 5 / 5 |
