# Vision produit : application d'inventaire du foyer

> Projet de cours : un logiciel capable d'inventorier tout ce qu'on possède chez nous (meubles, objets, dressing…).

---

## 1. Le problème

### Quel problème réel résolvons-nous ?

**On ne sait pas ce qu'on possède.**

Au fil des années, un foyer accumule des centaines d'objets : meubles, électroménager, high-tech, vêtements, outils, déco. Personne n'en a de vue d'ensemble, et cela coûte concrètement :

- **Achats en double** : on rachète un objet qu'on avait déjà (une rallonge, un pull noir, un outil).
- **Dressing sous-exploité** : des vêtements oubliés au fond de l'armoire, jamais portés, jamais revendus.
- **Informations éparpillées** : factures, dates d'achat et garanties perdues entre les mails, les tiroirs et les photos du téléphone.
- *(Secondaire)* **Valeur inconnue** : on ne sait pas combien vaut ce qu'on possède. Utile pour l'assurance, mais ce n'est pas le cœur du problème.

### La douleur spécifique et impactante

> *« Je ne peux pas répondre à la question "qu'est-ce que j'ai chez moi ?" »*

**Pourquoi ce choix ?** L'objectif n'est pas de localiser les objets dans la maison, mais d'avoir un **inventaire complet**. Le problème est donc centré sur la **connaissance** de ses biens, pas sur le rangement ni sur leur valeur. Les achats en double restent un impact concret et mesurable.

---

## 2. La cible

### Pour qui ?

| | Description |
|---|---|
| **Cible prioritaire (MVP)** | Jeunes actifs de 25 à 40 ans dont le foyer vient de se former : emménagement seul, en colocation ou à plusieurs. À l'aise avec le mobile, ils accumulent rapidement des biens. |
| **Cibles secondaires** | Familles (beaucoup d'objets, plusieurs personnes), propriétaires (biens de valeur à assurer), passionnés de mode (dressing important). |

### Persona

> **Léa, 28 ans**, vient de former un nouveau foyer. Ses affaires et celles de Marc, l'autre membre du foyer, ont été mises en commun : ils ne savent plus ce qu'ils ont en double, et elle a déjà racheté des vêtements qu'elle possédait. Elle aimerait enfin savoir ce que le foyer possède vraiment.
>
> Personas détaillées : [docs/personas.md](docs/personas.md).

### Pourquoi cette cible ?

- Le moment où l'on **emménage** est un déclencheur naturel : on manipule tous ses objets, donc l'effort de saisie paraît logique.
- Le **foyer** (toutes les personnes qui partagent le logement) justifie le partage d'un inventaire commun, ce qui correspond au « chez nous ».
- Ces utilisateurs sont **faciles à atteindre** pour un projet de cours (entourage, réseaux sociaux, groupes étudiants et jeunes actifs).

---

## 3. La proposition de valeur

### Quelle solution ?

> **« Tout ce que vous possédez, inventorié en quelques photos et enfin visible en un coup d'œil. »**

### Bénéfices clés

1. **Vue d'ensemble** : un inventaire complet, pièce par pièce et par catégorie (meubles, électroménager, dressing…).
2. **Fin des doublons** : avant un achat, on vérifie si on a déjà l'objet.
3. **Dressing intégré** : voir ses vêtements, repérer ceux qu'on ne porte pas, identifier ce qu'on pourrait revendre.
4. **Inventaire partagé** : tout le foyer contribue au même inventaire.
5. *(Optionnel)* **Valeur des objets** : l'utilisateur peut renseigner un prix s'il le souhaite, pour obtenir la valeur totale du foyer (utile pour l'assurance).

**Pourquoi la valeur est optionnelle ?** Demander un prix à chaque ajout alourdit la saisie, alors que la rapidité est notre différenciation. Un champ facultatif garde la saisie légère tout en laissant cette possibilité à ceux qui en ont besoin.

### Le bénéfice unique

**La rapidité de saisie.** Le vrai concurrent, c'est le tableur Excel ou les notes du téléphone, que tout le monde abandonne parce que c'est trop fastidieux. Si ajouter un objet prend 5 secondes (photo, nom, catégorie suggérée), l'inventaire devient faisable.

**Pourquoi miser là-dessus ?** Le principal risque d'une app d'inventaire, c'est que l'utilisateur **abandonne avant d'avoir fini**, et un inventaire incomplet n'a aucune valeur. Toute la proposition de valeur doit donc réduire l'effort de saisie. C'est l'hypothèse la plus risquée du projet, donc celle à valider en priorité.

---

## 4. Les critères de succès

### Métriques d'apprentissage

| Hypothèse | Métrique | Seuil de validation |
|---|---|---|
| Les gens ont vraiment ce problème | % d'interviewés ayant déjà racheté un objet en double | > 50 % |
| La saisie est assez rapide | Temps moyen pour ajouter un objet | < 10 secondes |
| Les gens vont au bout | Nombre d'objets saisis la première semaine | > 30 objets |
| L'app reste utile après l'inventaire | % d'utilisateurs actifs à 30 jours | > 20 % |

> Ces seuils sont des objectifs de départ à justifier et à ajuster après les premiers tests. Pour des données de marché sourcées, prévoir une recherche ou un questionnaire.

### Funnel AARRR

| Étape | Question | Métrique |
|---|---|---|
| **Acquisition** | Comment nous trouvent-ils ? | Téléchargements / inscriptions par canal (réseaux sociaux, bouche-à-oreille, partenariats) |
| **Activation** | Vivent-ils le « déclic » ? | % d'utilisateurs qui finissent l'inventaire d'une pièce complète |
| **Rétention** | Reviennent-ils ? | % d'utilisateurs actifs à 7 et 30 jours, objets ajoutés par mois |
| **Referral** | En parlent-ils ? | % de foyers qui invitent un deuxième membre |
| **Revenue** | Paient-ils ? | Taux de conversion gratuit → premium |

### North Star Metric

**Le nombre d'objets inventoriés par foyer actif.** Elle mesure directement la valeur reçue : plus l'inventaire est complet, plus l'app est utile.

### Impact business : modèle de revenus

**Freemium**

- **Gratuit** : jusqu'à environ 100 objets, un seul utilisateur.
- **Premium (abonnement mensuel)** : objets illimités, partage au sein du foyer, export PDF de l'inventaire, statistiques du dressing.

**Pourquoi le freemium ?** L'utilisateur doit d'abord constater l'utilité de l'app avant de payer. La limite d'objets est naturelle : après 100 objets saisis, il est investi et ne veut plus repartir de zéro. Le partage et l'export ont une forte valeur perçue, donc logiques à faire payer.

**Perspective B2B** : partenariat avec des **assureurs habitation**, pour les utilisateurs qui choisissent de renseigner la valeur de leurs objets.

---

## Questions ouvertes

1. **Mobile ou web ?** L'inventaire se fait en photographiant les objets, donc le mobile-first semble logique (React Native ou PWA). À trancher lors de l'architecture.
2. **IA (reconnaissance d'objets par photo) dès le MVP ?** Très différenciant mais complexe. On peut d'abord simuler avec une saisie manuelle rapide.
3. ~~**Le dressing : fonctionnalité ou module séparé ?**~~ Tranché le 29/10/2026 : c'est une **catégorie enrichie**, pas un module à part (voir `docs/decisions.md`).