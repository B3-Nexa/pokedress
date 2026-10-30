# Interface Contract: Dressing Add Modal & Responsive UI

**Feature**: `002-dressing-modal-responsive`  
**Date**: 2026-10-30

## 1. Component Contract: `DressingAddModal`

### Props

```typescript
export interface DressingAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onItemAdded: () => void;
}
```

### Emitted Events / API Calls

- Sur soumission : Appel de `api.createItem(payload, photoFile)` avec :
  - `name`: string (trim, min 2)
  - `room_id`: string
  - `category`: `'dressing_vetements'` (automatique)
  - `quantity`: 1
  - `dressing_status`: `'active'` | `'dormant'` | `'to_sell_or_donate'`
  - `resale_price`: number (optionnel)
  - `clothing_type`: string (optionnel)
  - `size`: string (optionnel)
  - `brand`: string (optionnel)
  - `season`: `'toute_saison'` | `'printemps_ete'` | `'automne_hiver'` (optionnel)
  - `photoFile`: File (facultatif, image compressée)

---

## 2. Component Contract: `Navbar` Responsive Extension

### Props

```typescript
export interface NavbarProps {
  household?: Household | null;
  totalItems?: number;
  show90Warning?: boolean;
  activeTab?: 'overview' | 'dressing' | 'dashboard' | 'settings';
  setActiveTab?: (tab: 'overview' | 'dressing' | 'dashboard' | 'settings') => void;
  onOpenFastAdd?: () => void;
}
```

- Sur grand écran (`md:flex`), `Navbar` affiche les onglets de navigation et un bouton d'ajout rapide dans l'en-tête.
- Sur petit écran (`md:hidden`), `Navbar` reste compacte avec logo et code foyer, et `BottomNav` prend le relais en bas d'écran.
