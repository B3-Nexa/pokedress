# Personas : inventaire du foyer

> Version 1.1 du 29/10/2026, construite à partir de [recherche-terrain.md](recherche-terrain.md). Elle est alignée sur la spec `specs/001-universal-containment/spec.md`, qui fait foi.
> Ce sont des **personas proto** : des archétypes fondés sur des données secondaires, pas encore sur des entretiens. Les prénoms, métiers, villes et citations sont **inventés** pour rendre le profil concret. Les chiffres « ancrage » renvoient aux sources de la recherche. À reprendre après 5 à 8 entretiens réels.
>
> **Vocabulaire** : on parle de **foyer** (les personnes qui partagent un logement : couple, colocation, famille), jamais de « couple ».

| | Persona | Rôle | Douleur n°1 | Fonctionnalité clé |
|---|---|---|---|---|
| 1 | **Léa, 28 ans** | **primaire** (déjà dans la vision) | foyer qui vient de se former, affaires mises en commun, doublons | inventaire partagé + anti-doublon |
| 2 | **Marc, 31 ans** | secondaire, autre membre du foyer de Léa | factures et garanties éparpillées, peu motivé pour saisir | saisie rapide, fiche enrichie *plus tard* |
| 3 | **Sarah, 25 ans** | secondaire, foyer d'une personne | dressing qu'elle ne connaît pas, rachète ce qu'elle a | catégorie Dressing + recherche en magasin |
| — | **Anti-personas** | hors cible | — | ce qu'on refuse de construire |

---

## 1. Léa, 28 ans : « On a tout en double et je ne sais pas ce qu'on a »

**Persona primaire.** Chaque arbitrage se fait d'abord pour elle.

| | |
|---|---|
| **Situation** | Chargée de communication, en CDI. Vient d'emménager avec Marc dans un T3 loué à Lyon, il y a 3 mois. Deux logements mis en commun dans un seul foyer. |
| **Équipement** | iPhone récent, utilise beaucoup les notes et les captures d'écran. A essayé un Google Sheets « affaires de l'appart » pendant le déménagement, abandonné au bout de 40 lignes. |
| **Rapport aux objets** | Achète vite, range par vagues. Garde « au cas où ». |

**Citation (fictive)**
> « On a deux aspirateurs, trois passoires, et j'ai racheté un pied de lampe qu'on avait déjà dans un carton à la cave. »

**Objectifs**
- Savoir enfin ce qu'il y a dans le logement, pour tout le foyer.
- Décider quoi garder, donner ou revendre parmi les doublons.
- Arrêter de racheter des choses que le foyer possède déjà.

**Frustrations**
- Le tableur : trop long, incohérent (« câble », « cable HDMI », « HDMI 2m »…), sans photo.
- Marc ne participe pas à ce genre de corvée. Un inventaire tenu par un seul membre du foyer reste incomplet.
- Les cartons du déménagement ne sont toujours pas tous ouverts.

**Moments d'usage**
1. **Le grand rangement** : un week-end, pièce par pièce, 50 à 100 objets d'affilée. → *ajout enchaîné (« ajouter un autre objet », spec US1), pièce et catégorie gardées d'un objet à l'autre.*
2. **Avant un achat**, en ligne ou en magasin : « est-ce qu'on a déjà… ? » → *recherche instantanée (FR-011).*
3. **Au fil de l'eau** : un nouvel achat, ajouté en rentrant. → *ajout en moins de 10 s.*

**Ce qui la ferait abandonner**
- Plus que les 3 champs obligatoires de la spec (nom, pièce, catégorie) à chaque objet.
- Le partage payant alors que l'inventaire concerne tout le foyer (écarté : gratuit jusqu'à 2 membres).
- Ne voir aucun bénéfice avant la 50e saisie.

**Ancrage terrain**
- Les 25-34 ans sont la tranche qui déménage le plus (INSEE) : Léa est en plein dedans.
- 54 % déclarent des doublons quand deux personnes emménagent ensemble (sondage américain de 2010, à revérifier).
- Voir un objet qu'on possède déjà réduit l'intention d'acheter (Raffaelli & Liu, 2024).

**Hypothèses à valider en entretien**
- [ ] Plus de la moitié des foyers récemment formés citent spontanément un doublon.
- [ ] Le grand rangement post-emménagement existe vraiment, et ce n'est pas un rangement étalé sur des mois.
- [ ] Les autres membres du foyer acceptent de contribuer si l'ajout est très rapide.

---

## 2. Marc, 31 ans : « Je veux bien, si ça prend 5 secondes »

