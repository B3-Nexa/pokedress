---
description: "Task list for household inventory system strictly mapped to Acceptance Criteria (CA-0.1 to CA-6.9)"
---

# Tasks: 001-household-inventory-core

**Input**: Design documents from `/specs/001-universal-containment/` and Acceptance Criteria from `docs/criteres-acceptation.md`.

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/nodes-api.yaml`, `docs/criteres-acceptation.md`

**Tests**: Test-First TDD on duplicate detection, fast-add schema validation, chained add retention, and household scoping per Constitution Principle VI and Acceptance Criteria (CA-x.y 🤖).

**Organization**: Tasks are grouped into Setup, Foundational, User Stories (P1, P2, P3), and Polish, with explicit mappings to acceptance criteria `[CA-x.y]`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize monorepo workspace for Backend (Node/Express/TS) and Frontend (React/Vite/TS/Tailwind).

- [x] T001 Initialize backend TypeScript project with Express, Mongoose, Zod, Multer, Cors, and Dotenv in `backend/package.json` and `backend/tsconfig.json`
- [x] T002 Initialize frontend project with React, TypeScript, Vite, and Lucide React icons in `frontend/package.json` and `frontend/tsconfig.json`
- [x] T003 [P] Configure Tailwind CSS and PostCSS for responsive mobile-first UI (375px viewport, 44x44px touch targets) in `frontend/tailwind.config.js` and `frontend/src/index.css` `[CA-0.3]`
- [x] T004 [P] Setup environment configuration and MongoDB connection manager in `backend/src/config/database.ts` and `backend/.env.example`
- [x] T005 [P] Setup Vitest and Supertest testing harness in `backend/vitest.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer, schemas, household isolation, 5 default rooms, and anti-duplicate engine.

> **CRITICAL**: No UI or feature endpoints can begin until foundational schemas, household scoping, and the 100-item non-blocking cap are complete.

- [x] T006 [P] Create Mongoose Household Schema with 6-character unique invite code and plan type in `backend/src/models/household.model.ts` `[CA-5.1, CA-5.6]`
- [x] T007 [P] Create Mongoose Room and Container Schemas with seeder for 5 default rooms (Salon, Cuisine, Chambre, Salle de bain, Cave/Garage) in `backend/src/models/room.model.ts` and `backend/src/models/container.model.ts` `[CA-2.5]`
- [x] T008 [P] Create Mongoose Item Schema with category, dressing status (defaults to `active`), `resale_price`, warranty/receipt fields, and text search indexes in `backend/src/models/item.model.ts` `[CA-2.3, CA-4.2, CA-4.6]`
- [x] T009 [P] Define Zod validation schemas with explicit French messages for Fast-Add (name 2-100 chars, room, category) and Household join in `backend/src/schemas/item.schema.ts` and `backend/src/schemas/auth.schema.ts` `[CA-0.4, CA-1.2, CA-1.3]`
- [x] T010 Write failing unit tests for real-time duplicate similarity matching (accent and case-insensitive, >= 2 chars) in `backend/tests/unit/duplicate.service.test.ts` `[CA-3.1, CA-3.3, CA-3.5]`
- [x] T011 Implement `DuplicateService` in `backend/src/services/duplicate.service.ts` to pass T010 `[CA-3.1, CA-3.3]`
- [x] T012 Setup Express application, static `/uploads` route for raw item photos, auth middleware returning 401, household isolation returning 404 for cross-household IDs, and Zod error handling in `backend/src/app.ts` `[CA-0.1, CA-0.2, CA-0.4]`

**Checkpoint**: Foundation ready: database models, household scoping, 5 default rooms, and duplicate detection verified.

---

## Phase 3: User Story 1 - Frictionless Fast-Add (< 10s per item) & Chained Entry (Priority: P1) 🎯 MVP

**Goal**: Enable Léa to record an item in < 10 seconds (name + room + category; photo optional), with chained entry retaining room/category context (< 5s per subsequent item).

**Independent Test**: Fast-Add an item ("Grille-pain", "Cuisine", "Électroménager") in < 10s, click "Ajouter un autre objet", verify room and category remain selected, and add "Bouilloire" in < 5s `[CA-1.1, CA-1.4]`.

