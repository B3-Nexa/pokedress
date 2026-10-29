# Critères d'acceptation : MVP inventaire du foyer

> Version 1 du 29/10/2026. Ce document décline en scénarios testables les 6 user stories de `specs/001-universal-containment/spec.md`. **La spec fait foi** : en cas d'écart, c'est elle qui gagne et ce document est corrigé.
> Format : **Étant donné / Quand / Alors**. Chaque critère a un identifiant `CA-x.y`, renvoie aux exigences (FR) et critères de succès (SC) de la spec, et précise comment le vérifier :
> - 🤖 **auto** : test automatisé (Vitest + Supertest côté API, test de composant côté front) ;
> - 👤 **utilisateur** : test chronométré avec une vraie personne, sur smartphone.
>
> Les points que la spec laissait ouverts ont été tranchés le 29/10/2026 (voir la fin du document).

---

## Règles communes à toutes les US

| ID | Critère | Réf. | Vérif. |
|---|---|---|---|
| CA-0.1 | **Étant donné** deux foyers A et B, **quand** un membre de A appelle n'importe quelle route (`/api/items`, `/api/rooms`, `/api/dashboard`, `/api/household`, recherche, doublons), **alors** il ne reçoit jamais de donnée de B, et un accès direct à un objet de B par son id renvoie 404. | FR-007, constitution | 🤖 |
| CA-0.2 | **Étant donné** un utilisateur non connecté, **quand** il appelle une route `/api/*` protégée, **alors** il reçoit 401 et aucune donnée. | FR-007 | 🤖 |
| CA-0.3 | **Étant donné** un écran de 375 px de large, **quand** on utilise l'ajout rapide, la recherche et la vue d'ensemble, **alors** tout reste utilisable sans défilement horizontal, et les boutons font au moins 44 × 44 px. | A-001 | 👤 |
| CA-0.4 | **Étant donné** une requête invalide (champ manquant, type faux), **quand** l'API la reçoit, **alors** elle répond 400 avec un message en français par champ (validation Zod), sans planter. | constitution V | 🤖 |

---

## US1 : ajout rapide (< 10 s) et ajout enchaîné · P1

*Persona : Léa pendant le grand rangement, Sarah pendant le tri du placard.*

**CA-1.1 : ajout minimal**
- **Étant donné** la fenêtre d'ajout rapide ouverte
- **Quand** l'utilisateur saisit « Grille-pain », choisit la pièce « Cuisine » et la catégorie « Électroménager », sans photo ni autre champ, puis valide
- **Alors** l'objet est enregistré dans le foyer avec `quantity = 1` et tous les champs facultatifs à `null`
- **Et** l'API répond en moins de 100 ms (hors envoi de photo)
- **Et** un message de confirmation s'affiche, avec l'action « Ajouter un autre objet »

Réf. : FR-001, FR-003 · Vérif. : 🤖

**CA-1.2 : seuls trois champs bloquent**
- **Étant donné** la fenêtre d'ajout rapide
- **Quand** il manque le nom, la pièce ou la catégorie
- **Alors** l'enregistrement est refusé et un message indique le champ manquant (« La pièce est obligatoire »)
- **Et** aucun autre champ (photo, prix, date, marque, garantie, notes, contenant) ne peut bloquer l'enregistrement

Réf. : FR-001, FR-003 · Vérif. : 🤖

**CA-1.3 : longueur du nom**
- **Étant donné** la fenêtre d'ajout rapide
- **Quand** le nom fait moins de 2 caractères ou plus de 100
- **Alors** l'enregistrement est refusé avec le message « Le nom doit comporter au moins 2 caractères » (ou l'équivalent pour la longueur maximale)

Réf. : data-model `fastAddItemSchema` · Vérif. : 🤖

**CA-1.4 : ajout enchaîné**
- **Étant donné** un objet qui vient d'être enregistré dans « Chambre » / « Dressing & Vêtements »
- **Quand** l'utilisateur choisit « Ajouter un autre objet »
- **Alors** la fenêtre reste ouverte, le nom est vidé et le curseur y est placé
- **Et** la pièce « Chambre » et la catégorie « Dressing & Vêtements » restent sélectionnées
- **Et** l'objet suivant s'enregistre en tapant seulement son nom

Réf. : FR-009, SC-002 · Vérif. : 🤖 (composant)

**CA-1.5 : changer de pièce en cours d'enchaînement**
- **Étant donné** un ajout enchaîné en cours dans « Cuisine »
- **Quand** l'utilisateur passe la pièce sur « Salon »
- **Alors** les objets suivants gardent « Salon » jusqu'au prochain changement (même règle pour la catégorie)

