# Feature Specification: Textes Juridiques (CGV, CGU, Mentions Légales, RGPD) et Footer Intégré

**Feature Branch**: `005-legal-cgv-cgu`
**Created**: 2026-10-30
**Status**: Ready for Planning
**Input**: Rédaction des CGV (Conditions Générales de Vente), CGU (Conditions Générales d'Utilisation), Mentions Légales, Politique de Confidentialité / RGPD et intégration dans un Footer applicatif réactif avec modale de consultation.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultation des CGV et du cadre d'abonnement (Priority: P1) 🎯 MVP

En tant qu'utilisateur de PokeDress (foyer gratuit ou abonné Premium), je souhaite accéder aux Conditions Générales de Vente claires et détaillées, afin de comprendre les tarifs (3,99 €/mois ou 29,99 €/an), le droit de rétractation de 14 jours, les modalités d'annulation en un clic, et la garantie que le mode de paiement actuel est un simulateur de test sécurisé sans prélèvement bancaire réel.

**Why this priority**: Obligation légale pour tout service SaaS proposant des formules payantes ou freemium, et nécessaire pour rassurer l'utilisateur sur la sécurité de ses données et de ses cartes de test.

**Independent Test**: Ouvrir le lien CGV depuis le footer ou depuis la modale d'abonnement et vérifier l'affichage des clauses tarifaires, du droit de rétractation, de la résiliation libre et de la mention explicite du simulateur de test.

**Acceptance Scenarios**:
1. **Given** un utilisateur navigant sur PokeDress, **When** il clique sur "Conditions Générales de Vente (CGV)", **Then** la modale juridique s'ouvre sur l'onglet CGV avec le texte complet et lisible.
2. **Given** un utilisateur consultant les CGV, **When** il lit l'article relatif aux tarifs et aux transactions, **Then** il voit clairement la mention de la gratuité du plan de base (100 objets) et le caractère factice/simulateur de la carte de test sans débit bancaire réel.

---

### User Story 2 - Consultation des CGU, Mentions Légales et RGPD (Priority: P2)

En tant qu'utilisateur soucieux de la vie privée de son foyer, je souhaite consulter les CGU, les Mentions Légales et la Politique de Confidentialité pour connaître mes droits d'accès, de rectification et d'effacement de mes données (inventaires, photos, justificatifs d'achat) et la promesse stricte de non-revente de mes données.

**Why this priority**: Respect de la conformité RGPD européenne (articles 12, 13, 14, 17) et transparence totale sur l'utilisation des photos et estimations assurance du foyer.

**Independent Test**: Basculer entre les onglets "CGU", "Mentions Légales" et "Confidentialité & RGPD" dans la modale juridique et vérifier la présence des coordonnées de contact, des finalités de traitement et des droits des utilisateurs.

**Acceptance Scenarios**:
1. **Given** la modale juridique ouverte, **When** l'utilisateur clique sur l'onglet "Confidentialité & RGPD", **Then** les informations sur la conservation des données, l'hébergement sécurisé et le droit à l'oubli sont affichées.
2. **Given** l'utilisateur souhaitant contacter le support ou le délégué à la protection des données, **When** il consulte les Mentions Légales, **Then** il trouve l'adresse de contact (`support@pokedress.fr`), la mention de l'éditeur et l'hébergeur.

---

### User Story 3 - Footer réactif et accessible (Priority: P3)

En tant qu'utilisateur sur ordinateur ou sur mobile, je souhaite disposer d'un footer discret et élégant en bas de l'application, qui ne masque pas la barre de navigation mobile et reste accessible depuis toutes les vues principales.

**Why this priority**: Point d'ancrage ergonomique standard pour l'accès aux informations institutionnelles, juridiques et aux crédits du projet.

**Independent Test**: Vérifier sur format desktop (1280px) et mobile (375px) que le footer s'affiche correctement sans chevauchement avec la barre d'action inférieure (`BottomNav`).

**Acceptance Scenarios**:
1. **Given** un utilisateur sur smartphone, **When** il fait défiler une page jusqu'en bas, **Then** le footer s'affiche au-dessus de la zone de sécurité avec des marges adaptées évitant tout chevauchement avec la `BottomNav`.
2. **Given** un clic sur l'un des liens juridiques du footer, **When** la modale s'ouvre, **Then** l'onglet correspondant au lien cliqué est automatiquement sélectionné.

---

## Edge Cases

- **Écrans très étroits (320px - 375px)** : Les liens du footer doivent s'enrouler avec élégance (`flex-wrap`) sans déborder horizontalement.
- **Consultation de textes longs** : Le corps de la modale juridique doit défiler de façon indépendante avec une barre de défilement discrète, tout en gardant l'en-tête (onglets et bouton fermer) toujours accessible.
- **Accès depuis la page de connexion (AuthPage)** : Le footer doit être présent aussi bien pour un utilisateur authentifié que sur la page de connexion/création de compte.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT fournir les textes juridiques complets rédigés en français : CGV (Conditions Générales de Vente), CGU (Conditions Générales d'Utilisation), Mentions Légales et Politique de Confidentialité (RGPD).
- **FR-002**: Les CGV DOIVENT stipuler expressément les tarifs en vigueur (Gratuit à vie jusqu'à 100 objets / 2 membres, Premium à 3,99 €/mois ou 29,99 €/an TTC sans engagement), le droit de rétractation légal de 14 jours, et la mention explicite que les règlements bancaires effectués sur la plateforme relèvent d'un simulateur de test sécurisé sans prélèvement réel.
- **FR-003**: Les CGU DOIVENT réaffirmer le principe constitutionnel garantissant l'accès permanent en lecture à tous les objets du foyer, même en cas de dépassement du plafond freemium ou de résiliation du plan Premium.
- **FR-004**: La Politique de Confidentialité DOIT détailler les catégories de données collectées (emails, inventaires, photographies, factures) et garantir l'absence totale de vente de données à des tiers publicitaires.
- **FR-005**: Le composant `Footer` DOIT être intégré dans la mise en page globale de l'application (vue connectée et vue d'authentification) avec des liens directs vers chaque section juridique.
- **FR-006**: Le composant `LegalModal` DOIT permettre une consultation plein écran ou modale avec navigation fluide par onglets ("CGV", "CGU", "Mentions Légales", "Données & RGPD") et possibilité de fermer à tout moment.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% des documents obligatoires (CGV, CGU, Mentions Légales, RGPD) sont consultables en moins de 2 clics depuis n'importe quelle vue de l'application.
- **SC-002**: Zéro chevauchement visuel entre le footer et la `BottomNav` sur les résolutions mobiles (largeur 375px à 430px).
- **SC-003**: Clarté juridique totale : 100% des mentions relatives au simulateur de carte factice et à la non-débition bancaire sont explicites et sans ambiguïté.
- **SC-004**: Temps de chargement de la modale juridique instantané (< 100ms) sans appel réseau supplémentaire (textes intégrés statiquement et optimisés).

---

## Assumptions

- Les textes juridiques adoptent les formules types adaptées à une startup SaaS française en cours de déploiement et précisent la nature démonstrative/pédagogique du simulateur de paiement.
- Les données juridiques sont rédigées en conformité avec le droit de la consommation français (L. 221-18 et suivants) et le RGPD (Règlement UE 2016/679).