### Tests for User Story 1
- [x] T013 [P] [US1] Integration tests for Fast-Add item creation (< 100ms response), optional photo upload, photo upload failure resilience, 100-item ceiling (403 `UPGRADE_REQUIRED`), and concurrency safety at 99 items in `backend/tests/integration/fast-add.api.test.ts` `[CA-1.1, CA-1.2, CA-1.7, CA-6.5, CA-6.9]`

### Implementation for User Story 1
- [x] T014 [US1] Implement item creation service and controller with raw photo handling and atomic 100-item cap validation in `backend/src/services/item.service.ts` and `backend/src/controllers/item.controller.ts` `[CA-1.1, CA-1.6, CA-6.5, CA-6.9]`
- [x] T015 [US1] Mount item routes (`POST /api/items`) enforcing non-blocking 100-item ceiling on free households in `backend/src/routes/item.routes.ts` `[CA-6.5, CA-6.6]`
- [x] T016 [P] [US1] Create frontend API client and TypeScript interfaces in `frontend/src/api/items.api.ts` and `frontend/src/types/inventory.types.ts`
- [x] T017 [US1] Build client-side image compression utility (< 200KB thumbnail without forced background removal) in `frontend/src/utils/imageCompressor.ts` `[CA-1.6]`
- [x] T018 [US1] Build `ChainedAddContext` retaining `lastSelectedRoomId` and `lastSelectedCategory` across sequential submissions in `frontend/src/context/ChainedAddContext.tsx` `[CA-1.4, CA-1.5]`
- [x] T019 [US1] Build mobile-friendly FastAddModal component with Chained Add toggle, auto-focus on name, photo error notification, and 44x44px touch targets in `frontend/src/components/fast-add/FastAddModal.tsx` `[CA-0.3, CA-1.1, CA-1.4, CA-1.7]`
- [x] T020 [US1] Build responsive navigation bar with prominent central "+" button in `frontend/src/components/layout/BottomNav.tsx` and `frontend/src/components/layout/Navbar.tsx` `[CA-0.3]`

**Checkpoint**: Fast-Add and Chained Add flows are operational and validated under 10 seconds and 5 seconds `[CA-1.8]`.

---

## Phase 4: User Story 2 - Complete Household Overview by Room & Category (Priority: P1) 🎯 MVP

**Goal**: Provide a clean overview of everything the household owns, toggleable by Room (Salon, Cuisine, Dressing) or by Category.

**Independent Test**: Navigate to Overview page, view item cards grouped by room and by category with accurate sub-totals `[CA-2.1, CA-2.2]`.

### Tests for User Story 2
- [x] T021 [P] [US2] Integration tests for inventory overview queries (1 record = 1 item regardless of quantity, empty rooms with CTA, sub-totals match total) in `backend/tests/integration/overview.api.test.ts` `[CA-2.1, CA-2.2, CA-2.3, CA-2.5]`

### Implementation for User Story 2
- [x] T022 [US2] Implement room listing and category grouping services in `backend/src/services/room.service.ts` and `backend/src/controllers/room.controller.ts` `[CA-2.1, CA-2.2]`
- [x] T023 [P] [US2] Build ItemCard component (neutral category icon fallback if no photo, 100-character ellipsis truncation, "x 6" quantity display) in `frontend/src/components/inventory/ItemCard.tsx` `[CA-2.3, CA-2.4, CA-2.6]`
- [x] T024 [US2] Build RoomGroupView component (collapsible room sections showing "Salon (14 objets)") in `frontend/src/components/inventory/RoomGroupView.tsx` `[CA-2.1, CA-2.5]`
- [x] T025 [US2] Build CategoryGroupView component in `frontend/src/components/inventory/CategoryGroupView.tsx` `[CA-2.2]`
- [x] T026 [US2] Build central OverviewPage with "Par Pièce" and "Par Catégorie" tabs in `frontend/src/pages/OverviewPage.tsx` `[CA-2.1, CA-2.2]`

**Checkpoint**: Core MVP complete: household members can browse and verify everything they own in one place.

---

