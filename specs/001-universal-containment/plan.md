# Implementation Plan: 001-household-inventory-core

**Branch**: `001-household-inventory-core` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Product Vision from `vision-produit-inventaire.md`: Collaborative household inventory web app for young couples (Léa & partner) to know what they own, eliminate duplicate purchases, and declutter their dressing via frictionless fast-add (< 10s).

## Summary

Build a modern, collaborative household inventory web application tailored for couples and roommates. The system delivers a sub-10-second Fast-Add flow (photo, name, room, category), real-time anti-duplicate detection, an actionable dressing lifecycle module (active, dormant, to sell/donate), shared household spaces via invite codes, and an executive dashboard tracking the North Star Metric (total items cataloged) and insurance value.

The technical architecture is built on a decoupled monorepo: a **Node.js (TypeScript)** REST API using **Express**, **Zod**, and **Mongoose** connected to **MongoDB** (local & Atlas), paired with a responsive, mobile-first **React (TypeScript)** frontend powered by **Vite**, **Tailwind CSS**, and **TanStack Query**.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS (Backend & Frontend)

**Primary Dependencies**:
- **Backend**: Express.js, Mongoose 8.x, Zod, Multer (image uploads), bcryptjs, jsonwebtoken, dotenv, cors
- **Frontend**: React 18/19, Vite, Tailwind CSS, Lucide React, TanStack Query, browser-image-compression

**Storage**: MongoDB (local MongoDB instance with MongoDB Atlas URI compatibility)

**Testing**: Vitest for unit & integration testing; Supertest for API contract tests; React Testing Library for frontend components

**Target Platform**: Web application (responsive desktop and mobile browser optimized for camera photo capture)

**Project Type**: Full-stack web application (`backend/` API + `frontend/` SPA)

**Performance Goals**:
- Fast-Add submission: < 100ms response time.
- Anti-duplicate search debounced query: < 50ms response time.
- Overview page initial data load: < 200ms.

**Scale/Scope**:
- Collaborative household scope (`household_id`). Free tier ready (up to 100 items per household) with seamless expansion.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitutional Rule | Compliance Status | Justification / Design Detail |
|---|---|---|
| **I. Frictionless Fast-Add (< 10s Entry)** | **PASSED** | Only 3 required fields (name, room, category); client-side image compression; non-blocking optional fields. |
| **II. Household-First Collaboration ("Chez Nous")** | **PASSED** | Data models scoped by `household_id`; 6-character invite code flow. |
| **III. Knowledge & Duplicate Prevention** | **PASSED** | Real-time debounced similarity search on `name` during typing. |
| **IV. Actionable Dressing & Item Lifecycle** | **PASSED** | Dedicated `dressing_status` enum (`active`, `dormant`, `to_sell_or_donate`) with 1-click status transitions. |
| **V. Strong Typing & Test-First Core Logic** | **PASSED** | Zod validation schemas for all endpoints; Vitest tests for duplicate checks and household scoping. |

## Project Structure

### Documentation (this feature)

```text
specs/001-universal-containment/
├── spec.md              # Feature specification aligned with Product Vision
├── plan.md              # This implementation plan
├── research.md          # Technical research & decisions (Fast-Add, anti-duplicate, stack)
├── data-model.md        # Household, User, Room, Container, Item schemas & Zod DTOs
├── quickstart.md        # Run & verification scenarios (Léa persona, fast-add, declutter)
├── contracts/
│   └── nodes-api.yaml   # OpenAPI 3.0 REST contract
├── checklists/
│   └── requirements.md  # Spec quality validation
└── tasks.md             # Dependency-ordered implementation tasks
```

### Source Code (repository root)

```text
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── config/
│   │   ├── database.ts        # Mongoose connection (local & Atlas)
│   │   └── env.ts             # Typed env variables
│   ├── models/
│   │   ├── household.model.ts # Household schema with invite_code
│   │   ├── user.model.ts      # User schema
│   │   ├── room.model.ts      # Room schema with default rooms seeder
│   │   ├── container.model.ts # Optional furniture / boxes schema
│   │   └── item.model.ts      # Item schema with category & dressing_status
│   ├── schemas/
│   │   ├── item.schema.ts     # Zod Fast-Add validation
│   │   └── auth.schema.ts     # Zod register / join household validation
│   ├── services/
│   │   ├── item.service.ts    # Fast-Add, duplicate detection, filters
│   │   ├── household.service.ts# Invite code generation & member linking
│   │   └── dashboard.service.ts# North Star Metric, room progress, value calculations
│   ├── controllers/
│   │   ├── item.controller.ts # Item & duplicate check endpoints
│   │   ├── room.controller.ts
│   │   └── dashboard.controller.ts
│   ├── routes/
│   │   ├── item.routes.ts     # /api/items
│   │   ├── room.routes.ts     # /api/rooms
│   │   ├── dashboard.routes.ts# /api/dashboard
│   │   └── index.ts
│   └── app.ts                 # Express setup, Multer static uploads, error middleware
└── tests/
    ├── unit/
    │   ├── duplicate.service.test.ts # Anti-duplicate search unit tests
    │   └── item.schema.test.ts
    └── integration/
        ├── fast-add.api.test.ts      # Fast-Add API contract tests
        └── household.api.test.ts     # Scoping and invite code tests

frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── api/
│   │   ├── client.ts          # Axios / Fetch client with household context
│   │   ├── items.api.ts
│   │   └── dashboard.api.ts
│   ├── types/
│   │   └── inventory.types.ts # TypeScript interfaces matching data-model
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── BottomNav.tsx  # Mobile-friendly navigation with central "+" button
│   │   ├── fast-add/
│   │   │   ├── FastAddModal.tsx      # < 10s entry modal with camera capture
│   │   │   └── DuplicateWarning.tsx  # Real-time duplicate alert banner
│   │   ├── inventory/
│   │   │   ├── RoomGroupView.tsx     # Items grouped by room
│   │   │   ├── CategoryGroupView.tsx # Items grouped by category
│   │   │   └── ItemCard.tsx          # Card with photo, status, and room badge
│   │   ├── dressing/
│   │   │   ├── DressingGallery.tsx   # Wardrobe view with lifecycle filters
│   │   │   └── DeclutterModal.tsx    # Mark item as "To sell / donate"
│   │   └── dashboard/
│   │       ├── NorthStarCard.tsx     # Total items metric card
│   │       ├── RoomProgressBar.tsx   # Cataloging progress by room
│   │       └── InsuranceSummary.tsx  # Optional total value calculation
│   ├── pages/
│   │   ├── OverviewPage.tsx   # Central inventory (by room & by category)
│   │   ├── DressingPage.tsx   # Dedicated dressing & decluttering module
│   │   ├── DashboardPage.tsx  # Executive summary & insurance valuation
│   │   └── SettingsPage.tsx   # Household invite code & members
│   ├── App.tsx
│   └── main.tsx
└── tests/
    └── components/
```

**Structure Decision**: Decoupled full-stack structure (`backend/` + `frontend/`) optimizing developer productivity, isolated testing, and cloud readiness.
