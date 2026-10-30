# Tasks: Dressing Dedicated Modal & Responsive Layout

**Input**: Design documents from `/specs/002-dressing-modal-responsive/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story?] Description`
- **[P]**: Parallelizable (different files, no dependencies)
- **[Story]**: Mapped user story (`[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup

**Purpose**: Verification of frontend environment and dependencies

- [X] T001 Verify frontend environment and dependencies in `frontend/package.json`

---

## Phase 2: Foundational

**Purpose**: Core types and shared constants for dressing enrichments

- [X] T002 Enhance clothing option constants (types, sizes, seasons) in `frontend/src/types/inventory.types.ts`

**Checkpoint**: Foundation ready - User Story 1 implementation can begin

---

## Phase 3: User Story 1 - Modale d'ajout dédiée et enrichie pour le Dressing (Priority: P1) 🎯 MVP

**Goal**: Fournir une modale d'ajout spécifique et optimisée pour les vêtements dans le Dressing, avec pré-sélection de catégorie et champs de garde-robe spécifiques.
**Independent Test**: Ouvrir l'onglet Dressing, cliquer sur « Ajouter un vêtement », vérifier que la modale spécifique s'ouvre, renseigner les champs (nom, taille, type, statut, etc.) et créer le vêtement avec succès.

- [X] T003 [P] [US1] Create dedicated `DressingAddModal.tsx` component in `frontend/src/components/dressing/DressingAddModal.tsx`
- [X] T004 [US1] Wire `isDressingAddOpen` state and handler in `frontend/src/App.tsx`
- [X] T005 [US1] Connect `onOpenDressingAdd` callback to action buttons in `frontend/src/components/dressing/DressingGallery.tsx`
- [X] T006 [US1] Test and validate fast clothing creation and chained entry in `frontend/src/components/dressing/DressingAddModal.tsx`

**Checkpoint**: User Story 1 complete and independently testable (MVP)

---

## Phase 4: User Story 2 - Expérience Responsive Desktop Plein Écran (Priority: P2)

**Goal**: Exploiter la largeur d'écran sur desktop (PC/Mac/tablette) avec une top bar de navigation intégrée, un conteneur large `max-w-7xl` et des grilles multi-colonnes.
**Independent Test**: Ouvrir l'application sur grand écran (> 1024px), vérifier que la `BottomNav` mobile est masquée au profit de la `Navbar` desktop, que la galerie dressing est en grille 3-4 colonnes et que le conteneur n'est plus bridé à un format téléphone.

- [X] T007 [P] [US2] Update main content wrapper to `max-w-7xl` with responsive padding in `frontend/src/App.tsx`
- [X] T008 [P] [US2] Add desktop navigation tabs and desktop quick-add action to `frontend/src/components/layout/Navbar.tsx`
- [X] T009 [P] [US2] Hide floating bottom bar on desktop screens (`md:hidden`) in `frontend/src/components/layout/BottomNav.tsx`
- [X] T010 [P] [US2] Transform clothing list into responsive multi-column grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`) in `frontend/src/components/dressing/DressingGallery.tsx`
- [X] T011 [P] [US2] Adapt room inventory and dashboard layouts to multi-column responsive grids in `frontend/src/components/inventory/RoomGroupView.tsx` and `frontend/src/pages/DashboardPage.tsx`

**Checkpoint**: User Stories 1 and 2 complete and responsive

---

## Phase 5: User Story 3 - Ergonomie des Modales et Cartes Responsive (Priority: P3)

**Goal**: Garantir une présentation visuelle élégante, équilibrée et fluide des cartes et des modales sur toutes les tailles d'écran.
**Independent Test**: Tester l'ouverture des modales et l'interaction avec les cartes d'articles sur mobile et desktop.

- [X] T012 [P] [US3] Adapt `ItemCard.tsx` styles for optimal rendering in both grid and list views with responsive action buttons in `frontend/src/components/inventory/ItemCard.tsx`
- [X] T013 [P] [US3] Verify and polish responsive dialog sizing and scrolling in `frontend/src/components/fast-add/FastAddModal.tsx` and `frontend/src/components/dressing/DressingAddModal.tsx`

---

## Phase 6: Polish & Verification

**Purpose**: Validation technique et tests sans régression

- [X] T014 Run TypeScript compiler check (`npm run build` or `npx tsc --noEmit`) in `frontend/`
- [X] T015 Validate complete workflow against `specs/002-dressing-modal-responsive/quickstart.md`

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: Pas de dépendance.
- **Phase 2 (Foundational)**: Dépend de Phase 1.
- **Phase 3 (US1)**: Dépend de Phase 2. Réalise le MVP fonctionnel (Modale dressing).
- **Phase 4 (US2)**: Dépend de Phase 2. Réalise la refonte responsive desktop.
- **Phase 5 (US3)**: Dépend de US1 et US2 pour affiner l'affichage des cartes et modales.
- **Phase 6 (Polish)**: Dépend de toutes les phases.
