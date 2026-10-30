# Feature Specification: Fake Payment & Subscription Upgrade

**Feature Branch**: `004-fake-payment-subscription`

**Created**: 2026-10-30

**Status**: Ready for Planning

**Input**: User description: "integres une fausse page de paiement pour changer d'abo tsé, je te laisse gerer utilise spec-kit"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Présentation et sélection des plans d'abonnement (Priority: P1) 🎯 MVP

En tant qu'utilisateur PokeDress, lorsque je souhaite passer à un niveau supérieur ou que j'atteins les limites de mon foyer (100 objets ou 2 membres), je souhaite pouvoir consulter une page / modale claire comparant les offres (Gratuit vs PokeDress Premium), choisir mon cycle de facturation (mensuel ou annuel) et déclencher la souscription.

**Why this priority**: C'est le point d'entrée nécessaire pour comprendre la valeur du Premium et initier le changement d'abonnement.

**Independent Test**:
1. Accéder à l'application.
2. Cliquer sur le bouton « Passer en Premium » dans la barre supérieure (Navbar), dans la bannière du Dashboard ou dans la section Foyer des Paramètres.
3. Constater l'ouverture de la vue d'abonnement affichant le comparatif Gratuit vs Premium, le bouton de bascule Mensuel (3,99 €/mois) / Annuel (29,99 €/an) et le récapitulatif des avantages (objets illimités, membres illimités, exports assurance).

**Acceptance Scenarios**:

1. **Given** un utilisateur sur plan Gratuit, **When** il clique sur « Changer d'abonnement » ou « Passer en Premium », **Then** l'interface d'abonnement s'affiche avec la mise en avant des avantages du plan Premium.
2. **Given** l'utilisateur consulte les offres, **When** il bascule entre facturation mensuelle et annuelle, **Then** les prix et économies calculées (ex: « Économisez 20% - 2 mois offerts ») s'ajustent dynamiquement.
3. **Given** un foyer déjà en plan Premium, **When** l'utilisateur ouvre la gestion de l'abonnement, **Then** le badge « Abonnement Actif » est affiché avec la possibilité de revenir au plan Gratuit pour tester les deux sens de transition.

---

### User Story 2 - Simulateur de paiement sécurisé (Fake Checkout) (Priority: P2)

En tant qu'utilisateur, je souhaite renseigner des coordonnées bancaires factices sur une interface moderne et élégante (simulant Stripe / Checkout sécurisé) avec un bouton d'auto-complétion rapide pour démo (« Carte de test »), afin de valider la transaction sans contrainte technique ni frais réels.

**Why this priority**: Donne le rendu professionnel et réaliste d'une application SaaS commerciale prête pour la soutenance et le test utilisateur.

**Independent Test**:
1. Sélectionner l'offre Premium (mensuelle ou annuelle) et cliquer sur « Continuer vers le paiement ».
2. Cliquer sur le bouton magique « Remplir carte de test » : les champs (numéro de carte 4242..., date MM/AA, CVC 123, nom) se remplissent automatiquement.
3. Cliquer sur « Payer [Montant] € et activer mon offre ».
4. Constater l'animation de paiement sécurisé (< 2s) puis l'écran de félicitations confirmant l'activation immédiate du Premium.

**Acceptance Scenarios**:

1. **Given** l'utilisateur sur le formulaire de paiement, **When** il saisit ou auto-complète les coordonnées de carte, **Then** les masques de saisie (espaces tous les 4 chiffres, format date) s'appliquent proprement.
2. **Given** un formulaire valide, **When** l'utilisateur clique sur « Payer », **Then** un loader de transaction bancaire s'active pendant 1,5 seconde, puis le statut Premium est appliqué.
3. **Given** la confirmation affichée, **When** l'utilisateur clique sur « Retourner à mon foyer », **Then** l'interface principale reflète le plan Premium (badges dorés, bannières d'avertissement masquées, limites levées).

---

### User Story 3 - API Backend de gestion d'abonnement (Priority: P3)

En tant que système PokeDress, le backend doit exposer l'endpoint `POST /api/household/subscription` permettant de basculer le plan du foyer entre `free` et `premium` de manière persistante et sécurisée par token.

**Why this priority**: Garantit que le changement d'abonnement est persisté en base MongoDB et débloque réellement les quotas d'objets (`item.service.ts`) et de membres (`household.service.ts`).

**Independent Test**:
1. Envoyer une requête `POST /api/household/subscription` avec `{ "plan": "premium", "billing_cycle": "monthly" }`.
2. Vérifier que la réponse renvoie le foyer mis à jour avec `plan: "premium"`.
3. Vérifier qu'un foyer à 100 objets peut désormais ajouter un 101ème objet sans erreur `UPGRADE_REQUIRED`.

---

### Edge Cases

- **Utilisateur annulant la saisie de carte** : Possibilité de fermer ou revenir en arrière à tout moment sans modifier l'abonnement en cours.
- **Rétrogradation de Premium vers Gratuit** : Possible pour tester les deux cas de figure (avec confirmation claire). Si le foyer a plus de 100 objets, les objets existants restent 100% consultables (Principe constitutionnel 5).
- **Format mobile vs desktop** : La page de paiement et comparatif doit être parfaitement responsive (cartes en colonnes sur mobile, grille côte à côte sur PC/Mac).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le backend DOIT fournir une route `POST /api/household/subscription` acceptant `{ plan: 'free' | 'premium', billing_cycle?: 'monthly' | 'yearly' }` et mettant à jour le foyer correspondant au token authentifié.
- **FR-002**: Le client API frontend (`items.api.ts`) DOIT implémenter la méthode `updateSubscription(data)`.
- **FR-003**: Le frontend DOIT fournir un composant de page / modale dédié `SubscriptionModal.tsx` accessible depuis plusieurs points de contact (Navbar, Dashboard, Paramètres).
- **FR-004**: `SubscriptionModal.tsx` DOIT présenter un sélecteur Mensuel (3,99 €) / Annuel (29,99 €) et un comparatif clair des fonctionnalités Gratuit vs Premium.
- **FR-005**: Le composant DOIT intégrer un simulateur de paiement par carte bancaire avec logos Visa / Mastercard / CB, champ carte, expiration, CVC, et un bouton d'auto-remplissage « Remplir avec une carte de test ».
- **FR-006**: Une animation de paiement réussi (simulation 3D Secure) DOIT être affichée lors de la confirmation, suivie de l'actualisation globale des données de l'application (`loadData`).
- **FR-007**: Les bannières de plafond 100 objets et 90 objets DOIVENT être automatiquement masquées lorsque le foyer est Premium.
- **FR-008**: Un badge visuel « Premium » élégant DOIT s'afficher dans la Navbar et dans l'onglet Foyer lorsque le foyer est abonné.

### Key Entities

- **Household**: `{ id: string, name: string, invite_code: string, plan: 'free' | 'premium', billing_cycle?: 'monthly' | 'yearly' }`
- **SubscriptionPlan**: `{ id: string, name: string, priceMonthly: number, priceYearly: number, features: string[] }`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Le parcours de passage en Premium (ouverture -> clic carte de test -> confirmation) peut être réalisé en moins de 10 secondes en démonstration.
- **SC-002**: 100% des restrictions d'ajout d'objets au-delà de 100 sont immédiatement levées dès la confirmation.
- **SC-003**: L'affichage est 100% responsive sur mobile (< 768px) et desktop (>= 1024px).
- **SC-004**: Les tests d'intégration backend Vitest couvrent le nouvel endpoint d'abonnement avec 100% de réussite.

## Assumptions

- Il s'agit d'une simulation réaliste (fake checkout) pour la démo et soutenance du projet PokeDress : aucune passerelle bancaire externe réelle (Stripe en direct) n'est appelée.
- Le cycle de facturation et les prix retenus sont 3,99 € / mois et 29,99 € / an.
