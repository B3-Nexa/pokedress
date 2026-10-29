# Data Model: Household Inventory System

**Feature**: `001-household-inventory-core`
**Date**: 2026-10-29

## 1. Collections & TypeScript Interfaces

### Collection 1: `households` (Le Foyer)
Represents the shared living unit (couple, colocation, famille, personne seule).

```typescript
export interface IHousehold {
  _id: string; // Mongo ObjectId
  name: string; // e.g. "Chez Léa & Marc", "Coloc Gambetta"
  invite_code: string; // 6-character uppercase alphanumeric code (e.g. "LEA28X")
  plan: 'free' | 'premium'; // Defaults to 'free' (max 100 items, 2 members)
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
  name: string; // e.g. "Léa", "Marc"
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
  name: string; // "Salon", "Cuisine", "Chambre", "Dressing", "Cave", "Garage"
  icon: string; // Lucide icon identifier (e.g. "sofa", "utensils", "bed", "shirt", "warehouse")
  order: number;
  created_at: Date;
}
```

### Collection 4: `containers` (Meubles & Caisses - Optionnel)
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
The central entity cataloging all household possessions.

```typescript
export type CategoryKey = 
  | 'dressing_vetements' 
  | 'meubles_deco' 
  | 'electromenager' 
  | 'vaisselle_cuisine' 
  | 'hightech' 
  | 'outils_bricolage' 
  | 'loisirs_livres'
  | 'autre';

export type DressingStatus = 'active' | 'dormant' | 'to_sell_or_donate';

export interface IItem {
  _id: string;
  household_id: string;
  room_id: string; // Mandatory: which room it is in
  container_id?: string | null; // Optional: furniture or crate
  name: string; // "Pull col roulé noir", "Rallonge 5m", "Grille-pain"
  category: CategoryKey;
  photo_url?: string | null; // Optional raw image URL (no forced détourage)
  quantity: number; // Defaults to 1 — a record always counts as 1 item (counters, 100-item cap)
  
  // Specific to Dressing category (Lifecycle)
  dressing_status?: DressingStatus | null; // Defaults to 'active' for dressing_vetements, set manually
  resale_price?: number | null; // Optional target resale price (Vinted / donation list)
  clothing_type?: string | null; // "pull", "pantalon", "robe", "manteau"
  size?: string | null; // "M", "38", etc.
  season?: 'printemps_ete' | 'automne_hiver' | 'toute_saison' | null;

  // Optional Financial, Warranty & Receipt fields ("Compléter plus tard")
  purchase_price?: number | null; // Optional: 49.99 €
  purchase_date?: Date | null;
  warranty_expiry?: Date | null; // 2-year legal warranty tracking (Marc)
  receipt_photo_url?: string | null; // Receipt / invoice photo
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
  // Strictly 3 mandatory fields
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères").max(100),
  room_id: z.string().min(1, "La pièce est obligatoire"),
  category: z.enum([
    'dressing_vetements',
    'meubles_deco',
    'electromenager',
    'vaisselle_cuisine',
    'hightech',
    'outils_bricolage',
    'loisirs_livres',
    'autre'
  ]),

  // Optional fields (including photo)
  photo_url: z.string().optional().nullable(),
  container_id: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  
  // Optional Dressing attributes
  dressing_status: z.enum(['active', 'dormant', 'to_sell_or_donate']).optional().nullable(),
  resale_price: z.number().min(0).optional().nullable(),
  clothing_type: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  season: z.enum(['printemps_ete', 'automne_hiver', 'toute_saison']).optional().nullable(),

  // Optional Finance & Warranty attributes ("Compléter plus tard")
  purchase_price: z.number().min(0).optional().nullable(),
  purchase_date: z.string().datetime().optional().nullable(),
  warranty_expiry: z.string().datetime().optional().nullable(),
  receipt_photo_url: z.string().optional().nullable(),
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
db.items.createIndex({ household_id: 1, name: "text" }); // Anti-duplicate similarity search & full-text query

// Rooms & Containers
db.rooms.createIndex({ household_id: 1, order: 1 });
db.containers.createIndex({ household_id: 1, room_id: 1 });

// Households & Users
db.households.createIndex({ invite_code: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ household_id: 1 });
```