Réf. : spec, cas limites · Vérif. : 🤖 (composant)

**CA-1.6 : photo facultative et brute**
- **Étant donné** un utilisateur qui ajoute une photo (appareil photo ou galerie)
- **Quand** il valide
- **Alors** la photo est compressée sur le téléphone avant l'envoi (moins de 200 Ko visés) et enregistrée telle quelle, sans détourage
- **Et** aucune étape de recadrage ou de détourage n'est imposée

Réf. : FR-002 · Vérif. : 🤖 (taille du fichier envoyé) + 👤

**CA-1.7 : la photo échoue, l'objet est conservé**
- **Étant donné** une photo dont la compression ou l'envoi échoue (réseau coupé, fichier corrompu)
- **Quand** l'utilisateur valide
- **Alors** le nom, la pièce et la catégorie sont enregistrés quand même
- **Et** un message indique que la photo n'a pas été jointe et peut être ajoutée plus tard
- **Et** rien de ce qui a été tapé n'est perdu

Réf. : spec, cas limites · Vérif. : 🤖

**CA-1.8 : temps réel de saisie (test utilisateur)**
- **Étant donné** 5 testeurs qui n'ont jamais vu l'app, sur leur propre smartphone
- **Quand** chacun ajoute 10 objets réels, en chronométrant de l'ouverture de l'ajout à la confirmation
- **Alors** le temps moyen du premier objet est inférieur à 10 s
- **Et** le temps moyen des objets 2 à 10 en ajout enchaîné est inférieur à 5 s

Réf. : SC-001, SC-002 · Vérif. : 👤

---

## US2 : vue d'ensemble par pièce et par catégorie · P1

*Persona : Léa, « qu'est-ce qu'on a à la maison ? ».*

**CA-2.1 : vue par pièce**
- **Étant donné** un foyer avec 14 objets dans « Salon » et 28 dans « Cuisine »
- **Quand** l'utilisateur ouvre l'onglet « Par pièce »
- **Alors** il voit une carte par pièce avec son compteur exact (« Salon (14 objets) », « Cuisine (28 objets) »)
- **Et** ouvrir une carte affiche ses objets, avec leur photo si elle existe

Réf. : US2 · Vérif. : 🤖

**CA-2.2 : vue par catégorie**
- **Étant donné** le même foyer
- **Quand** l'utilisateur ouvre l'onglet « Par catégorie »
- **Alors** les objets sont regroupés par catégorie, avec un sous-total par catégorie
- **Et** la somme des sous-totaux est égale au nombre total d'objets du foyer

Réf. : US2, FR-012 · Vérif. : 🤖

**CA-2.3 : une fiche compte pour un objet**
- **Étant donné** un objet « Verre » avec `quantity = 6`
- **Quand** les compteurs sont calculés (vues, North Star Metric, limite de 100)
- **Alors** il compte pour **1 objet**, et sa carte affiche « × 6 »

Réf. : FR-010, FR-013 · Vérif. : 🤖

**CA-2.4 : objets sans photo**
- **Étant donné** des objets sans photo
- **Quand** ils s'affichent dans les vues
- **Alors** une vignette neutre (icône de la catégorie) remplace la photo, sans image cassée

Réf. : FR-002 · Vérif. : 🤖 (composant)

**CA-2.5 : pièce vide et premier lancement**
- **Étant donné** un foyer qui vient d'être créé et ne contient aucun objet
- **Quand** l'utilisateur ouvre la vue d'ensemble
- **Alors** le foyer contient déjà 5 pièces créées par défaut (Salon, Cuisine, Chambre, Salle de bain, Cave/Garage)
- **Et** un appel clair invite à ajouter le premier objet, au lieu d'une page blanche
- **Et** l'ajout rapide propose ces pièces dès le premier objet

Réf. : spec, cas limites (« Premier lancement ») ; plan (`room.model.ts`, création des pièces par défaut) · Vérif. : 🤖

**CA-2.6 : nom très long**
- **Étant donné** un objet de 100 caractères
- **Quand** il s'affiche dans une carte
- **Alors** le nom est coupé proprement (points de suspension) sans casser la mise en page à 375 px

Réf. : CA-0.3 · Vérif. : 👤

---

## US3 : détection des doublons et recherche · P1

*Persona : Léa avant un achat, Sarah en magasin.*

**CA-3.1 : alerte à la saisie**
- **Étant donné** un objet « Rallonge 5m » dans « Salon »
- **Quand** l'utilisateur tape « Rallonge » dans le nom de l'ajout rapide
- **Alors** après 300 ms sans frappe, un bandeau affiche « 1 objet similaire trouvé : Rallonge 5m (Salon) »

