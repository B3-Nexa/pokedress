# Technical Research: Dressing Dedicated Modal & Responsive Layout

**Feature**: `002-dressing-modal-responsive`  
**Date**: 2026-10-30

## 1. Dressing Modal Architecture

### Decision
Créer un composant dédié `DressingAddModal.tsx` dans `frontend/src/components/dressing/` qui gère exclusivement la création rapide de vêtements, distinct de `FastAddModal.tsx`.

### Rationale
- **Séparation des préoccupations (SoC)** : `FastAddModal` est optimisé pour les objets ménagers génériques avec un sélecteur de pièces et de catégories transverses.
- **Expérience utilisateur (UX)** : Dans le dressing, demander à l'utilisateur de choisir parmi des catégories comme « Vaisselle & Cuisine » ou « Électroménager » est une friction inutile. La catégorie est verrouillée sur `dressing_vetements`.
- **Champs spécifiques du Dressing (Constitution Principe 4)** : Un vêtement nécessite des champs spécifiques (type de pièce : Haut, Pantalon, Robe, etc. ; taille : S/M/L/38/40... ; statut : actif / dormant / à donner ou revendre ; marque ; saison ; prix de revente estimé). Les regrouper dans une modale dédiée apporte une valeur immédiate.
- **Fast-Add (< 10s & < 5s enchaîné - Constitution Principe 1)** : La modale dressing intègre directement le mode d'ajout enchaîné avec conservation de la pièce et de la saison/marque pour scanner rapidement une penderie.

### Alternatives considered
- *Étendre `FastAddModal` avec des conditions `if (category === 'dressing_vetements')`* : Rejeté car cela complexifie `FastAddModal` avec une logique conditionnelle lourde, ralentit l'ajout générique d'autres objets, et ne résout pas la demande de l'utilisateur d'avoir une modale bien spécifique.
- *Forcer l'utilisateur à créer un objet vide puis l'enrichir via `ItemEnrichmentModal`* : Rejeté car cela casse le principe de friction minimale et oblige à faire 2 étapes distinctes.

---

## 2. Responsive Layout & Desktop Optimization

### Decision
1. **Élargissement du conteneur principal** :
   - Remplacer le `max-w-4xl` rigide dans `App.tsx` et `Navbar.tsx` par un conteneur responsive adaptatif `max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8`.
2. **Navigation Hybride Desktop / Mobile** :
   - **Sur Desktop (>= 768px - md/lg)** : Intégrer les liens de navigation (Inventaire, Dressing, Stats, Foyer) et un bouton d'ajout rapide directement dans la `Navbar` supérieure. Masquer la `BottomNav` flottante mobile (`hidden md:block` / `md:hidden`).
   - **Sur Mobile (< 768px)** : Conserver la `BottomNav` avec cibles tactiles >= 44px et bouton central d'ajout.
3. **Galerie Dressing en Grille Responsive** :
   - Remplacer le conteneur vertical `space-y-2` dans `DressingGallery.tsx` par une grille fluide `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`.
   - Adapter `ItemCard.tsx` pour offrir une présentation élégante aussi bien en mode carte de grille qu'en mode liste compacte.
4. **Grilles responsives sur Vue par Pièce / Dashboard** :
   - Dans `RoomGroupView`, organiser les pièces ou les objets de chaque pièce en grille sur grand écran (`md:grid-cols-2 lg:grid-cols-3`).
   - Dans `DashboardPage`, organiser les statistiques et graphiques en grille 2 à 3 colonnes sur desktop.

### Rationale
- L'utilisateur a explicitement exprimé le sentiment d'avoir un « pseudo téléphone sur mon PC ». La combinaison d'un `max-w-4xl` centré avec de gigantesques marges vides et d'une barre de navigation mobile flottante miniature au bas de l'écran crée ce rendu artificiel.
- Une top-bar sur desktop avec des grilles fluides `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` transforme l'application en une véritable web app desktop tout en conservant une expérience mobile native pour smartphone.

### Alternatives considered
- *Sidebar navigation fixe à gauche* : Rejeté pour l'instant car une top bar intégrée dans le header existant est plus naturelle pour l'architecture actuelle sans restructuration majeure du routeur.
- *Plein écran sans max-width (100% de la largeur)* : Rejeté sur les écrans ultra-larges (4K) car les lignes de texte deviendraient illisibles ; `max-w-7xl` (1280px) avec grilles 4 colonnes offre le ratio idéal de densité et lisibilité standard dans l'industrie.
