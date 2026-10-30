# Quickstart Validation: Dressing Dedicated Modal & Responsive Layout

**Feature**: `002-dressing-modal-responsive`  
**Date**: 2026-10-30

## Verification Scenarios

### Scenario 1: Ajout spécifique depuis le Dressing
1. Lancer l'application (`cd frontend && npm run dev`).
2. Se connecter ou accéder au foyer.
3. Se rendre sur l'onglet **Dressing**.
4. Cliquer sur **« Ajouter un vêtement »** (ou sur le bouton d'ajout en étant sur cet onglet).
5. **Vérifier** :
   - La modale s'intitule **« Ajouter un vêtement »** avec une identité visuelle dressing (icône 👗/👕, couleur violine/indigo élégante).
   - Aucun sélecteur de catégorie d'objet ménager n'est affiché (la catégorie `dressing_vetements` est implicite).
   - Les champs proposés sont adaptés aux vêtements : Type (T-shirt, Pantalon, Veste...), Taille, Marque, Statut dressing (Actif, Dormant, À revendre), Saison.
6. Remplir le nom « Veste en jean oversize », choisir Taille « M », Marque « Levi's », Statut « Actif ».
7. Cliquer sur « Enregistrer ».
8. **Résultat attendu** : Le vêtement est créé et apparaît immédiatement dans la galerie dressing avec ses badges.

### Scenario 2: Ajout enchaîné dans le dressing (< 5s)
1. Ouvrir la modale d'ajout dressing.
2. Saisir « Pull cachemire bleu », taille « L », marque « Uniqlo ».
3. Cliquer sur « + Enchaîner (< 5s) ».
4. **Vérifier** :
   - Le vêtement est sauvegardé et un toast de succès s'affiche.
   - Les champs de pièce, marque et saison sont conservés.
   - Le champ nom est vidé et reprend automatiquement le focus.
5. Saisir « Pull col roulé gris » et cliquer sur « Enregistrer ».
6. **Résultat attendu** : Les 2 pulls sont créés consécutivement sans avoir à re-sélectionner la pièce ou rouvrir la modale.

### Scenario 3: Responsive Desktop vs Mobile
1. Afficher l'application sur un écran large (> 1024px).
2. **Vérifier** :
   - L'application occupe confortablement la largeur (jusqu'à `max-w-7xl`).
   - La navigation se fait via les onglets dans la barre supérieure (`Navbar`).
   - La barre mobile flottante au bas de l'écran est masquée (`hidden md:block`).
   - Dans le Dressing, les vêtements s'organisent en grille à 3 ou 4 colonnes selon la largeur.
   - Les modales sont centrées avec une largeur adaptée (`max-w-xl`) et une belle ombre.
3. Réduire la largeur de la fenêtre à moins de 768px (mode mobile).
4. **Vérifier** :
   - La `BottomNav` réapparaît au bas de l'écran avec ses boutons tactiles.
   - Les grilles basculent en 1 colonne ergonomique.
