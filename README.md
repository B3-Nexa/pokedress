# 📦 PokeDress — Inventaire Universel du Foyer

> **L'inventaire du foyer sans prise de tête** : Conçu pour les ménages, couples et colocations pour en finir avec les rachats en double, valoriser leurs biens pour l'assurance, désencombrer leur dressing et savoir en 10 secondes ce qu'ils possèdent et où c'est rangé.

---

## 🚀 Fonctionnalités Clés (Vision Produit & Critères d'Acceptation)

1. **⚡ Saisie Ultra-Rapide (< 10s)** : Seuls 3 champs obligatoires (*Nom*, *Pièce*, *Catégorie*). Photo brute optionnelle sans détourage forcé (`[CA-1.1]` à `[CA-1.7]`).
2. **🔗 Mode Ajout Enchaîné (< 5s)** : Conserve automatiquement la pièce et la catégorie d'un ajout à l'autre pour cataloguer un carton ou une armoire d'un trait (`[CA-1.4]`, `[CA-1.5]`).
3. **🛡️ Détecteur Anti-Doublon en Temps Réel** : Alerte dès 2 lettres tapées (débouncée à 300ms, insensible à la casse et aux accents) pour éviter les achats inutiles (`[CA-3.1]` à `[CA-3.8]`).
4. **👗 Dressing & Garde-robe Enrichie** : Cycle de vie dédié aux vêtements (`actif`, `dormant`, `à donner ou revendre`) avec estimation de la valeur de revente en 1 clic (`[CA-4.1]` à `[CA-4.6]`).
5. **🏡 Espace Collaboratif ("Le Foyer")** : Code d'invitation unique à 6 caractères pour partager l'inventaire en direct (gratuit jusqu'à 2 membres) (`[CA-5.1]` à `[CA-5.8]`).
6. **📊 Tableau de Bord & Valorisation Assurance** : North Star Metric (total d'objets), décompte brut par pièce (sans barres de pourcentage anxiogènes), valorisation assurance (*"valeur estimée sur X objets sur Y"*), pré-alerte discrète à 90 objets et cap des 100 objets non bloquant en lecture (`[CA-6.1]` à `[CA-6.9]`).

---

## 🛠️ Stack Technique

- **Backend** : Node.js (v20+), TypeScript, Express, Mongoose, Zod (messages d'erreurs en français), Multer, Vitest.
- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS (Mobile-first 375px, cibles tactiles ≥ 44x44px), Lucide React.
- **Base de données** : MongoDB (local ou MongoDB Atlas).

---

## ⚡ Démarrage Rapide

### 1. Démarrer la base de données MongoDB locale (Docker)

```bash
docker compose up -d
```

- MongoDB sera accessible sur `mongodb://localhost:27017/pokedress`.
- L'interface d'administration Mongo Express sera disponible sur `http://localhost:8081`.

### 2. Démarrer le Backend (API Express)

```bash
cd backend
npm install
npm run dev
```

L'API démarre sur `http://localhost:5000`.

### 3. Démarrer le Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

L'application web est accessible sur `http://localhost:5173`.

---

## 🧪 Lancer la Suite de Tests Automatisés

La suite de tests unitaires et d'intégration couvre l'intégralité des spécifications et critères d'acceptation :

```bash
npm test --prefix backend
```

```
Test Files  7 passed (7)
     Tests  24 passed (24)
  Duration  ~6s
```

### Couverture des tests :
- `tests/unit/duplicate.service.test.ts` : Normalisation, suppression des accents/ponctuation, seuil ≥ 2 caractères.
- `tests/integration/fast-add.api.test.ts` : Saisie rapide < 100ms, upload de photos, plafond 100 objets et concurrence.
- `tests/integration/overview.api.test.ts` : Groupement par pièces, 5 pièces par défaut, règle 1 ligne = 1 objet.
- `tests/integration/duplicate.api.test.ts` : Détection en temps réel et recherche par nom d'objet et nom de pièce.
- `tests/integration/dressing.api.test.ts` : Statuts dressing, calcul du montant de revente, restrictions par catégorie.
- `tests/integration/household.api.test.ts` : Code foyer 6 caractères, tolérance casse/espaces, limite 2 membres gratuits.
- `tests/integration/dashboard.api.test.ts` : Métriques North Star, décompte par pièce, valorisation assurance, alerte 90 objets.

---

## 📁 Structure du Projet

```
pokedress/
├── backend/
│   ├── src/
│   │   ├── config/          # Connexion MongoDB et variables d'environnement
│   │   ├── controllers/     # Contrôleurs Express (Items, Rooms, Auth, Household, Dashboard)
│   │   ├── middleware/      # Auth JWT, Isolation du Foyer, Upload Multer, Gestion d'erreurs Zod
│   │   ├── models/          # Schémas Mongoose (Household, User, Room, Item, Container)
│   │   ├── routes/          # Définition des routes d'API REST
│   │   ├── schemas/         # Schémas de validation Zod en français
│   │   ├── services/        # Logique métier (Duplicate, Items, Household, Dashboard)
│   │   └── app.ts           # Application Express
│   └── tests/               # Tests Vitest (Unitaires et Intégration)
├── frontend/
│   ├── src/
│   │   ├── api/             # Client API Fetch typé avec gestion des tokens
│   │   ├── components/      # Composants UI (FastAdd, Inventory, Dressing, Dashboard, Layout)
│   │   ├── context/         # ChainedAddContext (conservation pièce et catégorie)
│   │   ├── hooks/           # Hook useDuplicateCheck (debounce 300ms)
│   │   ├── pages/           # Pages (Vue d'ensemble, Dressing, Dashboard, Foyer, Auth)
│   │   ├── types/           # Interfaces TypeScript du domaine
│   │   ├── utils/           # Compresseur d'images client (<200Ko) et normalisation
│   │   ├── App.tsx          # Composant racine avec gestion d'état et navigation
│   │   └── main.tsx         # Point d'entrée Vite
├── specs/                   # Spécifications Spec-Kit complètes (Spec, Plan, Tasks, Research, Data-Model)
├── docs/                    # Documents métier (Vision produit, Critères d'acceptation CA-0.1 à CA-6.9)
└── docker-compose.yml       # Stack locale MongoDB & Mongo Express
```

---

## 📜 Conformité aux Principes d'Architecture

- **Pas de détourage photo forcé par IA** : Les photos restent légères (<200Ko), brutes et rapides.
- **Règle absolue du décompte** : 1 enregistrement = 1 objet compté dans l'inventaire et pour le plafond freemium, même avec `quantity = 6` (les verres affichent "x 6").
- **Plafond non bloquant** : Au-delà de 100 objets, aucune consultation ni recherche n'est bloquée (`[CA-6.6]`).
