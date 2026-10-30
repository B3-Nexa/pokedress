# Quickstart Validation: Fake Payment & Subscription Upgrade

**Feature**: `004-fake-payment-subscription`  
**Date**: 2026-10-30

## Verification Scenarios

### Scenario 1: Passer en Premium avec la carte de test
1. Lancer l'application et se connecter.
2. Cliquer sur le bouton **« ⭐ Passer en Premium »** dans la barre de navigation supérieure ou dans l'onglet **Foyer**.
3. **Vérifier** : La modale d'abonnement s'ouvre, présentant le comparatif Gratuit vs Premium.
4. Choisir la formule Annuelle (29,99 €) et cliquer sur « Continuer vers le paiement ».
5. Cliquer sur le bouton **« 💳 Remplir avec une carte de test »**.
6. Cliquer sur **« Payer 29,99 € et activer Premium »**.
7. **Vérifier** :
   - L'animation de traitement sécurisé s'affiche brièvement (~1,2s).
   - L'écran de félicitations s'affiche avec le récapitulatif.
   - En fermant, la Navbar affiche le badge doré **« ⭐ Premium »**.
   - Le foyer n'a plus de limite de 100 objets.

### Scenario 2: Rétrogradation pour test
1. Ouvrir à nouveau la modale d'abonnement.
2. Constater la mention « Votre foyer est actuellement en formule Premium ».
3. Cliquer sur « Revenir au plan Gratuit (mode test) ».
4. Confirmer : le foyer repasse en Gratuit sans perte de données.
