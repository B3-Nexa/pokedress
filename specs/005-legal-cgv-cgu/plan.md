# Implementation Plan: Textes Juridiques (CGV, CGU, Mentions Légales, RGPD) et Footer Intégré

**Branch**: `005-legal-cgv-cgu`
**Feature Directory**: `specs/005-legal-cgv-cgu`
**Status**: Ready for Implementation

## Technical Architecture & Design Decisions

### 1. Organisation du Contenu Juridique (`frontend/src/content/legalData.ts`)
- Découpage modulaire et typé des 4 documents juridiques obligatoires :
  1. **CGV (Conditions Générales de Vente)** : Tarifs (Gratuit 100 objets / 2 membres, Premium 3,99 €/mois ou 29,99 €/an TTC), précision du simulateur de paiement sans débit réel, droit de rétractation légal (14 jours), résiliation libre en 1 clic.
  2. **CGU (Conditions Générales d'Utilisation)** : Gestion du foyer, règle constitutionnelle sacralisée de non-verrouillage en lecture des objets, obligations de l'utilisateur.
  3. **Mentions Légales** : Identification de l'éditeur PokeDress, hébergement Cloud, directeur de publication et contact assistance.
  4. **Politique de Confidentialité (RGPD)** : Finalités des traitements, données collectées (inventaire, estimations, photos de justificatifs), engagement de non-revente à des tiers, droits d'accès, de rectification et d'effacement.

### 2. Composant Modale Juridique (`frontend/src/components/legal/LegalModal.tsx`)
- Navigation par onglets fluides : `cgv` | `cgu` | `mentions` | `rgpd`.
- En-tête persistant avec bouton de fermeture et sélection directe de document.
- Hauteur bornée (`max-h-[92vh] sm:max-h-[90vh]`) et défilement autonome (`flex-1 overflow-y-auto`).
- Typographie soignée avec bannières de mise en avant (Simulateur de test, Garantie de lecture).

### 3. Composant Footer Interactif (`frontend/src/components/layout/Footer.tsx`)
- Intégration dans la page principale (`App.tsx`) et sur la page de connexion (`AuthPage.tsx`).
- Responsive : disposition en grille/flex sur desktop, empilement propre sur smartphone.
- Marge basse de sécurité (`pb-24 md:pb-8`) pour éliminer tout conflit ou superposition avec la `BottomNav` mobile.

---

## Testing Strategy
- Validation de l'accessibilité des 4 onglets sans erreur TypeScript ni warning React.
- Test de non-régression de l'interface mobile (375px) : vérification de l'absence de chevauchement avec la barre d'action inférieure.
- Build Vite complet (`npm --prefix frontend run build`).