Réf. : FR-005, SC-003 · Vérif. : 🤖

**CA-3.2 : l'alerte ne bloque jamais**
- **Étant donné** le bandeau de doublon affiché
- **Quand** l'utilisateur valide quand même
- **Alors** l'objet est enregistré normalement, sans fenêtre de confirmation supplémentaire

Réf. : US3 scénario 2, SC-003 · Vérif. : 🤖

**CA-3.3 : accents et majuscules ignorés**
- **Étant donné** un objet « Sèche-cheveux »
- **Quand** l'utilisateur tape « seche cheveux » ou « SECHE-CHEVEUX »
- **Alors** l'objet est détecté comme similaire

Réf. : research §2 · Vérif. : 🤖

**CA-3.4 : plusieurs correspondances**
- **Étant donné** 5 objets similaires dans le foyer
- **Quand** le bandeau s'affiche
- **Alors** il montre le nombre total (« 5 objets similaires ») et les 2 premiers avec leur pièce
- **Et** un lien « Voir tout » affiche les 5

Réf. : spec, cas limites · Vérif. : 🤖

**CA-3.5 : pas d'alerte inutile**
- **Étant donné** aucun objet similaire
- **Quand** l'utilisateur tape un nom
- **Alors** aucun bandeau n'apparaît (pas de « 0 objet trouvé »)
- **Et** la vérification n'est lancée qu'à partir de 2 caractères

Réf. : FR-005 · Vérif. : 🤖

**CA-3.6 : recherche en magasin**
- **Étant donné** un foyer de 500 objets dont 2 « Jean noir »
- **Quand** l'utilisateur cherche « jean noir »
- **Alors** les 2 jeans s'affichent avec leur photo et leur pièce
- **Et** l'API répond en moins de 200 ms

Réf. : FR-011, US3 scénario 3 · Vérif. : 🤖 (temps mesuré sur un jeu de 500 objets)

**CA-3.7 : recherche par pièce ou catégorie**
- **Étant donné** des objets dans « Cave »
- **Quand** l'utilisateur cherche « cave »
- **Alors** les objets de la pièce « Cave » remontent aussi, pas seulement ceux dont le nom contient « cave »

Réf. : FR-011 · Vérif. : 🤖

**CA-3.8 : recherche sans résultat**
- **Étant donné** une recherche qui ne trouve rien
- **Quand** les résultats s'affichent
- **Alors** un message dit clairement « Vous ne possédez rien qui ressemble à "…" »

Réf. : US3 · Vérif. : 🤖 (composant)

---

## US4 : catégorie Dressing et cycle de vie des vêtements · P2

*Persona : Sarah. Le dressing est une **catégorie enrichie**, pas un module à part.*

**CA-4.1 : même ajout que le reste**
- **Étant donné** la catégorie « Dressing & Vêtements » sélectionnée dans l'ajout rapide
- **Quand** l'utilisateur ajoute un vêtement
- **Alors** les champs obligatoires restent nom, pièce et catégorie
- **Et** type, taille, saison et statut sont proposés mais facultatifs

Réf. : FR-001, FR-006, décision du 29/10 · Vérif. : 🤖

**CA-4.2 : statut par défaut**
- **Étant donné** un vêtement ajouté sans statut
- **Quand** il est enregistré
- **Alors** son statut vaut `active` (« Porté régulièrement »)
- **Et** le statut est toujours posé à la main : aucun passage automatique à « Dormant » au MVP

Réf. : FR-006 · Vérif. : 🤖

**CA-4.3 : champs du dressing réservés aux vêtements**
- **Étant donné** un objet hors de la catégorie « Dressing & Vêtements »
- **Quand** il est créé ou modifié
- **Alors** les champs `dressing_status`, `clothing_type`, `size` et `season` ne sont ni proposés ni enregistrés

Réf. : FR-006 · Vérif. : 🤖

**CA-4.4 : filtrer les vêtements dormants**
- **Étant donné** 10 vêtements dont 3 marqués « Dormant »
- **Quand** l'utilisateur applique le filtre « Dormant » en 1 clic
- **Alors** exactement ces 3 vêtements s'affichent

Réf. : US4 scénario 1, SC-005 · Vérif. : 🤖

**CA-4.5 : changer le statut en 1 clic**
- **Étant donné** un vêtement « Dormant »
- **Quand** l'utilisateur touche l'action « À donner ou revendre »
- **Alors** le statut change sans ouvrir de formulaire
- **Et** le vêtement apparaît dans la liste « À donner ou revendre »

