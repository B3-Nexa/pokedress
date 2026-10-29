# Quickstart & Verification Guide: Household Inventory System

**Feature**: `001-household-inventory-core`
**Date**: 2026-10-29

## Prerequisites

- Node.js >= 20 LTS & npm
- MongoDB running locally on `mongodb://localhost:27017/pokedress` (or via MongoDB Atlas connection string `MONGODB_URI`)

## 1. Setup & Launch

```bash
# Backend setup
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend setup (separate terminal)
cd frontend
npm install
npm run dev
```

- Backend API: `http://localhost:5000`
- Frontend Web App: `http://localhost:5173`

---

## 2. Verification Scenarios (Aligned with Personas & Terrain Research)

### Scenario 1: Fast-Add an Item in < 10 Seconds (Persona: Léa)
1. Open the web app on desktop or mobile browser.
2. Click the central **"+" (Ajout Rapide)** button.
3. Enter name: `"Grille-pain"`, select room: `"Cuisine"`, category: `"Électroménager"`.
4. Leave photo and all optional fields (price, warranty, brand) empty.
5. Click **Enregistrer** -> Item is created in < 50ms, confirmation toast appears with button *"Ajouter un autre objet"*.

### Scenario 2: Chained Add with Retained Context (< 5 Seconds per subsequent item)
1. In the confirmation toast from Scenario 1, click **"Ajouter un autre objet"** (or use the chained add toggle in the modal).
2. The modal re-opens with the name field cleared and focused.
3. Verify that room (`"Cuisine"`) and category (`"Électroménager"`) remain pre-selected.
4. Type `"Bouilloire"` and press Enter -> Saved in < 5 seconds without touching room or category.

### Scenario 3: Proactive Anti-Duplicate Detection (Fin des achats en double)
1. Open the Fast-Add modal.
2. Type in the name field: `"Rallonge"`.
3. Notice the real-time banner appearing beneath the input:
   > *⚠️ 1 objet similaire déjà possédé : "Rallonge 5m" dans Salon*
4. Click on the alert to view the existing item's picture and location without buying a duplicate.
5. If adding a second extension cord intentionally, click Enregistrer; the alert does not block submission.

### Scenario 4: Dressing Decluttering & Vinted Flagging (Persona: Sarah)
1. Navigate to the **Dressing** category (`/overview?category=dressing_vetements`).
2. Toggle filter to **"Objets dormants" (Jamais portés depuis 6+ mois)**.
3. Observe items flagged as forgotten at the bottom of the wardrobe.
4. Click on a sweater and update its status to **"À donner ou revendre"** with a target resale price (e.g. 15 €).
5. The sweater moves to the decluttering list ready for Vinted export.

### Scenario 5: Household Collaboration ("Le Foyer")
1. Open Household settings, copy the 6-character invite code (e.g. `K9X2P4`).
2. In a second browser window (incognito), register as Marc and enter `K9X2P4`.
3. Marc immediately joins Léa's household and accesses all rooms and belongings.
4. Marc clicks an existing computer item to enrich it with a receipt photo and warranty expiration date ("compléter plus tard").

### Scenario 6: Non-Blocking 100-Item Freemium Wall
1. When a household catalogs its 100th item, display a courteous banner: *"Cap des 100 objets atteint : passez en illimité pour continuer à ajouter des objets"*.
2. Perform searches, browse rooms, and view item details -> 100% of read and search operations remain unrestricted.
