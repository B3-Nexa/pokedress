# Data Model: Household Inventory System

**Feature**: `001-household-inventory-core`
**Date**: 2026-10-29

## 1. Collections & TypeScript Interfaces

### Collection 1: `households` (Le Foyer)
Represents the shared household space for Léa and her partner.

```typescript
export interface IHousehold {
  _id: string; // Mongo ObjectId
  name: string; // e.g. "Chez Léa & Marc"
  invite_code: string; // 6-character uppercase alphanumeric code (e.g. "LEA28X")
  created_at: Date;
  updated_at: Date;
}
```

### Collection 2: `users` (Membres du Foyer)
```typescript
export interface IUser {
  _id: string;
  household_id: string; // References Household._id
  email: string;
  name: string;
  password_hash: string;
  role: 'owner' | 'member';
  created_at: Date;
}
```

### Collection 3: `rooms` (Pièces du Logement)
```typescript
export interface IRoom {
  _id: string;
  household_id: string;
  name: string; // "Salon", "Cuisine", "Chambre", "Dressing", "Garage/Cave"
  icon: string; // Lucide icon identifier (e.g. "sofa", "utensils", "bed", "warehouse")
  order: number;
  created_at: Date;
}
```

### Collection 4: `containers` (Meubles & Caisses - Optionnel)
Permet de préciser où dans la pièce l'objet se trouve (Vaisselier, Penderie, Caisse n°2).

```typescript
export interface IContainer {
  _id: string;
  household_id: string;
  room_id: string; // References Room._id
  name: string; // "Vaisselier", "Penderie manteaux", "Caisse bricolage n°1"
  type: 'furniture' | 'box' | 'wardrobe' | 'drawer';
  created_at: Date;
}
```

### Collection 5: `items` (Objets du Foyer)
The central entity cataloging all possessions.

```typescript
export type CategoryKey = 
  | 'dressing' 
  | 'meubles_deco' 
  | 'electromenager' 
  | 'vaisselle' 
  | 'hightech' 
  | 'outils_bricolage' 
  | 'loisirs_livres'
  | 'autre';

export type DressingStatus = 'active' | 'dormant' | 'to_sell_or_donate';

export interface IItem {
  _id: string;
  household_id: string;
  room_id: string; // Mandatory: which room it is in
  container_id?: string | null; // Optional: which furniture/box it is in
  name: string; // "Pull col roulé noir", "Rallonge 5m", "Grille-pain"
  category: CategoryKey;
  photo_url?: string | null; // Thumbnail image URL
  quantity: number; // Defaults to 1
  
  // Specific to Dressing module (Lifecycle)
  dressing_status?: DressingStatus | null;
  clothing_type?: string; // "pull", "pantalon", "robe", "manteau", "chaussures"
  size?: string; // "M", "38", etc.
  season?: 'printemps_ete' | 'automne_hiver' | 'toute_saison';

  // Optional Financial & Insurance fields
  purchase_price?: number | null; // Optional: 49.99 €
  purchase_date?: Date | null;
  warranty_expiry?: Date | null;
  brand?: string | null;
  notes?: string | null;

  created_at: Date;
  updated_at: Date;
}
```

---

## 2. Validation Schemas (Zod)

### Fast-Add Item Schema (`fastAddItemSchema`)
```typescript
import { z } from 'zod';

export const fastAddItemSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères").max(100),
  room_id: z.string().min(1, "La pièce est obligatoire"),
  category: z.enum([
    'dressing',
    'meubles_deco',
    'electromenager',
    'vaisselle',
    'hightech',
    'outils_bricolage',
    'loisirs_livres',
    'autre'
  ]),
  container_id: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  
  // Optional dressing attributes
  dressing_status: z.enum(['active', 'dormant', 'to_sell_or_donate']).optional().nullable(),
  size: z.string().optional().nullable(),
  season: z.enum(['printemps_ete', 'automne_hiver', 'toute_saison']).optional().nullable(),

  // Optional finance / insurance attributes
  purchase_price: z.number().min(0).optional().nullable(),
  purchase_date: z.string().datetime().optional().nullable(),
  warranty_expiry: z.string().datetime().optional().nullable(),
  brand: z.string().max(80).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});
```

---

## 3. MongoDB Indexes

```javascript
// Items collection
db.items.createIndex({ household_id: 1, room_id: 1 });
db.items.createIndex({ household_id: 1, category: 1 });
db.items.createIndex({ household_id: 1, dressing_status: 1 });
db.items.createIndex({ household_id: 1, name: "text" }); // Full-text search and anti-duplicate check

// Rooms & Containers
db.rooms.createIndex({ household_id: 1, order: 1 });
db.containers.createIndex({ household_id: 1, room_id: 1 });

// Households
db.households.createIndex({ invite_code: 1 }, { unique: true });

// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ household_id: 1 });
```
