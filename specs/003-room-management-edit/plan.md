# Implementation Plan: Room Management & Editing

**Branch**: `003-room-management-edit` | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-room-management-edit/spec.md`

## Summary

Permettre la modification (renommage) et la suppression sécurisée des pièces du foyer. Implémente les routes backend `PATCH /api/rooms/:id` et `DELETE /api/rooms/:id`, enrichit le client API frontend `items.api.ts`, et modernise l'interface `SettingsPage.tsx` avec une gestion interactive et inline des pièces.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+ / React 18  
**Primary Dependencies**: Express, Mongoose, Zod, Tailwind CSS, Lucide React  
**Storage**: MongoDB (Room collection)  
**Testing**: Vitest integration tests for room API (`tests/integration/room.api.test.ts`), frontend build verification  
**Target Platform**: Responsive Web  
**Project Type**: Fullstack Web Application  
**Constraints**: Multi-tenancy strict (`household_id`), protection d'intégrité (pas de suppression de pièce non vide)  

## Constitution Check

- **Principe 2 : Household-First ("Le Foyer")**:
  - PASS. La gestion des pièces est cantonnée au foyer connecté.
- **Principe 6 : Typage strict & Qualité Test-First**:
  - PASS. Nouveaux endpoints testés avec Vitest, typage TypeScript strict.

## Project Structure

### Documentation

```text
specs/003-room-management-edit/
├── plan.md
├── research.md
├── data-model.md
├── contracts/room-api.yaml
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code Impact

```text
backend/src/
├── controllers/room.controller.ts    # updateRoom and deleteRoom methods
├── routes/room.routes.ts             # PATCH /:id and DELETE /:id routes
backend/tests/
└── integration/room.api.test.ts      # Automated integration tests

frontend/src/
├── api/items.api.ts                  # updateRoom and deleteRoom client methods
└── pages/SettingsPage.tsx            # Interactive room cards with inline edit & delete
```
