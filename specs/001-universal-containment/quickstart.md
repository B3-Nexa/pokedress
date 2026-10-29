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

## 2. Verification Scenarios (Aligned with Product Vision)

### Scenario 1: Fast-Add an Item in < 10 Seconds (Persona: Léa)
1. Open the web app on desktop or mobile browser.
2. Click the central **"+" (Ajout Rapide)** button.
3. Select or snap a photo of a toaster.
4. Type name: `"Grille-pain"`, select room: `"Cuisine"`, category: `"Électroménager"`.
5. Leave all optional fields (price, warranty, brand) empty.
6. Click **Enregistrer** -> Item is created in < 50ms, confirmation toast appears with button *"Ajouter un autre"*.

### Scenario 2: Proactive Anti-Duplicate Detection (Fin des achats en double)
1. Open the Fast-Add modal.
2. Type in the name field: `"Rallonge"`.
3. Notice the real-time banner appearing beneath the input:
   > *⚠️ 1 objet similaire déjà possédé : "Rallonge 5m" dans Salon*
4. Click on the alert to view the existing item's picture and location without buying a duplicate.

### Scenario 3: Dressing Decluttering & Vinted Flagging
1. Navigate to the **Dressing** module (`/dressing`).
2. Toggle filter to **"Objets dormants" (Jamais portés)**.
3. Observe items flagged as forgotten at the bottom of the wardrobe.
4. Click on a sweater and update its status to **"À donner ou revendre"**.
5. The sweater moves to the decluttering list with its estimated resale value.

### Scenario 4: Household Collaboration ("Chez Nous")
1. Open Household settings, copy the 6-character invite code (e.g. `K9X2P4`).
2. In a second browser window (incognito), register as Marc and enter `K9X2P4`.
3. Marc immediately sees the shared household with all rooms and items added by Léa.

### Scenario 5: Dashboard & North Star Metric
1. Navigate to the **Tableau de Bord**.
2. Verify the North Star Metric card: **"Nombre total d'objets : X"**.
3. Verify the **Valeur globale pour assurance** calculation based on optional purchase prices.
4. Verify room completion bars (e.g., Salon: 12 objets, Cuisine: 18 objets).