Réf. : FR-006, SC-005 · Vérif. : 🤖

**CA-4.6 : prix de revente facultatif**
- **Étant donné** un vêtement « À donner ou revendre »
- **Quand** l'utilisateur renseigne ou non un prix de revente (`resale_price`, nombre ≥ 0)
- **Alors** les deux cas sont acceptés
- **Et** la liste « À donner ou revendre » affiche le total des prix de revente renseignés, en ignorant ceux qui sont vides

Réf. : US4 scénario 2, data-model `resale_price` · Vérif. : 🤖

---

## US5 : partage du foyer (2 membres gratuits) · P2

*Personas : Léa crée le foyer, Marc le rejoint.*

**CA-5.1 : création du foyer à l'inscription**
- **Étant donné** une personne qui s'inscrit sans code d'invitation
- **Quand** l'inscription est validée
- **Alors** un foyer est créé, elle en est `owner`, et un code unique de 6 caractères (lettres majuscules et chiffres) est généré

Réf. : FR-008, research §3 · Vérif. : 🤖

**CA-5.2 : voir et copier le code**
- **Étant donné** un membre du foyer
- **Quand** il ouvre les réglages
- **Alors** le code d'invitation s'affiche avec un bouton « Copier » qui fonctionne en 1 clic

Réf. : US5 scénario 1 · Vérif. : 🤖 (composant)

**CA-5.3 : rejoindre le foyer**
- **Étant donné** le code `K9X2P4` d'un foyer gratuit qui compte 1 membre
- **Quand** Marc s'inscrit en saisissant ce code
- **Alors** il rejoint ce foyer comme `member`, sans qu'un second foyer soit créé
- **Et** il voit immédiatement toutes les pièces et tous les objets

Réf. : US5 scénario 2, FR-007 · Vérif. : 🤖

**CA-5.4 : saisie du code tolérante**
- **Étant donné** le code `K9X2P4`
- **Quand** il est saisi « k9x2p4 » ou avec des espaces autour
- **Alors** il est accepté

Réf. : FR-008, SC-006 · Vérif. : 🤖

**CA-5.5 : code invalide**
- **Étant donné** un code qui n'existe pas
- **Quand** il est saisi
- **Alors** le message « Ce code ne correspond à aucun foyer » s'affiche et l'inscription n'est pas bloquée (on peut continuer sans code)

Réf. : FR-008 · Vérif. : 🤖

**CA-5.6 : limite de 2 membres en gratuit**
- **Étant donné** un foyer gratuit qui compte déjà 2 membres
- **Quand** une troisième personne saisit le code
- **Alors** elle ne rejoint pas le foyer, et un message explique que le foyer est complet en version gratuite et qu'un passage en premium permet d'ajouter des membres
- **Et** aucun compte n'est rattaché à moitié

Réf. : FR-007, décision « gratuit à 2 membres » · Vérif. : 🤖

**CA-5.7 : tout le monde contribue au même inventaire**
- **Étant donné** Léa et Marc dans le même foyer
- **Quand** Marc ajoute « Perceuse »
- **Alors** Léa la voit dans sa vue d'ensemble et dans ses recherches au prochain rafraîchissement des données (sans avoir à se déconnecter)
- **Et** les objets de Marc déclenchent les alertes de doublon chez Léa

Réf. : FR-007, US5 · Vérif. : 🤖

**CA-5.8 : rejoindre en moins de 30 s (test utilisateur)**
- **Étant donné** un testeur qui a reçu un code par message
- **Quand** il installe ou ouvre l'app et rejoint le foyer
- **Alors** le temps entre la saisie du code et l'affichage de l'inventaire commun est inférieur à 30 s

Réf. : SC-006 · Vérif. : 👤

---

## US6 : tableau de bord, factures et mur des 100 objets · P3

*Personas : Marc (factures, garanties), Sarah (mur des 100 objets).*

**CA-6.1 : North Star Metric visible**
- **Étant donné** un foyer de 142 objets
- **Quand** un membre ouvre le tableau de bord
- **Alors** le total « 142 objets inventoriés » est affiché en premier
- **Et** il se met à jour dès qu'un objet est ajouté ou supprimé

Réf. : FR-010, SC-004 · Vérif. : 🤖

**CA-6.2 : nombre d'objets par pièce**
- **Étant donné** des objets répartis dans plusieurs pièces
- **Quand** le tableau de bord s'affiche
- **Alors** chaque pièce montre son nombre d'objets, sans pourcentage ni barre de progression (aucun objectif par pièce n'est connu)
- **Et** une pièce vide affiche « 0 objet » et propose d'en ajouter un