## Phase 5: User Story 3 - Proactive Anti-Duplicate Detection (Priority: P1)

**Goal**: Prevent duplicate purchases by displaying real-time duplicate alerts during item entry and search.

**Independent Test**: Type "Rallonge" in Fast-Add; display warning showing existing extension cords and their locations `[CA-3.1]`.

### Tests for User Story 3
- [x] T027 [P] [US3] API integration tests for duplicate check endpoint (300ms debounce, accent/case insensitivity, >= 2 chars, room search match, store search < 200ms) in `backend/tests/integration/duplicate.api.test.ts` `[CA-3.1, CA-3.3, CA-3.5, CA-3.6, CA-3.7]`

### Implementation for User Story 3
- [x] T028 [US3] Implement `GET /api/items/check-duplicates` and search filter matching item names and room names in `backend/src/controllers/item.controller.ts` `[CA-3.1, CA-3.7]`
- [x] T029 [US3] Build debounced duplicate detection hook (`useDuplicateCheck`) with 300ms timer in `frontend/src/hooks/useDuplicateCheck.ts` `[CA-3.1, CA-3.5]`
- [x] T030 [US3] Build DuplicateWarning banner component (shows count + top 2 with room + "Voir tout" link, non-blocking on save) in `frontend/src/components/fast-add/DuplicateWarning.tsx` `[CA-3.1, CA-3.2, CA-3.4]`
- [x] T031 [US3] Embed DuplicateWarning seamlessly into `FastAddModal.tsx` and build global search bar with empty result message « Vous ne possédez rien qui ressemble à "..." » in `frontend/src/components/search/SearchBar.tsx` `[CA-3.2, CA-3.8]`

**Checkpoint**: Fin des achats en double: users are warned before buying or saving duplicates.

---

## Phase 6: User Story 4 - Dressing Category & Wardrobe Lifecycle (Priority: P2)

**Goal**: Expose under-exploited wardrobe items and provide 1-click status transitions (`active`, `dormant`, `to_sell_or_donate`).

**Independent Test**: Filter dressing category by "Dormant / Jamais porté", select an item, update status to "À donner ou revendre" in 1 click `[CA-4.4, CA-4.5]`.

### Tests for User Story 4
- [x] T032 [P] [US4] Integration tests for dressing (default `active` status, dressing fields restricted to clothing, 1-click status toggle, `resale_price` sum) in `backend/tests/integration/dressing.api.test.ts` `[CA-4.1, CA-4.2, CA-4.3, CA-4.4, CA-4.5, CA-4.6]`

### Implementation for User Story 4
- [x] T033 [US4] Implement dressing status update endpoint (`PATCH /api/items/:id`) in `backend/src/controllers/item.controller.ts` `[CA-4.3, CA-4.5]`
- [x] T034 [P] [US4] Build DressingGallery component with status filter pills (Actif, Dormant, À donner ou revendre) in `frontend/src/components/dressing/DressingGallery.tsx` `[CA-4.4]`
- [x] T035 [US4] Build DeclutterModal component with optional `resale_price` input and total resale value sum in `frontend/src/components/dressing/DeclutterModal.tsx` `[CA-4.5, CA-4.6]`
- [x] T036 [US4] Build dedicated DressingPage view in `frontend/src/pages/DressingPage.tsx` `[CA-4.4]`

**Checkpoint**: Dressing category is active and actionable: users can declutter and identify forgotten clothes.

---

## Phase 7: User Story 5 - Shared Household Collaboration ("Le Foyer") (Priority: P2)

**Goal**: Allow household members (Léa, Marc, roommates) to join the same household via a 6-character code and collaborate on the same inventory (free for up to 2 members).

**Independent Test**: Register User A (generates invite code), User B joins with invite code, both see shared items `[CA-5.1, CA-5.3]`.

### Tests for User Story 5
- [x] T037 [P] [US5] Integration tests for household creation, 6-character code, case/space tolerance, 2-member free limit (reject 3rd with friendly message), and real-time cross-member inventory sync in `backend/tests/integration/household.api.test.ts` `[CA-5.1, CA-5.3, CA-5.4, CA-5.5, CA-5.6, CA-5.7]`

