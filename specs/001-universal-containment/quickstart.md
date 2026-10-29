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

## 2. Verification Scenarios (Aligned with Acceptance Criteria `docs/criteres-acceptation.md`)

### Scenario 1: Fast-Add an Item in < 10 Seconds (Persona: Léa) `[CA-1.1, CA-1.2, CA-1.3]`
1. Open the web app on desktop or mobile browser.
2. Click the central **"+" (Ajout Rapide)** button (touch target >= 44x44px).
3. Enter name: `"Grille-pain"`, select room: `"Cuisine"`, category: `"Électroménager"`.
4. Leave photo and all optional fields (price, warranty, brand) empty.
5. Click **Enregistrer** -> Item is created in < 50ms with `quantity = 1`, confirmation toast appears with button *"Ajouter un autre objet"*.

### Scenario 2: Chained Add with Retained Context (< 5 Seconds per subsequent item) `[CA-1.4, CA-1.5]`
1. In the confirmation toast from Scenario 1, click **"Ajouter un autre objet"** (or use the chained add toggle in the modal).
2. The modal re-opens with the name field cleared and focused.
3. Verify that room (`"Cuisine"`) and category (`"Électroménager"`) remain pre-selected.
4. Type `"Bouilloire"` and press Enter -> Saved in < 5 seconds without touching room or category.
5. Change room to `"Salon"`; subsequent additions retain `"Salon"` until changed.

### Scenario 3: Proactive Anti-Duplicate Detection (Fin des achats en double) `[CA-3.1, CA-3.2, CA-3.3, CA-3.4]`
1. Open the Fast-Add modal.
2. Type in the name field: `"rallonge"` (lowercase, no accents).
3. Notice the real-time banner appearing after 300ms beneath the input:
   > *⚠️ 1 objet similaire déjà possédé : "Rallonge 5m" dans Salon*
4. Click on the alert to view the existing item's picture and location without buying a duplicate.
5. If adding a second extension cord intentionally, click Enregistrer; the alert does NOT block submission.

### Scenario 4: Dressing Decluttering & Vinted Flagging (Persona: Sarah) `[CA-4.2, CA-4.4, CA-4.5, CA-4.6]`
1. Navigate to the **Dressing** category (`/overview?category=dressing_vetements`).
2. Verify that clothes default to status `active` (« Porté régulièrement »).
3. Toggle filter to **"Objets dormants" (Jamais portés depuis 6+ mois)**.
4. Click on a dormant sweater and touch the 1-click action **"À donner ou revendre"**.
5. Input an optional resale price (e.g. `15` €); verify that the declutter list displays the total sum of defined resale prices.

### Scenario 5: Household Collaboration ("Le Foyer") `[CA-5.1, CA-5.3, CA-5.4, CA-5.6, CA-6.3]`
1. Open Household settings, copy the 6-character invite code (e.g. `K9X2P4`).
2. In a second browser window (incognito), register as Marc and enter `k9x2p4` (lowercase/whitespace tolerant).
3. Marc immediately joins Léa's household and accesses all 5 default rooms (Salon, Cuisine, Chambre, Salle de bain, Cave/Garage).
4. A 3rd user attempting to join gets the friendly notice: *« Ce foyer est complet en version gratuite »*.
5. Marc opens an existing appliance to enrich it with a receipt photo, purchase date, and 2-year legal warranty date ("compléter plus tard").

### Scenario 6: Non-Blocking 100-Item Freemium Wall & Dashboard `[CA-6.1, CA-6.2, CA-6.4, CA-6.5, CA-6.6, CA-6.7]`
1. When a household reaches 90 items, verify the discrete warning banner: *« Plus que 10 objets en version gratuite »*.
2. At 100 items, attempting a 101st item returns HTTP 403 `UPGRADE_REQUIRED` with a courteous upgrade prompt.
3. Open Dashboard: verify North Star Metric card (« 100 objets inventoriés »), room count list (« Salon : 14 objets » without percentage bars), and estimated value summary (« valeur estimée sur X objets sur Y »).
4. Perform searches and browse all rooms -> 100% of read and search operations remain unrestricted.
