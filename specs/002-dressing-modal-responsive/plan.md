# Implementation Plan: Dressing Dedicated Modal & Responsive Layout

**Branch**: `002-dressing-modal-responsive` | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-dressing-modal-responsive/spec.md`

## Summary

Création d'une modale d'ajout dédiée et enrichie pour le Dressing (`DressingAddModal`) pour éliminer la confusion avec la modale générique d'objets ménagers, et refonte responsive du layout global pour transformer l'application d'un « pseudo-téléphone centré » en une véritable web application fluide sur PC/desktop (grilles multi-colonnes, barre de navigation supérieure desktop, conteneur élargi `max-w-7xl`, tout en conservant une expérience mobile tactile native).

## Technical Context

**Language/Version**: TypeScript 5.x / React 18 / Node.js 20+  
**Primary Dependencies**: Tailwind CSS, Lucide React, Zod, Vite  
**Storage**: MongoDB (Item collection with existing clothing fields)  
**Testing**: Vitest / React Testing Library, ESLint, TypeScript check (`tsc`)  
**Target Platform**: Responsive Web (Mobile, Tablet, Desktop)  
**Project Type**: Fullstack Web Application (Node.js backend + React frontend)  
**Performance Goals**: Ajout vêtement < 10s, ajout enchaîné < 5s, rendu responsive 60fps sans reflow saccadé  
**Constraints**: Respect strict de la Constitution PokeDress (Fast-Add < 10s, Dressing = Catégorie enrichie, Freemium 100 objets)  
**Scale/Scope**: Frontend UI & component layout (Dressing modal, Navbar, BottomNav, App container, DressingGallery, RoomGroupView)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principe 1 : Frictionless Fast-Add (< 10s)**:
  - PASS. La modale dressing pré-configure la catégorie, focalise le nom immédiatement, et propose le mode ajout enchaîné (< 5s).
- **Principe 2 : Household-First ("Le Foyer")**:
  - PASS. Les vêtements continuent d'appartenir au foyer `household_id`.
- **Principe 3 : Prévention active des doublons**:
  - PASS. La vérification anti-doublon en temps réel est intégrée dans la saisie du nom de vêtement.
- **Principe 4 : Dressing = Catégorie enrichie**:
  - PASS. Les statuts du cycle de vie (actif, dormant, à donner/revendre avec prix de revente) et les métadonnées (taille, type, saison, marque) sont accessibles dès la création sans exiger un détour ultérieur.
- **Principe 5 : Mur des 100 objets non bloquant en lecture**:
  - PASS. Les quotas freemium sont gérés par le backend et respectés à l'enregistrement.
- **Principe 6 : Typage strict & Qualité**:
  - PASS. Interfaces TypeScript strictes, validation Zod existante et composants React modulaires.

## Project Structure

### Documentation (this feature)

```text
specs/002-dressing-modal-responsive/
├── plan.md              # This file
├── research.md          # Technical research & design choices
├── data-model.md        # Entity definitions & responsive layout mappings
├── contracts/           # Component & interface contracts
├── quickstart.md        # Runnable verification guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Implementation tasks
```

### Source Code Impact

```text
frontend/src/
├── App.tsx                                      # Navigation state, container max-w-7xl, conditional modals
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                          # Desktop navigation tabs & fast add button
│   │   └── BottomNav.tsx                       # Responsive hide on desktop (md:hidden)
│   ├── dressing/
│   │   ├── DressingGallery.tsx                 # Responsive grid (grid-cols-1 sm:2 md:3 lg:4) + open DressingAddModal
│   │   └── DressingAddModal.tsx                # NEW: Dedicated clothing modal with specific fields
│   ├── inventory/
│   │   ├── RoomGroupView.tsx                   # Responsive grid layout for rooms and items
│   │   └── ItemCard.tsx                        # Flexible presentation for list & grid
│   └── fast-add/
│       └── FastAddModal.tsx                    # Generic item modal centered & responsive
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Aucun | N/A | N/A |
