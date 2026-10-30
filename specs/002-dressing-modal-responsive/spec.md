# Feature Specification: Dressing Dedicated Modal and Responsive Layout

**Feature Branch**: `002-dressing-modal-responsive`

**Created**: 2026-10-30

**Status**: Ready for Planning

**Input**: User description: "en utilisant spec-kit il faudrait que tu me corriges des bug, en effet, quand j'ajoute un vetement c'est la meme modale que quand je veux ajouter un objet à une piece .... il faudrait que le dressing ai sa propre modale bien spécifique ... également, il faudrait plus que la ppage use de l'entiereté de l'ecran, là j'ai l'impression d'avoir affaire à un pseudo téléphone sur mon pc quoi tu vois le probleme ? rend le simplement + responsive en gros"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Modale d'ajout dédiée et enrichie pour le Dressing (Priority: P1)

En tant qu'utilisateur gérant ma garde-robe dans PokeDress, lorsque je suis dans l'onglet Dressing et que je clique sur "Ajouter un vêtement" (ou sur le bouton d'ajout rapide dans ce contexte), je souhaite voir une modale dédiée et spécifique aux vêtements plutôt que la modale générique d'ajout d'objets ménagers (qui propose de la vaisselle, du bricolage, etc.). Cette modale doit cibler directement la catégorie Dressing et proposer les attributs pertinents du cycle de vie du vêtement (type de vêtement, taille, marque, statut dressing actif/dormant/à revendre, saison, prix de revente potentiel) tout en restant rapide (< 10s).

**Why this priority**: C'est le bug ergonomique principal mentionné par l'utilisateur. Actuellement, ajouter un vêtement force l'utilisateur à passer par le même formulaire qu'un objet de bricolage ou d'électroménager, sans les champs spécifiques du dressing au moment de la saisie.

**Independent Test**:
1. Accéder à l'onglet "Dressing".
2. Cliquer sur "Ajouter un vêtement" (ou le bouton d'ajout central depuis le Dressing).
3. Constater l'ouverture d'une modale spécifique au dressing avec titre "Ajouter un vêtement", catégorie préconfigurée "Dressing & Vêtements", champs spécifiques (nom, type de pièce/vêtement, taille, marque, statut actif/dormant/à revendre, saison, photo facultative).
4. Ajouter un vêtement : le vêtement apparaît immédiatement dans la galerie dressing avec les attributs renseignés.

**Acceptance Scenarios**:

1. **Given** l'utilisateur est sur la page Dressing, **When** il clique sur "Ajouter un vêtement", **Then** la modale spécifique au Dressing s'ouvre avec les champs de garde-robe (nom, type, taille, marque, statut du cycle de vie, saison, pièce, photo facultative) et la catégorie est automatiquement fixée à `dressing_vetements`.
2. **Given** l'utilisateur remplit le formulaire de vêtement avec un nom (>= 2 caractères) et choisit le statut "À donner ou revendre", **When** il renseigne un prix de revente estimé et valide, **Then** le vêtement est créé avec ce statut et ce prix, et la bannière du dressing met à jour le montant total estimé.
3. **Given** l'utilisateur est sur l'onglet Inventaire / Vue par Pièce, **When** il clique sur le bouton central "+" d'ajout rapide, **Then** la modale générique de pièce habituelle s'ouvre toujours sans impacter l'ajout rapide universel.
4. **Given** l'utilisateur utilise le bouton d'enchaînement ("+ Enchaîner") dans la modale dressing, **When** il enregistre un premier vêtement, **Then** le vêtement est créé, les champs de contexte (pièce, marque, saison) sont conservés, et le focus revient immédiatement sur le nom du vêtement suivant (< 5s).

---

### User Story 2 - Expérience Responsive Desktop Plein Écran (Priority: P2)

En tant qu'utilisateur sur ordinateur (PC / Mac) ou tablette en mode paysage, lorsque j'utilise PokeDress, je souhaite que l'interface exploite harmonieusement la largeur de mon écran au lieu de restreindre le contenu à un conteneur étroit simulant un smartphone au milieu d'un grand écran vide.

**Why this priority**: L'utilisateur déplore l'aspect "pseudo téléphone sur mon pc". Le confort de visualisation et d'utilisation sur ordinateur doit offrir des grilles multi-colonnes adaptatives, une navigation adaptée (barre de navigation desktop intégrée ou barre responsive élégante), et des conteneurs élargis.

**Independent Test**:
1. Ouvrir l'application sur un écran large (> 1024px).
2. Constater que la mise en page utilise l'espace disponible (conteneur `max-w-7xl` ou fluide avec marges aérées plutôt qu'un étroit 896px centré).
3. Constater que la galerie dressing s'affiche sous forme d'une grille multi-colonnes (2 à 4 colonnes selon la résolution) au lieu d'une unique colonne mobile étroite.
4. Constater que la navigation sur grand écran s'intègre naturellement (liens de navigation lisibles en haut ou disposition fluide, sans la barre mobile flottante miniature bloquée au milieu du bas d'écran).
5. Réduire la fenêtre vers une taille mobile (< 640px) et constater que le comportement mobile reste parfaitement intact.

