# Technical Research: Household Inventory System

**Feature**: `001-household-inventory-core`
**Date**: 2026-10-29

## 1. Fast-Add Architecture (< 10s Entry)

### The Problem
If taking a photo and adding an item takes 30 seconds or requires 15 fields, users will abandon the inventory after 5 items. The Fast-Add flow must be lightning-fast.

### Technical Decision
1. **Client-side Image Optimization**:
   - When a user snaps a photo on their phone, the original photo is often 4–8 MB.
   - Use lightweight canvas/browser compression on the frontend before upload, producing a crisp web thumbnail (< 200 KB).
   - Backend accepts multipart/form-data via `multer` (storing in `backend/uploads/` with static routing) or data URLs.
2. **Minimal Required Payload**:
   - Required: `name`, `room_id`, `category`.
   - Optional: `photo`, `container_id`, `price`, `brand`, `notes`.
   - Submission completes in a single HTTP request (< 50ms processing).

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

## 3. Household Collaboration ("Chez Nous")

### The Problem
Léa and her partner need to share the same inventory from their respective devices without complex enterprise RBAC.

### Technical Decision
1. **Household Model**:
   - `Household` collection with `name` and a unique 6-character code (e.g. `K9X2P4`).
   - Every `User` has a `household_id`.
2. **Invitation Flow**:
   - User A registers -> A new household "Chez Léa" is created with code `K9X2P4`.
   - User B registers and enters `K9X2P4` -> User B is assigned to User A's `household_id`.
   - Every database query automatically filters by `household_id: req.user.household_id`.

## 4. Dressing Lifecycle Architecture

### The Problem
Clothes are bought, stored, forgotten, and never resold. The vision requires identifying under-exploited clothes.

### Technical Decision
- Items categorized as `dressing` include a `dressing_status` enum:
  - `active`: Worn regularly
  - `dormant`: Never worn in 6+ months
  - `to_sell_or_donate`: Flagged for Vinted or donation
- Quick action endpoints allow toggling this status directly from the dressing gallery view with 1 click.

## 5. Technology Stack Summary

- **Frontend**: React 18/19 (TypeScript) + Vite + Tailwind CSS + Lucide React + TanStack Query
- **Backend**: Node.js (TypeScript) + Express + Zod + Mongoose + Multer
- **Database**: MongoDB (Mongoose) with indexes on `household_id`, `room_id`, `category`, and text index on `name`
- **Testing**: Vitest for unit & integration testing (duplicate checks, household isolation, fast-add validation) + Supertest for API contracts
