# Technical Research: Fake Payment & Subscription Upgrade

**Feature**: `004-fake-payment-subscription`  
**Date**: 2026-10-30

## 1. Subscription & Payment Simulator UX

### Decision
Implémenter un composant modal/page interactif `SubscriptionModal.tsx` avec 3 étapes d'affichage :
1. **Étape 1 : Choix de la formule & Facturation** :
   - Bascule Mensuel (3,99 € / mois) vs Annuel (29,99 € / an - 2 mois offerts).
   - Carte comparative Gratuit (Actuel) vs PokeDress Premium.
   - Liste des fonctionnalités exclusives débloquées (Illimité, Multi-membres, Assurance, Dressing avancé).
   - Bouton « Passer à la caisse ».
2. **Étape 2 : Formulaire de paiement factice (Simulateur Stripe Checkout)** :
   - Interface bancaire soignée (badges CB, Visa, Mastercard, cadenas de sécurité SSL 256 bits).
   - Champs : Numéro de carte, Expiration, CVC, Nom sur la carte.
   - Bouton d'auto-remplissage « Remplir avec une carte de test » pour les démonstrations.
   - Simulation d'un délai de traitement réaliste (1,2s avec spinner bancaire).
3. **Étape 3 : Confirmation & Célébration** :
   - Écran de succès avec confettis / badge doré « PokeDress Premium Activé ».
   - Bouton « Profiter de mon foyer illimité ».

### Rationale
- Offre une expérience utilisateur crédible de SaaS B2C moderne.
- Permet de tester facilement les deux transitions (`free` -> `premium` et rétrogradation `premium` -> `free`) lors de soutenances ou de tests utilisateurs.
- Reste léger sans dépendance tierce à une passerelle de paiement réelle.

---

## 2. Backend Subscription API

### Decision
Créer la route `POST /api/household/subscription` dans `backend/src/routes/household.routes.ts` et `backend/src/controllers/auth.controller.ts` (ou `household.controller.ts`) :
- Valide le corps de requête : `{ plan: 'free' | 'premium', billing_cycle?: 'monthly' | 'yearly' }`.
- Met à jour le document `Household` en base MongoDB.
- Renvoie les informations actualisées du foyer et l'état de l'inventaire.

### Alternatives considered
- *Appeler une vraie API Stripe Sandbox* : Rejeté car cela exigerait des clés API secrètes Stripe externes, un webhook complexe et de la configuration réseau inutile pour un projet d'école/soutenance. Le simulateur intégré répond parfaitement aux besoins de démonstration.
