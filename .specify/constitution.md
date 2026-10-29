# Household Inventory System (PokeDress) Constitution

Consultez la constitution officielle et ratifiée dans [.specify/memory/constitution.md](memory/constitution.md).

### Résumé des Principes Directeurs (v2.1.0) :
1. **Frictionless Fast-Add (< 10s)** : 3 champs obligatoires seulement (`nom`, `pièce`, `catégorie`). Photo **facultative** (sans détourage imposé). Mode ajout enchaîné conservant la pièce et la catégorie d'un objet à l'autre.
2. **Household-First ("Le Foyer")** : Vocabulaire centré sur le Foyer (`household_id`) : couple, colocation, famille ou personne seule. Partage inclus jusqu'à 2 membres en gratuit.
3. **Prévention active des doublons** : Répond à la question *"Qu'est-ce qu'on a déjà chez nous ?"* et alerte avant tout rachat inutile.
4. **Dressing = Catégorie enrichie** : Cycle de vie des vêtements (actif, dormant / jamais porté, à donner / revendre sur Vinted).
5. **Mur des 100 objets non bloquant en lecture** : Au-dessus de 100 objets (freemium), la consultation et la recherche restent toujours 100% accessibles.
6. **Typage strict & Qualité Test-First** : TypeScript, Zod, MongoDB, et tests automatisés.