**Persona secondaire.** C'est le deuxième membre du foyer. Sans lui, le partage ne vaut rien.

| | |
|---|---|
| **Situation** | Technicien réseau. Partage le foyer de Léa. A apporté l'essentiel du high-tech et de l'outillage. |
| **Équipement** | Android, beaucoup de mails de commande en ligne, factures en PDF éparpillées dans sa boîte mail. |
| **Rapport aux objets** | Peu d'objets mais chers : PC, console, écran, perceuse, vélo. Connaît les numéros de série « quelque part ». |

**Citation (fictive)**
> « Le jour où l'écran tombe en panne, je sais que la facture existe. Je ne sais juste pas où. »

**Objectifs**
- Retrouver une facture ou une date d'achat en cas de panne (garantie légale de 2 ans).
- Pouvoir prouver ce qu'il possède en cas de vol.
- Ne pas passer ses soirées à remplir une app.

**Frustrations**
- Les factures sont noyées dans les mails, les tickets de caisse effacés ou perdus.
- Les applis qui demandent tout d'un coup : marque, modèle, prix, date…
- Être « obligé » d'utiliser l'app de Léa.

**Moments d'usage**
1. **Ajout minimal** quand Léa lui demande : nom, pièce, catégorie, rien d'autre.
2. **Enrichissement ciblé** plus tard, uniquement sur les objets chers : photo de la facture, prix, date, garantie (champs facultatifs, FR-003). → *« compléter plus tard », jamais pendant l'ajout.*
3. **Urgence** : une panne ou un vol, il cherche une fiche précise.

**Ce qui le ferait abandonner**
- Un formulaire long dès le départ.
- Une inscription laborieuse pour rejoindre le foyer (la spec prévoit un code à 6 caractères et moins de 30 s, SC-006).
- Des notifications insistantes pour « compléter son inventaire ».

**Ancrage terrain**
- C'est l'assuré qui doit prouver l'existence des biens volés ; environ 218 000 cambriolages de logements en 2024.
- La garantie légale exige une preuve d'achat datée ; les vendeurs la passent sous silence au profit des extensions payantes (DGCCRF, UFC).
- Même aux États-Unis, seule la moitié des propriétaires ont un inventaire : la peur du vol ne suffit pas à faire agir.

**Hypothèses à valider en entretien**
- [ ] Le deuxième membre du foyer ajoute au moins 10 objets la première semaine si l'ajout prend moins de 10 s.
- [ ] La photo de facture est une raison de revenir dans l'app (rétention).
- [ ] Marc (ou son équivalent réel) ne paierait pas, mais ne bloque pas Léa si le partage est gratuit.

---

## 3. Sarah, 25 ans : « J'ai rien à me mettre » (avec un placard plein)

**Persona secondaire.** C'est la porte d'entrée par la catégorie Dressing, là où se trouve le volume d'objets, et donc le **déclencheur du premium**.

| | |
|---|---|
| **Situation** | Assistante RH, foyer d'une personne : premier appartement seule (T1 à Bordeaux), depuis un an. |
| **Équipement** | Smartphone, Instagram, TikTok, Vinted installé (2 ventes en un an). |
| **Rapport aux objets** | Achète souvent des vêtements, petits prix, en ligne. Estime avoir « une soixantaine de pièces ». En réalité, plutôt le double. |

**Citation (fictive)**
> « J'ai racheté un jean noir droit. J'en avais déjà un, avec l'étiquette. »

**Objectifs**
- Voir son dressing en entier, pas seulement le devant de la penderie.
- Vérifier en magasin si elle a déjà une pièce similaire.
- Repérer ce qu'elle ne porte jamais et le mettre en vente.

**Frustrations**
- Les applis de dressing : détourage photo raté, lenteurs, trop de champs (marque, saison, matière…).
- Mettre en vente sur Vinted prend du temps, et elle ne sait pas quel prix fixer.
- Ne pas savoir ce qu'elle a vraiment.

**Moments d'usage**
1. **Tri du placard** : 1 à 2 h, 100 pièces et plus, toutes dans la catégorie « Dressing & Vêtements ». → *ajout enchaîné avec la catégorie et la pièce gardées ; type, couleur et saison restent facultatifs.*
2. **En magasin**, devant un article : recherche « jean noir ». → *résultat en photos, immédiat (spec US3).*
3. **Tri saisonnier** : passer des pièces en « dormant » ou « à revendre » (FR-006).

