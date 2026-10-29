# Household Inventory System (PokeDress) Constitution

## Core Principles

### I. Frictionless Fast-Add (< 10s Entry - Non-Negotiable)
The #1 failure mode of home inventory apps is user abandonment due to tedious data entry. Adding an item MUST take less than 10 seconds (photo + name + room + category). Only essential fields are required; price, purchase date, brand, and warranty MUST remain strictly optional. Any UX friction that slows down cataloging violates this core principle.

### II. Household-First Collaboration ("Chez Nous")
The inventory belongs to the household (Foyer), not an isolated individual. Data models, queries, and permissions MUST be scoped by `household_id`. Multiple members (e.g., couples moving in together like Léa & her partner) contribute to and consult the exact same shared inventory in real-time.

### III. Knowledge & Duplicate Prevention over Pure Storage
The primary objective is answering *"What do we already own?"* to prevent duplicate purchases (e.g. buying a duplicate power strip, tool, or sweater). The system MUST proactively detect and surface potential duplicates in real-time during search and item entry.

### IV. Actionable Dressing & Item Lifecycle
Clothes and belongings are dynamic. The system MUST support usage and lifecycle states, particularly for the dressing module:
- `active` (worn regularly)
- `dormant` (not worn in 6+ months / forgotten)
- `to_sell_or_donate` (flagged for decluttering / Vinted / donation)

### V. Strong Typing, Schemas & Test-First Core Logic
All API boundaries, DTOs, and domain models MUST be strictly validated via runtime schemas (Zod) on TypeScript. Core business features (duplicate similarity checks, household data isolation, dressing metrics, and category aggregations) MUST be tested with automated unit and integration tests before UI wiring.

## Architectural & Technical Constraints

- **Stack**: React (TypeScript) with Tailwind CSS on Vite (Frontend) + Node.js (TypeScript) with Express and Zod (Backend) + MongoDB (Mongoose, local & Atlas compatible).
- **Responsive Mobile-First UX**: The application is web-based but optimized for mobile web browsers to enable instant smartphone camera photo capture in rooms.
- **Hierarchical Clarity**: A clean, natural 3-level containment model: `Room / Location (Pièce)` -> `Container / Furniture (Dressing, Vaisselier, Caisse)` -> `Item (Objet)`.

## Development Workflow & Quality Gates

- **Specification-Driven**: Every feature maps to user journeys from `vision-produit-inventaire.md`.
- **Quality Gates**:
  1. Fast-add payload validated and tested under 100ms API response time.
  2. Duplicate detection algorithm returns matches without blocking user flow.
  3. Household isolation verified (no cross-household data leakage).
  4. Type-safety verified with zero TypeScript build errors.

## Governance

This Constitution supersedes all implementation shortcuts. Amendments require updating this document and adjusting all dependent specifications.

**Version**: 2.0.0 | **Ratified**: 2026-10-29 | **Last Amended**: 2026-10-29