### Implementation for User Story 5
- [x] T038 [US5] Implement household registration, tolerant invite code lookup, and max-2-members enforcement in `backend/src/services/household.service.ts` and `backend/src/controllers/household.controller.ts` `[CA-5.1, CA-5.4, CA-5.5, CA-5.6]`
- [x] T039 [US5] Build SettingsPage with household invite code card, 1-click copy button, and member list in `frontend/src/pages/SettingsPage.tsx` `[CA-5.2]`

**Checkpoint**: Shared household collaboration active for couples, roommates, and families `[CA-5.8]`.

---

## Phase 8: User Story 6 - Household Dashboard, Factures & 100-Item Cap (Priority: P3)

**Goal**: Display total cataloged items (North Star Metric), item count per room, "compléter plus tard" warranty/receipt tracking (Marc), pre-warning banner at 90 items, and non-blocking 100-item ceiling.

**Independent Test**: Open Dashboard, view total item count card, item count per room (no progress bars), warranty alerts, and verify search/browse remain unrestricted above 100 items `[CA-6.1, CA-6.2, CA-6.6]`.

### Tests for User Story 6
- [x] T040 [P] [US6] Integration tests for dashboard aggregation metrics, « valeur estimée sur X objets sur Y » calculation, 90-item pre-warning banner, and non-blocking read access above 100 items in `backend/tests/integration/dashboard.api.test.ts` `[CA-6.1, CA-6.2, CA-6.4, CA-6.6, CA-6.7, CA-6.8]`

### Implementation for User Story 6
- [x] T041 [US6] Implement `GET /api/dashboard` computing total items (1 record = 1 item), item count per room, insurance sum and priced item count in `backend/src/services/dashboard.service.ts` `[CA-2.3, CA-6.1, CA-6.2, CA-6.4]`
- [x] T042 [US6] Build NorthStarCard component displaying prominent total items « X objets inventoriés » in `frontend/src/components/dashboard/NorthStarCard.tsx` `[CA-6.1]`
- [x] T043 [US6] Build ItemEnrichmentModal (attach receipt photo, purchase date, warranty expiration) in `frontend/src/components/inventory/ItemEnrichmentModal.tsx` `[CA-6.3]`
- [x] T044 [US6] Build InsuranceSummary (« valeur estimée sur X objets sur Y ») and RoomCountList (item counts without percentages or progress bars) in `frontend/src/components/dashboard/InsuranceSummary.tsx` and `frontend/src/components/dashboard/RoomCountList.tsx` `[CA-6.2, CA-6.4]`
- [x] T045 [US6] Build DashboardPage with discrete 90-item pre-warning banner (« Plus que X objets en version gratuite ») in `frontend/src/pages/DashboardPage.tsx` `[CA-6.7]`

**Checkpoint**: Executive household dashboard tracking item counts, warranties, and insurance value.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Tooling, quickstart validation, and documentation.

- [x] T046 [P] Create `docker-compose.yml` for local MongoDB and Mongo Express
- [x] T047 Execute and verify all validation scenarios in `specs/001-universal-containment/quickstart.md` against criteria `[CA-0.1 to CA-6.9]`
- [x] T048 Add project root `README.md` with startup instructions, architecture diagrams, and quickstart commands

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup (Phase 1)**: No dependencies — starts immediately.
2. **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**.
3. **User Story 1 (Phase 3 - P1)**: Depends on Phase 2. Delivers Fast-Add & Chained Add (< 10s / < 5s).
4. **User Story 2 (Phase 4 - P1)**: Depends on Phase 3. Delivers Room & Category Overview.
5. **User Story 3 (Phase 5 - P1)**: Depends on Phase 3. Delivers Anti-Duplicate detection.
6. **User Story 4 (Phase 6 - P2)**: Depends on Phase 4. Delivers Dressing lifecycle.
7. **User Story 5 (Phase 7 - P2)**: Depends on Phase 2. Delivers Household sharing.
8. **User Story 6 (Phase 8 - P3)**: Depends on Phases 3, 4, 6. Delivers Dashboard, Warranties, & 100-Item Cap.
9. **Polish (Phase 9)**: Depends on all user stories.
