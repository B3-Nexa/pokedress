---
description: "Task list for household inventory system aligned with Product Vision"
---

# Tasks: 001-household-inventory-core

**Input**: Design documents from `/specs/001-universal-containment/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/nodes-api.yaml`, `quickstart.md`, `vision-produit-inventaire.md`)

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/nodes-api.yaml`

**Tests**: Test-First TDD on duplicate detection, fast-add schema validation, and household scoping per Constitution Principle V.

**Organization**: Tasks are grouped into Setup, Foundational, User Stories (P1, P2, P3), and Polish.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize monorepo workspace for Backend (Node/Express/TS) and Frontend (React/Vite/TS/Tailwind).

- [ ] T001 Initialize backend TypeScript project with Express, Mongoose, Zod, Multer, Cors, and Dotenv in `backend/package.json` and `backend/tsconfig.json`
- [ ] T002 Initialize frontend project with React, TypeScript, Vite, and Lucide React icons in `frontend/package.json` and `frontend/tsconfig.json`
- [ ] T003 [P] Configure Tailwind CSS and PostCSS for responsive mobile-first UI in `frontend/tailwind.config.js` and `frontend/src/index.css`
- [ ] T004 [P] Setup environment configuration and MongoDB connection manager in `backend/src/config/database.ts` and `backend/.env.example`
- [ ] T005 [P] Setup Vitest and Supertest testing harness in `backend/vitest.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer, schemas, household isolation, and anti-duplicate engine.

> **CRITICAL**: No UI or feature endpoints can begin until foundational schemas and household scoping are complete.

- [ ] T006 [P] Create Mongoose Household Schema with 6-character unique invite code in `backend/src/models/household.model.ts`
- [ ] T007 [P] Create Mongoose Room and Container Schemas with default room seeder (Salon, Cuisine, Chambre, Dressing, Cave) in `backend/src/models/room.model.ts` and `backend/src/models/container.model.ts`
- [ ] T008 [P] Create Mongoose Item Schema with category, dressing status, and text search indexes in `backend/src/models/item.model.ts`
- [ ] T009 [P] Define Zod validation schemas for Fast-Add and Household join in `backend/src/schemas/item.schema.ts` and `backend/src/schemas/auth.schema.ts`
- [ ] T010 Write failing unit tests for real-time duplicate similarity matching in `backend/tests/unit/duplicate.service.test.ts`
- [ ] T011 Implement `DuplicateService` in `backend/src/services/duplicate.service.ts` to pass T010 (case-insensitive & accent-insensitive text search)
- [ ] T012 Setup Express application, static `/uploads` route for item photos, and error handling middleware in `backend/src/app.ts`

**Checkpoint**: Foundation ready: database models, household scoping, and duplicate detection verified.

---

## Phase 3: User Story 1 - Frictionless Fast-Add (< 10s per item) (Priority: P1) 🎯 MVP

**Goal**: Enable Léa to record an item in < 10 seconds (photo + name + room + category), with optional fields remaining non-blocking.

**Independent Test**: Fast-Add an item ("Grille-pain", "Cuisine", "Électroménager") with a photo in a single lightweight form submitted in < 100ms.

### Tests for User Story 1
- [ ] T013 [P] [US1] Integration tests for Fast-Add item creation and Multer photo upload in `backend/tests/integration/fast-add.api.test.ts`

### Implementation for User Story 1
- [ ] T014 [US1] Implement item creation service and controller with photo handling in `backend/src/services/item.service.ts` and `backend/src/controllers/item.controller.ts`
- [ ] T015 [US1] Mount item routes (`POST /api/items`) in `backend/src/routes/item.routes.ts`
- [ ] T016 [P] [US1] Create frontend API client and TypeScript interfaces in `frontend/src/api/items.api.ts` and `frontend/src/types/inventory.types.ts`
- [ ] T017 [US1] Build client-side image compression utility (< 200KB thumbnail) in `frontend/src/utils/imageCompressor.ts`
- [ ] T018 [US1] Build mobile-friendly FastAddModal component (< 10s input flow) in `frontend/src/components/fast-add/FastAddModal.tsx`
- [ ] T019 [US1] Build responsive navigation bar with prominent central "+" button in `frontend/src/components/layout/BottomNav.tsx` and `frontend/src/components/layout/Navbar.tsx`

**Checkpoint**: Fast-Add flow is operational and validated under 10 seconds.

---

## Phase 4: User Story 2 - Complete Household Overview by Room & Category (Priority: P1) 🎯 MVP

**Goal**: Provide a clean overview of everything the household owns, toggleable by Room (Salon, Cuisine, Dressing) or by Category.

**Independent Test**: Navigate to Overview page, view item cards grouped by room and by category with accurate sub-totals.

### Tests for User Story 2
- [ ] T020 [P] [US2] Integration tests for inventory overview queries in `backend/tests/integration/overview.api.test.ts`

### Implementation for User Story 2
- [ ] T021 [US2] Implement room listing and category grouping services in `backend/src/services/room.service.ts` and `backend/src/controllers/room.controller.ts`
- [ ] T022 [P] [US2] Build ItemCard component (photo, name, room badge, category icon) in `frontend/src/components/inventory/ItemCard.tsx`
- [ ] T023 [US2] Build RoomGroupView component (collapsible room sections) in `frontend/src/components/inventory/RoomGroupView.tsx`
- [ ] T024 [US2] Build CategoryGroupView component in `frontend/src/components/inventory/CategoryGroupView.tsx`
- [ ] T025 [US2] Build central OverviewPage with "Par Pièce" and "Par Catégorie" tabs in `frontend/src/pages/OverviewPage.tsx`