**Le mur des 100 objets (décision du 29/10/2026 : assumé)**
Le dressing de Sarah fait passer son foyer au-dessus de 100 objets pendant son premier tri. On assume ce **mur comme déclencheur du premium** : c'est le moment où elle est la plus investie et ne veut pas repartir de zéro.
Ce qui doit être vrai pour que le mur convertisse au lieu de faire fuir :
- elle a déjà vu la valeur avant le mur (par exemple l'écart entre le nombre de pièces estimé et le nombre réel) ;
- rien de ce qu'elle a saisi n'est perdu ni bloqué en lecture ;
- le message au moment du mur est clair sur ce qu'elle gagne en passant premium.

**Ce qui la ferait abandonner**
- Un mur qui bloque l'accès à ses objets déjà saisis, ou qui tombe sans prévenir.
- Un détourage automatique imposé et raté.
- Devoir remplir type, couleur et taille pour chaque pièce.

**Ancrage terrain**
- Plus de la moitié des vêtements stockés ne sont jamais portés (ADEME, 2025).
- 78 pièces déclarées contre 172 constatées en revue de placard (ADEME via NECI, à vérifier).
- 42 articles textiles neufs achetés par personne et par an (Re_Fashion 2024).
- 17 % seulement ont déjà revendu ; les freins sont le temps et le prix (OpinionWay / Leboncoin, 2025).

**Hypothèses à valider en entretien**
- [ ] L'écart entre le nombre de pièces estimé et le nombre réel surprend la personne (déclic d'activation).
- [ ] Elle ouvrirait l'app en magasin (à tester en situation réelle, pas sur déclaratif).
- [ ] Saisir 100 vêtements en moins de 30 minutes est acceptable.
- [ ] Au mur des 100 objets, elle envisage de payer plutôt que d'abandonner (à mesurer : taux de conversion au mur et taux d'abandon au mur).

---

## Anti-personas : pour qui on ne construit pas

**Le chercheur d'objets.** « Où est mon tournevis ? » Il veut localiser précisément chaque objet (étagère, boîte, tiroir). La vision exclut explicitement ce besoin.
Point de vigilance : la spec modélise un niveau « contenant » facultatif (pièce > meuble > objet, FR-004). Il doit le rester, sinon on glisse vers une app de localisation et chaque saisie s'alourdit.

**Le perfectionniste du tableur.** Il veut 15 champs, des codes-barres, des exports CSV détaillés et des valeurs à l'euro près. C'est l'utilisateur de Sortly. Concevoir pour lui casserait la règle des 10 secondes, qui est notre seule différenciation.

**L'assuré anxieux** (cible secondaire, pas MVP). Il ne veut qu'un PDF pour son assureur. Il fera son inventaire une fois puis ne reviendra jamais, donc il ne nourrit pas la North Star Metric. On le sert par l'export, sans orienter le produit vers lui.

---

## Personas × fonctionnalités

● indispensable · ○ utile · — sans intérêt

| Fonctionnalité (réf. spec) | Léa | Marc | Sarah |
|---|:-:|:-:|:-:|
| Ajout rapide : nom + pièce + catégorie, photo facultative (US1, FR-001) | ● | ● | ● |
| Ajout enchaîné, « ajouter un autre objet » (US1) | ● | — | ● |
| Vue par pièce et par catégorie (US2) | ● | ○ | ○ |
| Recherche « est-ce que je l'ai déjà ? » (US3, FR-011) | ● | ○ | ● |
| Alerte doublon à la saisie (US3, FR-005) | ● | ○ | ○ |
| Partage du foyer par code (US5, FR-007/008) | ● | ● | — |
| Catégorie Dressing enrichie : statut porté, dormant, à revendre (US4, FR-006) | ○ | — | ● |
| Photo de facture, date, garantie, facultatives (FR-003) | ○ | ● | — |
| Prix et valeur totale (US6, FR-010) | ○ | ○ | ○ |
| Export PDF assurance (US6) | — | ○ | — |

**Lecture**
- Le **socle commun** aux trois personas : ajout rapide, ajout enchaîné, recherche. C'est le cœur du MVP.
- Le **partage** est indispensable dès que le foyer compte plus d'une personne. Il est **gratuit jusqu'à 2 membres** (décision du 29/10/2026), donc le foyer de Léa et Marc n'a pas à payer pour partager.
- Les critères d'acceptation correspondants sont dans [criteres-acceptation.md](criteres-acceptation.md).
- Le **dressing** n'est pas un module à part : c'est la catégorie « Dressing & Vêtements » (FR-012) avec des champs en plus, et il passe par le même ajout rapide.