**Acceptance Scenarios**:

1. **Given** l'affichage sur écran large (>= 1024px), **When** l'utilisateur consulte le Dressing, **Then** les cartes de vêtements s'organisent en grille responsive multi-colonnes aérée avec visuels clairs et accès rapide aux statuts.
2. **Given** l'affichage sur écran large (>= 768px / >= 1024px), **When** l'utilisateur navigue dans l'application, **Then** les onglets de navigation sont intégrés dans le bandeau de navigation supérieur (desktop header) avec boutons explicites, et la barre mobile n'obstrue pas le bas de page sur grand écran.
3. **Given** l'affichage sur écran mobile (< 768px), **When** l'utilisateur navigue, **Then** la barre de navigation basse (BottomNav) reste active et optimisée pour l'usage au pouce avec cibles tactiles >= 44px.
4. **Given** l'affichage de la vue Inventaire (par Pièce / par Catégorie) et du Dashboard sur grand écran, **When** l'utilisateur les consulte, **Then** les éléments s'affichent sous forme de grilles et colonnes équilibrées tirant parti de la largeur de l'écran.

---

### User Story 3 - Ergonomie des Modales et Actions Rapides Responsive (Priority: P3)

En tant qu'utilisateur sur desktop ou mobile, lorsque j'ouvre une modale (modale dressing ou modale d'ajout rapide), je souhaite une ergonomie adaptée à mon terminal : modale centrée avec largeur confortable et scroll interne sur desktop, bottom-sheet fluide sur mobile.

**Why this priority**: Les modales doivent être ergonomiques sur toutes les résolutions d'écran sans déborder ni paraître étriquées.

**Independent Test**:
1. Ouvrir la modale dressing sur desktop : elle est élégamment centrée, d'une largeur confortable (e.g. max-w-lg ou max-w-xl), avec scrollbar si le contenu dépasse.
2. Ouvrir la même modale sur mobile : elle se présente sous forme de bottom sheet adaptée aux écrans tactiles.

**Acceptance Scenarios**:

1. **Given** un écran desktop, **When** la modale dressing ou la modale d'ajout rapide s'ouvre, **Then** elle s'affiche centrée avec une largeur adaptée (max-w-xl), un scroll fluide et des boutons d'actions bien disposés.
2. **Given** un écran mobile, **When** la modale s'ouvre, **Then** elle s'affiche confortablement sans masquer les actions critiques d'enregistrement.

---

### Edge Cases

- **Utilisateur sans pièce configurée** : Si aucune pièce n'existe encore ou si le foyer est nouveau, la modale dressing doit pouvoir sélectionner la première pièce existante ou créer/utiliser par défaut "Chambre / Dressing".
- **Statut "À revendre ou donner" sans prix** : Si l'utilisateur choisit ce statut mais ne renseigne pas de prix, le vêtement est tout de même enregistré sans prix de revente et comptabilisé dans les dons potentiels.
- **Redimensionnement dynamique de la fenêtre navigateur** : Le basculement entre la vue mobile (BottomNav) et la vue desktop (TopNav intégrée / grilles larges) doit être instantané et fluide sans rafraîchissement ni perte d'état de formulaire.
- **Noms longs ou marques longues** : Les cartes de vêtements en grille responsive doivent tronquer élégamment les textes sans casser l'alignement de la grille.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT fournir un composant de modale spécifique au dressing (`DressingAddModal`), distinct du composant générique `FastAddModal`.
- **FR-002**: L'action d'ajout depuis la page Dressing (bouton d'en-tête ou bouton d'état vide) DOIT déclencher l'ouverture de `DressingAddModal`.
- **FR-003**: `DressingAddModal` DOIT pré-assigner la catégorie `dressing_vetements` sans obliger l'utilisateur à choisir parmi les catégories d'objets ménagers non pertinentes.
- **FR-004**: `DressingAddModal` DOIT supporter les champs spécifiques de garde-robe : nom du vêtement (obligatoire, min 2 caractères), type de vêtement (haut, bas, robe, manteau, chaussures, accessoire, sous-vêtements), taille, marque, statut du dressing (`active`, `dormant`, `to_sell_or_donate`), prix de revente estimé (si statut à revendre), saison (`toute_saison`, `printemps_ete`, `automne_hiver`), pièce de rangement, et photo facultative.
- **FR-005**: `DressingAddModal` DOIT proposer le mode d'ajout enchaîné pour permettre la saisie rapide successive de vêtements sans refermer la modale.
- **FR-006**: Le système DOIT adapter la largeur maximale du conteneur principal de l'application sur grand écran (passant de `max-w-4xl` à `max-w-7xl` avec espacement responsive adéquat).
- **FR-007**: Le système DOIT afficher une navigation responsive : barre de navigation intégrée dans le header sur grand écran (desktop navigation), et barre de navigation basse tactile (BottomNav) sur écran mobile.
- **FR-008**: La galerie du dressing (`DressingGallery`) DOIT afficher les vêtements sous forme d'une grille responsive adaptative (1 colonne sur mobile, 2 colonnes sur tablette/écrans moyens, 3 à 4 colonnes sur grands écrans).
- **FR-009**: La vue Inventaire (`RoomGroupView`, `CategoryGroupView`) et le Dashboard DOIVENT exploiter la grille multi-colonnes sur grand écran pour éviter l'étirement artificiel en une seule colonne étroite.
- **FR-010**: Les cartes d'articles et les boutons d'actions rapides (statut dormant, à revendre) DOIVENT rester lisibles et interactifs en mode grille responsive comme en mode liste.

### Key Entities

- **ClothingItem (Item)**: Objet d'inventaire dont la catégorie est `dressing_vetements`. Comprend les attributs enrichis : `dressing_status` (`active` | `dormant` | `to_sell_or_donate`), `clothing_type`, `size`, `brand`, `season`, `resale_price`, `photo_url`, `room_id`.
- **Room**: Pièce de rangement à laquelle le vêtement est rattaché (par exemple "Chambre", "Dressing").
- **DressingSummary**: Statistiques du dressing (total vêtements, pièces dormantes, pièces à revendre/donner, valeur estimée de revente).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sur la page Dressing, 100% des déclenchements d'ajout ouvrent la modale dédiée Dressing et non la modale générique de pièce.
- **SC-002**: L'enregistrement d'un vêtement avec ses informations clés (nom, type, taille, statut) s'effectue en moins de 10 secondes.
- **SC-003**: Sur un écran de largeur >= 1024px, le contenu exploite au moins 85% de la surface utile sans barre mobile flottante étroite au milieu de l'écran.
- **SC-004**: Sur un écran mobile (< 768px), l'ergonomie tactile et l'accès à la navigation basse restent 100% fonctionnels avec cibles tactiles >= 44px.
- **SC-005**: Aucune régression sur l'ajout d'objets ménagers génériques depuis l'onglet Inventaire.

## Assumptions

- Le backend accepte déjà les champs spécifiques du dressing (`dressing_status`, `resale_price`, `clothing_type`, `size`, `season`, `brand`) dans `fastAddItemSchema` et `updateItemSchema`.
- Les pièces existantes dans le foyer sont réutilisées pour positionner le vêtement (avec sélection d'une pièce par défaut comme Chambre ou Dressing).
- Tailwind CSS est utilisé pour l'ensemble des styles responsive avec les breakpoints standards (`sm:`, `md:`, `lg:`, `xl:`).