**Checkpoint**: Core MVP complete: Léa and Marc can browse and verify everything they own in one place.

---

## Phase 5: User Story 3 - Proactive Anti-Duplicate Detection (Priority: P1)

**Goal**: Prevent duplicate purchases by displaying real-time duplicate alerts during item entry and search.

**Independent Test**: Type "Rallonge" in Fast-Add; display warning showing existing extension cords and their locations.

### Tests for User Story 3
- [ ] T026 [P] [US3] API integration tests for duplicate check endpoint in `backend/tests/integration/duplicate.api.test.ts`

### Implementation for User Story 3
- [ ] T027 [US3] Implement `GET /api/items/check-duplicates` in `backend/src/controllers/item.controller.ts`
- [ ] T028 [US3] Build debounced duplicate detection hook (`useDuplicateCheck`) in `frontend/src/hooks/useDuplicateCheck.ts`
- [ ] T029 [US3] Build DuplicateWarning banner component in `frontend/src/components/fast-add/DuplicateWarning.tsx`
- [ ] T030 [US3] Embed DuplicateWarning seamlessly into `FastAddModal.tsx` and global search bar

**Checkpoint**: Fin des achats en double: users are warned before buying or saving duplicates.

---

## Phase 6: User Story 4 - Actionable Dressing & Clothes Lifecycle (Priority: P2)

**Goal**: Expose under-exploited wardrobe items and provide 1-click status transitions (`active`, `dormant`, `to_sell_or_donate`).

**Independent Test**: Filter dressing by "Dormant / Jamais porté", select an item, update status to "À donner ou revendre".

### Tests for User Story 4
- [ ] T031 [P] [US4] Integration tests for dressing filters and status toggles in `backend/tests/integration/dressing.api.test.ts`

### Implementation for User Story 4
- [ ] T032 [US4] Implement dressing status update endpoint (`PATCH /api/items/:id`) in `backend/src/controllers/item.controller.ts`
- [ ] T033 [P] [US4] Build DressingGallery component with status filter pills in `frontend/src/components/dressing/DressingGallery.tsx`
- [ ] T034 [US4] Build DeclutterModal component (estimated resale price & flag for Vinted) in `frontend/src/components/dressing/DeclutterModal.tsx`
- [ ] T035 [US4] Build dedicated DressingPage in `frontend/src/pages/DressingPage.tsx`

**Checkpoint**: Dressing is active and actionable: users can declutter and identify forgotten clothes.

---

## Phase 7: User Story 5 - Shared Household Collaboration ("Chez Nous") (Priority: P2)

**Goal**: Allow Léa and her partner to join the same household via a 6-character code and collaborate on the same inventory.

**Independent Test**: Register User A (generates invite code), User B joins with invite code, both see shared items.

### Tests for User Story 5
- [ ] T036 [P] [US5] Integration tests for household creation and member joining in `backend/tests/integration/household.api.test.ts`

### Implementation for User Story 5
- [ ] T037 [US5] Implement household registration and invite code lookup in `backend/src/services/household.service.ts` and `backend/src/controllers/household.controller.ts`
- [ ] T038 [US5] Build SettingsPage with household invite code card, copy button, and member list in `frontend/src/pages/SettingsPage.tsx`

**Checkpoint**: Shared household collaboration active for couples and roommates.

---

## Phase 8: User Story 6 - Household Dashboard & Insurance Value (Priority: P3)

**Goal**: Display total cataloged items (North Star Metric), room progress, and optional total value calculation for insurance.

**Independent Test**: Open Dashboard, view total item count card, progress bars, and total value sum.

### Tests for User Story 6
- [ ] T039 [P] [US6] Integration tests for dashboard aggregation metrics in `backend/tests/integration/dashboard.api.test.ts`

### Implementation for User Story 6
- [ ] T040 [US6] Implement `GET /api/dashboard` computing total items, insurance sum, and dressing stats in `backend/src/services/dashboard.service.ts`
- [ ] T041 [US6] Build NorthStarCard component displaying total items in `frontend/src/components/dashboard/NorthStarCard.tsx`
- [ ] T042 [US6] Build InsuranceSummary and RoomProgressBar components in `frontend/src/components/dashboard/InsuranceSummary.tsx` and `frontend/src/components/dashboard/RoomProgressBar.tsx`
- [ ] T043 [US6] Build DashboardPage in `frontend/src/pages/DashboardPage.tsx`

**Checkpoint**: Executive household dashboard tracking progress and insurance value.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Tooling, quickstart validation, and documentation.

- [ ] T044 [P] Create `docker-compose.yml` for local MongoDB and Mongo Express
- [ ] T045 Execute and verify all validation scenarios in `specs/001-universal-containment/quickstart.md`
- [ ] T046 Add project root `README.md` with startup instructions, architecture diagrams, and quickstart commands

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup (Phase 1)**: No dependencies — starts immediately.
2. **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**.
3. **User Story 1 (Phase 3 - P1)**: Depends on Phase 2. Delivers Fast-Add (< 10s).
4. **User Story 2 (Phase 4 - P1)**: Depends on Phase 3. Delivers Room & Category Overview.
5. **User Story 3 (Phase 5 - P1)**: Depends on Phase 3. Delivers Anti-Duplicate detection.
6. **User Story 4 (Phase 6 - P2)**: Depends on Phase 4. Delivers Dressing lifecycle.
7. **User Story 5 (Phase 7 - P2)**: Depends on Phase 2. Delivers Household sharing.
8. **User Story 6 (Phase 8 - P3)**: Depends on Phases 3, 4, 6. Delivers Dashboard & Insurance.
9. **Polish (Phase 9)**: Depends on all user stories.
