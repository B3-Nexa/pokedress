# Data Model: Room Management & Editing

**Feature**: `003-room-management-edit`  
**Date**: 2026-10-30

## Entities

### Room Entity

```typescript
export interface Room {
  id: string;
  _id?: string;
  household_id: string;
  name: string;      // Min 1, max 60, trim
  icon: string;      // Default 'door'
  order: number;     // Integer >= 0
  item_count: number; // Computed from items referencing room_id
}
```

### Validation Rules

- `name`: Chaîne non vide (1 à 60 caractères), espaces superflus nettoyés via `.trim()`.
- `household_id`: Identifiant immuable liant la pièce à un foyer unique.
- Contrainte de suppression : `item_count === 0`.
