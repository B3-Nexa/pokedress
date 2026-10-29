# Household Inventory System (PokeDress) Constitution

## Core Principles

### I. Frictionless Fast-Add (< 10s Entry - Non-Negotiable)
The #1 failure mode of home inventory apps is user abandonment due to tedious data entry. Adding an item MUST take less than 10 seconds.
- **Strictly required fields**: Only 3 fields are mandatory: `nom`, `pièce` (room), and `catégorie`.
- **Photo is strictly optional**: Users can snap or upload a photo (raw, without mandatory background removal/détourage), or proceed without one.
- **Chained Add Retention**: When using the chained add action ("Ajouter un autre objet"), the system MUST retain the previously selected `pièce` and `catégorie` to allow rapid cataloging of multiple items in a single session without repetitive re-selection.
- **Optional fields**: Price, purchase date, warranty expiration, brand, and receipt photo MUST remain strictly optional ("compléter plus tard").

### II. Household-First Collaboration ("Le Foyer")
The inventory belongs to the household (Foyer: couple, colocation, famille, ou personne seule), not an isolated user. Data models, queries, and permissions MUST be scoped by `household_id`. Members of the household contribute to and consult the exact same shared inventory in real-time. Free tier includes shared access for up to 2 household members.

### III. Knowledge & Duplicate Prevention over Pure Storage
The primary objective is answering *"Qu'est-ce qu'on a déjà dans le foyer ?"* to prevent duplicate purchases (e.g. buying a duplicate power strip, kitchen tool, or black sweater). The system MUST proactively detect and surface potential duplicates in real-time during search and item entry.

### IV. Actionable Dressing & Item Lifecycle
Clothes and belongings are dynamic. The Dressing is an enriched category within the inventory (not a disconnected silo). It MUST support usage and lifecycle states:
- `active` (porté régulièrement)
- `dormant` (non porté depuis 6+ mois / oublié)
- `to_sell_or_donate` (identifié pour désencombrement / Vinted / don)

### V. Non-Blocking Freemium Cap (The 100-Item Wall)
The free plan includes up to 100 items per household. Hitting the 100-item ceiling MUST NEVER block access to, browsing of, or searching through already cataloged items. Reading and searching existing data is always guaranteed.

### VI. Strong Typing, Schemas & Test-First Core Logic
All API boundaries, DTOs, and domain models MUST be strictly validated via runtime schemas (Zod) on TypeScript with MongoDB. Core business logic (duplicate detection, household isolation, dressing status filters, chained add data retention) MUST be tested with automated tests.

## Architectural & Technical Constraints

- **Stack**: React (TypeScript) with Tailwind CSS on Vite (Frontend) + Node.js (TypeScript) with Express and Zod (Backend) + MongoDB (Mongoose, local & Atlas compatible).
- **Responsive Mobile-First UX**: The application is web-based, optimized for mobile browsers to allow on-the-spot cataloging while unpacking boxes or organizing rooms.
- **Hierarchical Clarity**: A clean, natural 3-level containment model: `Pièce (Room)` -> `Contenant / Meuble (Container/Furniture - Optionnel)` -> `Objet (Item)`.

## Governance

This Constitution supersedes all implementation shortcuts. Amendments require updating this document and adjusting all dependent specifications.

**Version**: 2.1.0 | **Ratified**: 2026-10-29 | **Last Amended**: 2026-10-29
