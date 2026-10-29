# Technical Research: Household Inventory System

**Feature**: `001-household-inventory-core`
**Date**: 2026-10-29

## 1. Fast-Add & Chained Add Architecture (< 10s Entry)

### The Problem
If taking a photo and adding an item takes 30 seconds or requires 15 fields, users will abandon the inventory after 5 items. The Fast-Add flow must be lightning-fast.

### Technical Decisions
1. **Minimal Mandatory Fields**:
   - Strictly 3 required fields: `name`, `room_id`, `category`.
   - All other fields (`purchase_price`, `purchase_date`, `warranty_expiry`, `receipt_photo`, `brand`, `notes`) are optional ("compléter plus tard").
2. **Photo is Strictly Optional (No Forced Détourage)**:
   - Competitive analysis in `docs/recherche-terrain.md` shows that forced background removal (détourage IA) in apps like Whering or Indyx causes frequent bugs, slowness, and high abandonment.
   - PokeDress allows raw photos with client-side canvas compression (< 200 KB) and does NOT impose any background removal. Users can snap or upload a photo or skip it entirely.
3. **Chained Add ("Ajouter un autre objet") State Retention**:
   - When cataloging a room (e.g., Léa sorting 30 items in the Cuisine, or Sarah sorting 100 clothes in the Dressing), clicking "Ajouter un autre objet" maintains `room_id` and `category` in React component state.
   - The modal clears only the `name` field and focuses on it, reducing subsequent item additions to < 5 seconds.

## 2. Anti-Duplicate Detection Engine

### The Problem
Users buy items they already own because they don't know they have them. During Fast-Add, we must warn them before they save a duplicate or when they search before shopping.

### Technical Decision
1. **Debounced Real-Time Check**:
   - In the frontend Fast-Add form, the `name` input triggers a debounced query (300ms) to `GET /api/items/check-duplicates?name=...`.
2. **Matching Strategy**:
   - Normalized text query on MongoDB index: accent stripping + case-insensitive regex or text search.
   - Example: Searching "rallonge" matches "Rallonge 5m", "Rallonge multiprise".
   - Returns up to 3 similar items with their room names and photos without blocking the user.

## 3. Household Collaboration ("Le Foyer")

### The Problem
Members of a household (Léa and Marc, roommates, or families) need to share the same inventory without complex enterprise permissions.

### Technical Decisions
1. **Household Model**:
   - `Household` collection with `name` and a unique 6-character code (e.g. `K9X2P4`).
   - Every `User` has a `household_id`.
2. **Invitation Flow**:
   - User A registers -> A new household "Chez Léa" is created with code `K9X2P4`.
   - User B registers and enters `K9X2P4` -> User B is assigned to User A's `household_id`.
   - Every database query automatically filters by `household_id: req.user.household_id`.
   - Free tier includes up to 2 active members per household.

## 4. Dressing Category & Lifecycle Architecture

### The Problem
Clothes are bought, stored, forgotten, and never resold. The vision and terrain research demonstrate that households own ~2x more clothes than they realize (> 150 items).

### Technical Decisions
- Dressing is implemented as an enriched category (`Dressing & Vêtements`), not an isolated silo.
- Items in this category include `dressing_status`:
  - `active`: Worn regularly
  - `dormant`: Never worn in 6+ months
  - `to_sell_or_donate`: Flagged for Vinted or donation
- Quick action buttons allow toggling this status directly with 1 click.

## 5. Non-Blocking Freemium Cap (100-Item Ceiling)

### The Problem
A typical wardrobe exceeds 100 items. Reaching 100 items triggers the premium wall.

### Technical Decision
- Backend middleware checks item count per household during `POST /api/items`. If count >= 100 on free tier, returns HTTP 403 `UPGRADE_REQUIRED`.
- **Non-blocking read rule**: `GET` endpoints (browsing, searching, viewing items) are NEVER blocked. Users always retain full access to their cataloged belongings.

## 6. Technology Stack Summary

- **Frontend**: React 18/19 (TypeScript) + Vite + Tailwind CSS + Lucide React + TanStack Query
- **Backend**: Node.js (TypeScript) + Express + Zod + Mongoose + Multer
- **Database**: MongoDB (Mongoose) with compound indexes on `household_id`, `room_id`, `category`, and text index on `name`
- **Testing**: Vitest for unit & integration testing (duplicate checks, household isolation, fast-add validation) + Supertest for API contracts
