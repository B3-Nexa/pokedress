# Implementation Plan: Fake Payment & Subscription Upgrade

**Branch**: `004-fake-payment-subscription` | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-fake-payment-subscription/spec.md`

## Summary

Création d'une interface de changement d'abonnement et d'un simulateur de paiement par carte bancaire factice (Fake Checkout) avec points d'entrée dans la Navbar, le Dashboard et les Paramètres du foyer. Implémentation de la route backend `POST /api/household/subscription` et actualisation temps réel des statuts Freemium.

## Technical Context

**Language/Version**: TypeScript 5.x / React 18 / Node.js 20+  
**Primary Dependencies**: Express, Mongoose, Zod, Tailwind CSS, Lucide React  
**Storage**: MongoDB (Household collection, `plan` and `billing_cycle`)  
**Testing**: Vitest integration tests in `backend/tests/integration/subscription.api.test.ts`, frontend build validation  
**Target Platform**: Responsive Web (Desktop, Tablet, Mobile)  

## Constitution Check

- **Principe 5 : Mur des 100 objets non bloquant en lecture**:
  - PASS. L'abonnement Premium lève le cap des 100 objets. Si rétrogradation, tous les objets restent 100% lisibles et consultables.
- **Principe 2 : Household-First ("Le Foyer")**:
  - PASS. L'abonnement est rattaché au foyer (`household_id`) et profite à tous ses membres.

## Project Structure

### Documentation

```text
specs/004-fake-payment-subscription/
├── plan.md
├── research.md
├── data-model.md
├── contracts/subscription-api.yaml
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code Impact

```text
backend/src/
├── routes/household.routes.ts          # POST /subscription route
├── controllers/auth.controller.ts      # updateSubscription controller handler
└── services/household.service.ts       # updateSubscription service logic
backend/tests/
└── integration/subscription.api.test.ts # Vitest tests for subscription endpoint

frontend/src/
├── api/items.api.ts                    # updateSubscription client call
├── types/inventory.types.ts            # Billing cycle types
├── components/subscription/
│   └── SubscriptionModal.tsx           # Plans comparison & Fake Payment Checkout
├── components/layout/Navbar.tsx        # Premium badge and trigger button
├── pages/DashboardPage.tsx             # Upgrade CTA in cap warning banners
└── pages/SettingsPage.tsx              # Plan status & upgrade action in Household tab
```
