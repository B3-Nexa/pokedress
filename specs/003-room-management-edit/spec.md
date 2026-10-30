# Feature Specification: Room Management & Editing

**Feature Branch**: `003-room-management-edit`

**Created**: 2026-10-30

**Status**: Ready for Planning

**Input**: User description: "l'endroit ou on rentre des pièce, actuellement nous ne pouvons qu'enregistrer des pièce, on ne peut pas les editer .... corrige, tj en utilisant spec-kit"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Modification et renommage d'une pièce existante (Priority: P1) 🎯 MVP

En tant qu'utilisateur du foyer (PokeDress), lorsque je me rends dans la section de gestion des pièces (Paramètres / Foyer), je souhaite pouvoir modifier le nom d'une pièce existante (par exemple renommer « Salon » en « Séjour & Salle à manger » ou corriger une faute de frappe) et enregistrer les modifications directement.

**Why this priority**: Actuellement, l'application ne propose qu'un champ de création. Une fois la pièce créée, l'utilisateur est bloqué avec un nom figé, ce qui nuit à l'organisation du foyer.

**Independent Test**:
1. Accéder à l'onglet « Foyer » (Paramètres).
2. Repérer la liste des pièces du foyer.
3. Cliquer sur l'action d'édition (icône crayon ou bouton « Modifier ») d'une pièce.
4. Modifier le nom (ex: « Chambre » -> « Suite parentale ») et confirmer.
5. Constater que la pièce est immédiatement renommée dans la liste, dans l'onglet Inventaire et dans les sélecteurs de pièces des modales d'ajout.

**Acceptance Scenarios**:

1. **Given** l'utilisateur est sur la page de gestion des pièces, **When** il clique sur l'icône d'édition d'une pièce, **Then** un champ d'édition inline ou une modale s'affiche avec le nom actuel pré-rempli.
2. **Given** l'utilisateur saisit un nouveau nom valide (>= 1 caractère non vide), **When** il confirme la modification, **Then** la pièce est mise à jour sur le serveur (`PATCH /api/rooms/:id`) et l'affichage est actualisé instantanément.
3. **Given** une pièce contenant des objets existants, **When** la pièce est renommée, **Then** tous les objets continuent d'être associés à cette pièce et affichent son nouveau nom dans l'Inventaire et le Dressing.
4. **Given** l'utilisateur saisit un nom vide ou uniquement composé d'espaces, **When** il tente de valider, **Then** un message d'erreur indique que le nom est obligatoire et la modification n'est pas envoyée.

---

### User Story 2 - Suppression sécurisée d'une pièce vide (Priority: P2)

En tant qu'utilisateur, si j'ai créé une pièce par erreur ou si elle n'est plus utilisée et qu'elle ne contient aucun objet, je souhaite pouvoir la supprimer pour garder un inventaire propre.

**Why this priority**: Complète le cycle de vie de gestion des pièces. Si une pièce a été créée en double ou par erreur, l'utilisateur doit pouvoir la retirer sans risquer de supprimer des objets par mégarde.

**Independent Test**:
1. Créer une pièce de test vide (ex: « Pièce temporaire »).
2. Cliquer sur le bouton de suppression (icône corbeille).
3. Confirmer la suppression : la pièce disparaît de la liste et de l'inventaire.
4. Tenter de supprimer une pièce contenant des objets : le bouton prévient l'utilisateur ou la suppression est bloquée avec une explication claire.

**Acceptance Scenarios**:

1. **Given** une pièce avec 0 objet, **When** l'utilisateur clique sur « Supprimer » et confirme, **Then** la pièce est supprimée de la base (`DELETE /api/rooms/:id`) et retirée de l'interface.
2. **Given** une pièce contenant un ou plusieurs objets (`item_count > 0`), **When** l'utilisateur consulte la pièce, **Then** le système protège les objets : un message indique que la pièce contient des objets et qu'ils doivent d'abord être déplacés ou supprimés.

---

### User Story 3 - Endpoints API Room sécurisés (Priority: P3)

En tant que système backend, je dois fournir les routes RESTful sécurisées pour mettre à jour et supprimer des pièces, avec vérification stricte de l'appartenance au foyer (`household_id`).

**Why this priority**: Garantit l'intégrité des données, la sécurité multi-tenancy et la robustesse de l'API.

**Independent Test**:
1. Envoyer une requête `PATCH /api/rooms/:id` avec un token valide : la pièce est mise à jour si elle appartient au foyer.
2. Envoyer une requête `PATCH /api/rooms/:id` pour une pièce appartenant à un autre foyer : l'API renvoie `404 Not Found` ou `403 Forbidden`.
3. Envoyer une requête `DELETE /api/rooms/:id` sur une pièce avec des objets : l'API renvoie `400 Bad Request` avec message explicite.

---

### Edge Cases

- **Tentative de nom vide** : Validation côté client et côté serveur rejetant les chaînes vides ou d'espaces blancs.
- **Pièce inexistante ou d'un autre foyer** : L'API répond par un code d'erreur HTTP 404/403 et le frontend affiche une notification d'erreur élégante.
- **Concurrence multi-utilisateurs** : Si un membre du foyer renomme une pièce pendant qu'un autre ajoute un objet, l'objet reste bien lié à l'ID technique invariable de la pièce.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le backend DOIT exposer une route `PATCH /api/rooms/:id` permettant de modifier le nom (et optionnellement l'icône) d'une pièce du foyer connecté.
- **FR-002**: Le backend DOIT valider que le nom de la pièce n'est pas vide (trim) et qu'il appartient bien au `household_id` de l'utilisateur authentifié.
- **FR-003**: Le backend DOIT exposer une route `DELETE /api/rooms/:id` permettant de supprimer une pièce, en interdisant la suppression si la pièce contient au moins un objet (`item_count > 0`).
- **FR-004**: Le client API frontend (`items.api.ts`) DOIT implémenter les méthodes `updateRoom(id, { name, icon })` et `deleteRoom(id)`.
- **FR-005**: La page des paramètres du foyer (`SettingsPage.tsx`) DOIT afficher chaque pièce sous forme d'une carte/ligne interactive avec le nombre d'objets, un bouton d'édition (crayon) et un bouton de suppression (corbeille).
- **FR-006**: L'interface de modification DOIT permettre la modification inline ou modale avec sauvegarde immédiate et annulation (touche Echap ou bouton Annuler).
- **FR-007**: Lors de la modification réussie d'une pièce, toutes les données de l'application (inventaire, compteurs, sélecteurs) DOIVENT être rafraîchies via `onHouseholdUpdated`.

### Key Entities

- **Room**: `{ id: string, household_id: string, name: string, icon: string, order: number, item_count: number }`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% des pièces peuvent être renommées en moins de 3 clics ou 5 secondes depuis la page Foyer / Paramètres.
- **SC-002**: Aucune perte de liaison entre les objets existants et la pièce renommée (0 objet orphelin).
- **SC-003**: 100% des tentatives de suppression de pièces contenant des objets sont bloquées de manière sécurisée sans perte de données.
- **SC-004**: Les tests automatisés backend et frontend passent avec succès.

## Assumptions

- Les pièces appartiennent à un foyer (`household_id`).
- Le renommage n'affecte pas l'ID technique MongoDB `_id`, donc tous les objets liés conservent leur intégrité référentielle.
