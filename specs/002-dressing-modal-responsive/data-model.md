# Data Model: Dressing Dedicated Modal & Responsive Layout

**Feature**: `002-dressing-modal-responsive`  
**Date**: 2026-10-30

## Entities & Schemas

### 1. Item (avec focus sur `dressing_vetements`)

L'entité `Item` contient déjà tous les champs requis dans le schéma Zod backend (`backend/src/schemas/item.schema.ts`) et dans l'interface TypeScript frontend (`frontend/src/types/inventory.types.ts`).

```typescript
export interface Item {
  id: string;
  household_id: string;
  room_id: string;
  room_name?: string;
  name: string; // Min 2, max 100
  category: 'dressing_vetements';
  photo_url?: string | null;
  quantity: number; // Défaut: 1

  // Dressing Specific Lifecycle & Metadata Fields
  dressing_status?: 'active' | 'dormant' | 'to_sell_or_donate' | null;
  resale_price?: number | null; // Min 0
  clothing_type?: string | null; // ex: 'Haut / T-shirt', 'Pantalon / Jeans', 'Robe', 'Manteau / Veste', 'Chaussures', 'Accessoires'
  size?: string | null; // ex: 'XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42'
  season?: 'toute_saison' | 'printemps_ete' | 'automne_hiver' | null;
  brand?: string | null; // Max 80
  notes?: string | null; // Max 500
}
```

### 2. Dressing Form State (`DressingAddModal`)

État local du formulaire d'ajout dédié :

| Champ | Type | Validation / Contraintes | Valeur par défaut |
|-------|------|--------------------------|-------------------|
| `name` | `string` | Obligatoire, min 2 caractères, max 100 | `''` |
| `room_id` | `string` | Obligatoire, ID d'une pièce valide | Pièce « Dressing » ou « Chambre » si présente, sinon 1ère pièce |
| `clothing_type` | `string` | Optionnel (liste de suggestions rapides ou texte libre) | `''` |
| `size` | `string` | Optionnel (sélection rapide ou texte libre) | `''` |
| `brand` | `string` | Optionnel, max 80 caractères | `''` (conservé en mode enchaîné) |
| `dressing_status` | `DressingStatus` | Enum: `active`, `dormant`, `to_sell_or_donate` | `'active'` |
| `resale_price` | `number \| null` | Optionnel, >= 0 (affiché si statut `to_sell_or_donate`) | `null` |
| `season` | `string` | Enum: `toute_saison`, `printemps_ete`, `automne_hiver` | `'toute_saison'` |
| `photo` | `File \| null` | Image facultative compressée côté client | `null` |

### 3. Responsive Breakpoints Strategy

| Breakpoint Tailwind | Écran cible | Disposition Navigation | Grille Dressing | Conteneur Page |
|---------------------|-------------|------------------------|-----------------|----------------|
| `< 768px` (Mobile) | Smartphone | `BottomNav` fixe en bas | 1 colonne | `w-full px-4 pb-24` |
| `768px - 1023px` (Tablet) | Tablette / Petit PC | `Navbar` en haut + actions | 2 colonnes | `max-w-7xl px-6 pb-12` |
| `>= 1024px` (Desktop) | Écran PC standard / large | `Navbar` en haut + tabs | 3 à 4 colonnes | `max-w-7xl px-8 pb-12` |
