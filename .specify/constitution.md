# Household Inventory System (PokeDress) Constitution

Consultez la constitution officielle et ratifiée dans [.specify/memory/constitution.md](memory/constitution.md).

### Résumé des 5 Règles d'Or :
1. **Frictionless Fast-Add (< 10s)** : La saisie doit prendre moins de 10 secondes (Photo + Nom + Pièce + Catégorie). Champs optionnels légers pour éviter tout abandon.
2. **Household-First Collaboration ("Chez Nous")** : Modèle centré sur le Foyer (`household_id`). Léa et son conjoint partagent le même inventaire commun.
3. **Prévention active des doublons** : L'app répond à la question *"Qu'est-ce qu'on a déjà ?"* et détecte les doublons avant un rachat inutile.
4. **Cycle de vie & Dressing intelligent** : Suivi de l'usage des vêtements (actif, dormant / jamais porté, à donner / revendre).
5. **Typage strict & Qualité Test-First** : TypeScript, Zod, MongoDB, et tests automatisés sur la détection de doublons, les agrégations de valeur et l'isolation des foyers.
