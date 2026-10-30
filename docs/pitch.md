# Pitch PokeDress

> Texte à dire à l'oral. Les chiffres viennent du [dossier projet](dossier-projet.md) ; les sources sont dans la [recherche terrain](recherche-terrain.md).

---

## Version longue (environ 2 min)

**L'accroche**
Si je vous demandais, là, maintenant, la liste de tout ce que vous avez chez vous : vos meubles, votre électroménager, votre high-tech, vos outils, votre déco, vos vêtements… vous pourriez la faire ?
Personne ne le peut. Et ça coûte : quand deux personnes emménagent ensemble, plus de la moitié se retrouvent avec des objets en double, surtout de l'électronique, de l'électroménager et des meubles.

**Le problème**
On ne sait pas ce qu'on possède. Alors :
- on rachète la rallonge, la perceuse ou le grille-pain qu'on avait déjà ;
- on oublie ce qu'on pourrait revendre : 86 % des foyers gardent des objets dont ils ne se servent plus ;
- le jour où la télé tombe en panne ou où l'on est cambriolé, on ne retrouve ni la facture, ni la garantie, ni la preuve qu'on possédait l'objet.

**Pourquoi personne ne l'a résolu**
Des solutions existent : le tableur Excel, les applis d'inventaire, les applis de dressing. Tout le monde les abandonne, pour la même raison : la saisie est trop longue.

**Notre solution : PokeDress**
*« Tout ce que vous possédez, inventorié en quelques photos et enfin visible en un coup d'œil. »*
Notre pari, c'est la vitesse : **moins de 10 secondes par objet**, quel qu'il soit. Trois champs (le nom, la pièce, la catégorie), une photo facultative, et l'ajout enchaîné garde la pièce et la catégorie d'un objet à l'autre. On fait la cuisine d'un trait, puis le salon, puis la cave.

**Pour qui**
Les jeunes actifs qui viennent d'emménager, seuls, en colocation ou à deux. C'est le seul moment où l'on manipule tous ses objets un par un, du canapé au tournevis.

**Ce que fait l'app**
- **Toute la maison, pièce par pièce et par catégorie** : meubles et déco, électroménager, vaisselle, high-tech, bricolage, loisirs, vêtements.
- **Fini les doublons** : pendant la saisie, l'app prévient : « Vous avez déjà une rallonge, dans le salon. » En magasin, on cherche et on voit en photo ce qu'on a déjà.
- **Les papiers au bon endroit** : prix, date d'achat, fin de garantie et notes s'ajoutent plus tard sur la fiche de l'objet, sans ralentir la saisie. La valeur totale du foyer se calcule toute seule, pour l'assurance.
- **Un dressing intégré** : les vêtements sont une catégorie à part entière, avec leurs statuts (porté, dormant, à revendre), pour savoir ce qui peut partir sur Vinted.
- **Un inventaire partagé** : tout le foyer contribue au même inventaire, avec un code à 6 caractères.

**Où on en est**
Le MVP est fonctionnel : back-end Node et TypeScript, front React pensé pour le mobile et adapté au desktop, MongoDB. Il est vérifié par 32 tests d'API et 35 parcours end to end, qui nous ont déjà fait trouver et corriger une faille de sécurité.

**Le modèle**
Freemium : gratuit jusqu'à 100 objets et 2 membres. Le premium débloque l'illimité, l'export pour l'assurance et les statistiques.
Notre levier, ce sont les **assureurs habitation**. En cas de cambriolage ou de dégât des eaux, c'est à l'assuré de prouver ce qu'il possédait, et les applis de la MAIF ou de la Macif n'ont pas d'inventaire. Nous voulons qu'ils offrent PokeDress à leurs assurés.

**Notre demande**
**115 000 € sur 12 mois**, calculés poste par poste, pour :
- valider l'usage auprès de vrais foyers ;
- lancer une première version publique ;
- signer un premier assureur pilote.

**La phrase de fin**
Le jour où on vous demandera ce que vous possédez, vous ne direz plus « je ne sais pas ». Vous ouvrirez PokeDress.

---

## Version courte (30 s)

On ne sait pas ce qu'on possède chez soi : meubles, électroménager, high-tech, outils, vêtements. Alors on rachète en double, on oublie ce qu'on pourrait revendre, et on perd factures et garanties. Les applis d'inventaire existent, mais tout le monde les abandonne parce que la saisie est trop longue. PokeDress inventorie n'importe quel objet en moins de 10 secondes, prévient avant d'acheter un doublon, garde factures et garanties, et se partage entre tous les membres du foyer. Le MVP est fonctionnel et testé. Nous demandons 115 000 € pour le lancer et signer un premier partenariat avec un assureur habitation.

---

## Chiffres à avoir en tête

| Chiffre | Ce qu'il montre | Source |
|---|---|---|
| 54 % se retrouvent avec jusqu'à 10 objets en double après avoir emménagé à deux ; électronique 42 %, électroménager 36 %, ustensiles 29 %, meubles 23 % | Les doublons touchent toute la maison | Sondage Kijiji, États-Unis, 2010 (**à citer avec prudence**) |
| 86 % des foyers gardent des objets inutilisés, environ 19 par foyer, d'une valeur d'environ 320 € | Il y a de la valeur qui dort | OpinionWay / Leboncoin, 2025 |
| Environ 218 000 cambriolages de logements en 2024 ; c'est à l'assuré de prouver ce qu'il possédait | L'intérêt de l'inventaire pour l'assurance | SSMSI (relayé), assureurs |
| 78 vêtements déclarés, 172 réellement possédés | On sous-estime ce qu'on a, même pour ce qu'on porte tous les jours | ADEME 2025 |

---

## Si le jury pose la question

- **« Vous avez interrogé des utilisateurs ? »** Pas encore. La Discovery repose sur des études et des données publiques (ADEME, INSEE, OpinionWay, Re_Fashion). Les entretiens sont la prochaine étape, et notre guide d'entretien est prêt.
- **« C'est une appli de dressing ? »** Non. C'est un inventaire de toute la maison. Le dressing est une catégorie parmi d'autres, simplement enrichie de statuts parce que c'est là qu'il y a le plus d'objets.
- **« D'où viennent les 115 000 € ? »** C'est un budget calculé poste par poste dans le dossier (équipe, design, hébergement, juridique, acquisition, 10 % d'imprévus). Ce sont des hypothèses de cadrage, à confirmer par des devis.
- **« Les assureurs, c'est validé ? »** Non, c'est notre hypothèse de partenariat principale. Nous l'avons choisie parce qu'en cas de vol, la preuve repose sur l'assuré, et que les applis d'assureurs que nous avons regardées n'ont pas d'inventaire.
- **« Et l'IA pour reconnaître les objets ? »** Prévue plus tard. Les concurrents qui l'utilisent se trompent souvent ; nous voulons d'abord prouver que la saisie rapide suffit.