Réf. : FR-010 · Vérif. : 🤖

**CA-6.3 : compléter plus tard**
- **Étant donné** un objet « Écran 27 pouces » créé avec les 3 champs obligatoires
- **Quand** Marc modifie l'objet plus tard pour ajouter la photo de la facture, la date d'achat et la fin de garantie
- **Alors** ces informations sont enregistrées sur l'objet
- **Et** la création initiale n'a jamais demandé ces champs

Réf. : US6 scénario 1, FR-003 · Vérif. : 🤖

**CA-6.4 : valeur totale avec des prix manquants**
- **Étant donné** 10 objets, dont 4 avec un prix (100 €, 250 €, 49,99 €, 600 €)
- **Quand** la valeur totale est calculée
- **Alors** elle vaut 999,99 €, les 6 objets sans prix sont ignorés sans erreur
- **Et** l'écran précise « valeur estimée sur 4 objets sur 10 »

Réf. : FR-003, US6 · Vérif. : 🤖

**CA-6.5 : le mur des 100 objets bloque seulement l'ajout**
- **Étant donné** un foyer gratuit qui contient 100 objets
- **Quand** un membre tente d'ajouter un 101e objet
- **Alors** l'API répond 403 `UPGRADE_REQUIRED`, l'objet n'est pas créé
- **Et** l'app affiche un message clair qui propose le premium (objets illimités), sans perdre ce qui a été tapé

Réf. : FR-013, research §5 · Vérif. : 🤖

**CA-6.6 : au-delà du mur, tout reste lisible**
- **Étant donné** un foyer gratuit à 100 objets
- **Quand** un membre parcourt, recherche, ouvre ou modifie un objet existant, ou change le statut d'un vêtement
- **Alors** tout fonctionne normalement
- **Et** aucun objet n'est masqué ni verrouillé

Réf. : FR-013, SC-007 · Vérif. : 🤖

**CA-6.7 : prévenir avant le mur**
- **Étant donné** un foyer gratuit
- **Quand** il atteint 90 objets
- **Alors** un bandeau discret indique le nombre d'objets restants (« Plus que 10 objets en version gratuite »), sans bloquer l'ajout
- **Et** en dessous de 90 objets, aucun bandeau n'apparaît

Réf. : FR-013, personas (Sarah) · Vérif. : 🤖

**CA-6.8 : supprimer libère de la place**
- **Étant donné** un foyer gratuit à 100 objets
- **Quand** un membre supprime un objet
- **Alors** il peut de nouveau en ajouter un

Réf. : FR-013 · Vérif. : 🤖

**CA-6.9 : deux ajouts simultanés à 99 objets**
- **Étant donné** un foyer gratuit à 99 objets
- **Quand** Léa et Marc ajoutent un objet au même moment
- **Alors** un seul passe, l'autre reçoit 403 `UPGRADE_REQUIRED` : le foyer ne dépasse jamais 100 objets

Réf. : FR-013 · Vérif. : 🤖

---

## Définition de « terminé » pour une US

Une US est terminée quand :
1. tous ses critères 🤖 passent dans la suite de tests ;
2. ses critères 👤 ont été mesurés au moins une fois, avec les chiffres notés dans `docs/etat.md` ;
3. les règles communes CA-0.1 à CA-0.4 passent toujours ;
4. aucune erreur TypeScript au build (constitution).

---

## Points tranchés le 29/10/2026

Les 8 propositions ont été acceptées par Dylan et reportées dans la spec, le modèle de données, le contrat d'API, le plan et les tâches.

| # | Décision | Critères |
|---|---|---|
| 1 | Une fiche compte pour **1 objet**, quelle que soit sa quantité (compteurs, North Star Metric, limite de 100). | CA-2.3 |
| 2 | Un nouveau vêtement est `active` par défaut. | CA-4.2 |
| 3 | Ajout d'un champ facultatif `resale_price` dans le modèle de données. | CA-4.6 |
| 4 | La « progression par pièce » devient le **nombre d'objets par pièce**, sans pourcentage. | CA-6.2 |
| 5 | Un bandeau prévient à partir de **90 objets**. | CA-6.7 |
| 6 | Le statut « Dormant » est **posé à la main** au MVP ; pas de champ « dernière fois porté ». | CA-4.2 |
| 7 | L'**export PDF** pour l'assurance est **hors MVP**. Il reste dans la vision comme fonction premium. | — |
| 8 | Les 5 **pièces par défaut** sont créées avec le foyer (nouveau cas limite dans la spec). | CA-2.5 |
