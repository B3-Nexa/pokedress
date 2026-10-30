# Tasks: Room Management & Editing

**Input**: Design documents from `/specs/003-room-management-edit/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story?] Description`
- **[P]**: Parallelizable (different files, no dependencies)
- **[Story]**: Mapped user story (`[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup

**Purpose**: Verification of room management files and dependencies

- [X] T001 Verify room controller, routes, and API client structure

---

## Phase 2: Foundational

**Purpose**: Shared client API methods for rooms

- [X] T002 Implement `updateRoom` and `deleteRoom` in `frontend/src/api/items.api.ts`

**Checkpoint**: Foundation ready - Backend endpoints and UI can proceed

---

## Phase 3: User Story 3 - API Backend sécurisée pour les pièces (Priority: P3)

**Goal**: Fournir les endpoints `PATCH /api/rooms/:id` et `DELETE /api/rooms/:id` sécurisés par foyer avec tests automatisés.

- [X] T003 [P] [US3] Add integration tests for updating and deleting rooms in `backend/tests/integration/room.api.test.ts`
- [X] T004 [US3] Implement `updateRoom` and `deleteRoom` methods in `backend/src/controllers/room.controller.ts`
- [X] T005 [US3] Register `PATCH /:id` and `DELETE /:id` routes in `backend/src/routes/room.routes.ts`

**Checkpoint**: Backend API complete and tested

---

## Phase 4: User Story 1 - Modification et renommage d'une pièce (Priority: P1) 🎯 MVP

**Goal**: Permettre aux utilisateurs de renommer n'importe quelle pièce du foyer directement depuis les paramètres.

- [X] T006 [US1] Implement interactive room cards with inline edit form in `frontend/src/pages/SettingsPage.tsx`

**Checkpoint**: User Story 1 complete and independently testable (MVP)

---

## Phase 5: User Story 2 - Suppression sécurisée d'une pièce vide (Priority: P2)

**Goal**: Permettre de supprimer une pièce vide tout en protégeant les pièces contenant des objets.

- [X] T007 [US2] Implement safe deletion with protection banner for rooms with items in `frontend/src/pages/SettingsPage.tsx`

**Checkpoint**: User Story 2 complete

---

## Phase 6: Polish & Verification

**Purpose**: Validation technique et tests sans régression

- [X] T008 Run backend test suite (`npm --prefix backend test`)
- [X] T009 Run frontend build verification (`npm --prefix frontend run build`)
- [X] T010 Validate complete workflow against `specs/003-room-management-edit/quickstart.md`

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: Pas de dépendance.
- **Phase 2 (Foundational)**: Dépend de Phase 1.
- **Phase 3 (US3 Backend API)**: Dépend de Phase 2.
- **Phase 4 (US1 Rename UI)**: Dépend de Phase 2 et Phase 3.
- **Phase 5 (US2 Delete UI)**: Dépend de Phase 3 et Phase 4.
- **Phase 6 (Polish)**: Dépend de toutes les phases.
