# Tasks: Textes Juridiques (CGV, CGU, Mentions Légales, RGPD) et Footer Intégré

**Input**: Design documents from `/specs/005-legal-cgv-cgu/`
**Prerequisites**: plan.md, spec.md

## Format: `[ID] [P?] [Story?] Description`
- **[P]**: Parallelizable (different files, no dependencies)
- **[Story]**: Mapped user story (`[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup & Content Data

**Purpose**: Rédaction complète et structurée des 4 corpus juridiques en TypeScript

- [X] T001 [P] [US1] Create structured legal texts (CGV, CGU, Mentions Légales, RGPD) in `frontend/src/content/legalData.ts`

---

## Phase 2: User Story 1 & 2 - Modale Juridique Navigable (Priority: P1 & P2)

**Purpose**: Création du composant modal d'affichage et de navigation avec onglets

- [X] T002 [US1] Create `LegalModal.tsx` component with tabbed navigation and responsive scrolling in `frontend/src/components/legal/LegalModal.tsx`

---

## Phase 3: User Story 3 - Composant Footer et Intégration Layout (Priority: P3)

**Purpose**: Création du Footer et branchement dans l'application globale

- [X] T003 [P] [US3] Create `Footer.tsx` with brand logo, legal links, disclaimer and mobile-safe padding in `frontend/src/components/layout/Footer.tsx`
- [X] T004 [US3] Connect `Footer` and `LegalModal` in `frontend/src/App.tsx`
- [X] T005 [US3] Connect `Footer` and `LegalModal` in `frontend/src/pages/AuthPage.tsx`
- [X] T006 [US1] Add direct link to CGV in `frontend/src/components/subscription/SubscriptionModal.tsx`

---

## Phase 4: Polish & Verification

**Purpose**: Validation technique et tests sans régression

- [X] T007 Run frontend build verification (`npm --prefix frontend run build`)
- [X] T008 Run backend test suite (`npm --prefix backend test`)

---

## Dependencies & Execution Order

- **Phase 1 (Setup & Content Data)**: Pas de dépendance.
- **Phase 2 (LegalModal)**: Dépend de Phase 1.
- **Phase 3 (Footer & Integration)**: Dépend de Phase 2.
- **Phase 4 (Polish & Verification)**: Dépend de toutes les phases.
