# Tasks: Fake Payment & Subscription Upgrade

**Input**: Design documents from `/specs/004-fake-payment-subscription/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story?] Description`
- **[P]**: Parallelizable (different files, no dependencies)
- **[Story]**: Mapped user story (`[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup

**Purpose**: Verification and typing for subscription models

- [X] T001 Verify and update subscription types in `frontend/src/types/inventory.types.ts`

---

## Phase 2: Foundational

**Purpose**: Client API integration for household subscription

- [X] T002 Implement `updateSubscription` method in `frontend/src/api/items.api.ts`

**Checkpoint**: Foundation ready - Backend API and UI implementation can proceed

---

## Phase 3: User Story 3 - API Backend de gestion d'abonnement (Priority: P3)

**Goal**: Exposer et tester l'endpoint `POST /api/household/subscription` permettant de basculer le plan du foyer entre `free` et `premium`.

- [X] T003 [P] [US3] Add integration tests for subscription upgrade and downgrade in `backend/tests/integration/subscription.api.test.ts`
- [X] T004 [US3] Implement `updateSubscription` logic in `backend/src/services/household.service.ts` and `backend/src/controllers/auth.controller.ts`
- [X] T005 [US3] Register `POST /subscription` route in `backend/src/routes/household.routes.ts`

**Checkpoint**: Backend API complete and tested

---

## Phase 4: User Story 1 & 2 - Interface de sélection d'offre et simulateur de paiement (Priority: P1 & P2) 🎯 MVP

**Goal**: Fournir la modale de comparaison des plans et le simulateur de paiement par carte bancaire factice (Fake Checkout).

- [X] T006 [P] [US1] Create `SubscriptionModal.tsx` component with plans comparison, monthly/yearly billing toggle, and fake card checkout in `frontend/src/components/subscription/SubscriptionModal.tsx`
- [X] T007 [US1] Add Premium badge and trigger button in `frontend/src/components/layout/Navbar.tsx`
- [X] T008 [US1] Add upgrade CTA in `frontend/src/pages/DashboardPage.tsx` and `frontend/src/pages/SettingsPage.tsx`
- [X] T009 [US2] Wire `isSubscriptionOpen` state and callbacks in `frontend/src/App.tsx`

**Checkpoint**: User Stories 1 and 2 complete and responsive

---

## Phase 5: Polish & Verification

**Purpose**: Validation technique et tests sans régression

- [X] T010 Run backend test suite (`npm --prefix backend test`)
- [X] T011 Run frontend build verification (`npm --prefix frontend run build`)
- [X] T012 Validate complete subscription and payment workflow against `specs/004-fake-payment-subscription/quickstart.md`

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: Pas de dépendance.
- **Phase 2 (Foundational)**: Dépend de Phase 1.
- **Phase 3 (US3 Backend API)**: Dépend de Phase 2.
- **Phase 4 (US1 & US2 UI & Checkout)**: Dépend de Phase 2 et Phase 3.
- **Phase 5 (Polish)**: Dépend de toutes les phases.
