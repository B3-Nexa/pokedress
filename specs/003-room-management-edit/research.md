# Technical Research: Room Management & Editing

**Feature**: `003-room-management-edit`  
**Date**: 2026-10-30

## 1. Backend REST API for Rooms

### Decision
Ajouter deux endpoints dans `backend/src/routes/room.routes.ts` et `backend/src/controllers/room.controller.ts` :
1. `PATCH /api/rooms/:id` :
   - Reçoit `{ name?: string, icon?: string }`.
   - Valide que `name` est non vide (trim, min 1, max 60).
   - Vérifie que la pièce appartient à `req.user.householdId`.
   - Met à jour la pièce dans MongoDB et renvoie la pièce mise à jour avec son `item_count`.
2. `DELETE /api/rooms/:id` :
   - Vérifie que la pièce appartient à `req.user.householdId`.
   - Vérifie le nombre d'objets associés (`Item.countDocuments({ household_id: householdId, room_id: id })`).
   - Si `count > 0` : renvoie un code `400 Bad Request` avec `{ error: "Impossible de supprimer une pièce contenant des objets" }`.
   - Si `count === 0` : supprime la pièce et renvoie `200 OK` avec `{ message: "Pièce supprimée avec succès" }`.

### Rationale
- Respect des standards RESTful.
- Sécurisation stricte multi-tenants : aucun utilisateur ne peut modifier ou supprimer une pièce appartenant à un autre foyer.
- Intégrité des données : pas d'objets orphelins autorisés.

---

## 2. Frontend UI for Room Editing (`SettingsPage.tsx`)

### Decision
Remplacer la liste statique de badges `<span>{r.name}</span>` par une liste / grille de cartes interactives :
- Chaque carte affiche :
  - L'icône de la pièce (ex: 🛋️, 🍳, 🛏️, 🚿, etc.)
  - Le nom de la pièce
  - Le compteur d'objets (ex: « 3 objets »)
  - Bouton « Modifier » (icône crayon Edit2 / Pencil)
  - Bouton « Supprimer » (icône corbeille Trash2, désactivé ou préventif avec tooltip si des objets sont présents)
- Mode d'édition :
  - Édition inline fluide : quand l'utilisateur clique sur Modifier, la ligne se transforme en champ texte avec boutons "Valider" (Check) et "Annuler" (X), avec validation immédiate sur la touche Entrée.
  - Déclenche `api.updateRoom(id, { name })` puis `onHouseholdUpdated()`.

### Alternatives considered
- *Modale dédiée d'édition de pièce* : Rejeté au profit de l'édition inline, plus rapide (< 3s), sans friction de modale superflue.
