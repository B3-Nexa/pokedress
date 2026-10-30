# Quickstart Validation: Room Management & Editing

**Feature**: `003-room-management-edit`  
**Date**: 2026-10-30

## Verification Scenarios

### Scenario 1: Modifier le nom d'une pièce
1. Accéder à l'onglet **Foyer**.
2. Dans la section **« Gérer les pièces »**, cliquer sur le bouton de modification (crayon) à côté de l'une des pièces (ex: « Salon »).
3. Modifier le nom en « Grand Salon » et valider (touche Entrée ou bouton de confirmation).
4. **Vérifier** :
   - Le nom est mis à jour immédiatement dans la liste.
   - En basculant vers l'onglet **Inventaire**, la pièce s'appelle désormais « Grand Salon » et ses objets sont intacts.
   - Les sélecteurs de pièce dans l'Ajout Rapide et l'Ajout Dressing affichent « Grand Salon ».

### Scenario 2: Supprimer une pièce vide
1. Créer une pièce de test (ex: « Grenier »).
2. Vérifier qu'elle a le badge « 0 objet ».
3. Cliquer sur l'icône de suppression (corbeille).
4. Confirmer la suppression.
5. **Vérifier** : La pièce est retirée de l'inventaire et des listes.

### Scenario 3: Protection contre la suppression d'une pièce avec objets
1. Repérer une pièce contenant au moins 1 objet (ex: « Cuisine »).
2. Cliquer sur l'icône de suppression (ou constater qu'elle est protégée).
3. **Vérifier** : Un message préventif indique que la pièce ne peut pas être supprimée tant qu'elle contient des objets.
