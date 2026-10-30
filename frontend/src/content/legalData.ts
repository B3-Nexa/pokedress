export interface LegalSection {
  title: string;
  articles: Array<{
    number: string;
    title: string;
    content: string[];
    callout?: {
      type: 'info' | 'warning' | 'success';
      text: string;
    };
  }>;
}

export type LegalTabKey = 'cgv' | 'cgu' | 'mentions' | 'rgpd';

export const LEGAL_DOCUMENTS: Record<
  LegalTabKey,
  {
    title: string;
    shortTitle: string;
    badge: string;
    lastUpdated: string;
    sections: LegalSection[];
  }
> = {
  cgv: {
    title: 'Conditions Générales de Vente (CGV)',
    shortTitle: 'CGV',
    badge: 'Formules & Facturation',
    lastUpdated: '30 octobre 2026',
    sections: [
      {
        title: 'Dispositions Générales & Champ d’Application',
        articles: [
          {
            number: 'Article 1',
            title: 'Objet du Service',
            content: [
              'Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent les souscriptions aux offres de services proposées sur l’application PokeDress par la société éditrice.',
              'PokeDress est une application web et mobile d’inventaire du foyer et de gestion intelligente du dressing, permettant aux membres d’un foyer de répertorier, organiser, valoriser et suivre le cycle de vie de leurs biens matériels et de leurs vêtements.',
              'Toute souscription à un abonnement implique l’acceptation sans réserve des présentes CGV par le souscripteur.',
            ],
          },
          {
            number: 'Article 2',
            title: 'Offres & Tarifs en Vigueur',
            content: [
              'PokeDress propose deux niveaux de service pour les foyers :',
              '1. Formule Découverte (Gratuite) : Accès complet à l’inventaire jusqu’à 100 objets et 2 membres au sein du foyer. Cette formule est accessible sans limitation de durée et ne requiert aucune saisie de moyen de paiement.',
              '2. Formule PokeDress Premium : Objets et vêtements illimités, membres du foyer illimités, valorisation pour assurance exportable et support prioritaire.',
              'Tarifs de la formule Premium (TTC) :',
              '• Abonnement Mensuel : 3,99 € TTC par mois, sans engagement.',
              '• Abonnement Annuel : 29,99 € TTC par an (soit environ 2,50 € / mois, équivalent à 2 mois offerts et 37% d’économie par rapport à la mensualisation).',
            ],
          },
          {
            number: 'Article 3',
            title: 'Environnement Simulateur de Paiement Sécurisé (Mode Démonstration)',
            content: [
              'L’application PokeDress dispose à ce stade d’un simulateur de paiement factice (« Fake Checkout ») destiné à tester et valider l’expérience utilisateur.',
              'Aucune coordonnée bancaire réelle n’est prélevée. L’utilisation de la carte de test fournie (4242 4242 4242 4242) active instantanément la formule Premium pour le foyer sans générer aucun débit bancaire effectif.',
            ],
            callout: {
              type: 'info',
              text: '🛡️ Information Démonstrateur : Aucun débit bancaire réel n’est effectué sur votre compte bancaire. La saisie de coordonnées bancaires réelles est formellement proscrite.',
            },
          },
          {
            number: 'Article 4',
            title: 'Durée, Tacite Reconduction & Résiliation en 1 Clic',
            content: [
              'Les abonnements payants sont souscrits pour la période choisie (un mois ou un an) et sont reconductibles tacitement pour une durée équivalente.',
              'L’utilisateur peut résilier ou rétrograder son abonnement à tout moment directement depuis l’application (« Onglet Foyer / Paramètres > Gérer mon abonnement > Rétrograder en Gratuit »).',
              'La résiliation est immédiate et sans frais.',
            ],
            callout: {
              type: 'success',
              text: '⭐ Garantie constitutionnelle PokeDress : En cas de rétrogradation vers la formule gratuite, vos objets existants ne sont JAMAIS supprimés et restent consultables et modifiables en lecture permanente.',
            },
          },
          {
            number: 'Article 5',
            title: 'Droit de Rétractation Légal (14 jours)',
            content: [
              'Conformément aux articles L. 221-18 et suivants du Code de la consommation, vous disposez d’un délai de quatorze (14) jours calendaires à compter de la souscription pour exercer votre droit de rétractation sans avoir à motiver votre décision.',
              'La demande s’effectue par simple notification écrite auprès de notre support client : support@pokedress.fr.',
            ],
          },
          {
            number: 'Article 6',
            title: 'Responsabilité & Garantie',
            content: [
              'PokeDress met en œuvre tous les moyens raisonnables pour assurer la disponibilité du service 24h/24 et 7j/7.',
              'L’estimation de la valeur des biens pour l’assurance est fournie à titre purement indicatif sur la base des prix d’achat et des décotes déclarés par l’utilisateur, et ne saurait remplacer une expertise officielle agréée par les compagnies d’assurance.',
            ],
          },
        ],
      },
    ],
  },
  cgu: {
    title: 'Conditions Générales d’Utilisation (CGU)',
    shortTitle: 'CGU',
    badge: 'Utilisation & Foyer',
    lastUpdated: '30 octobre 2026',
    sections: [
      {
        title: 'Accès au Service & Respect du Foyer',
        articles: [
          {
            number: 'Article 1',
            title: 'Création de Compte et Code Foyer',
            content: [
              'L’accès aux fonctionnalités de PokeDress nécessite la création d’un compte personnel au moyen d’une adresse email valide et d’un mot de passe sécurisé.',
              'Un foyer correspond à un espace collaboratif partagé. Le créateur du foyer peut inviter d’autres membres (conjoint(e), colocataire, famille) en leur transmettant le code d’invitation unique à 6 caractères.',
              'Tout membre ayant rejoint un foyer dispose des droits d’ajout, de modification et d’organisation des objets de l’inventaire commun.',
            ],
          },
          {
            number: 'Article 2',
            title: 'Règle Constitutionnelle : Non-Verrouillage en Lecture',
            content: [
              'PokeDress garantit aux utilisateurs qu’aucun objet répertorié ne sera jamais supprimé arbitrairement, masqué ou rendu inaccessible.',
              'Si un foyer dépasse le plafond freemium de 100 objets ou résilie son abonnement Premium, l’intégralité des objets répertoriés reste accessible en consultation, en édition et en export. Seul l’ajout de nouveaux objets est suspendu jusqu’au réajustement ou réabonnement.',
            ],
            callout: {
              type: 'success',
              text: '🔒 Règle d’or PokeDress : Vos données d’inventaire vous appartiennent. Aucune perte de données n’intervient lors d’un changement de statut.',
            },
          },
          {
            number: 'Article 3',
            title: 'Obligations de l’Utilisateur & Contenus Partagés',
            content: [
              'L’utilisateur s’engage à renseigner des informations véridiques et à ne pas téléverser de photographies ou justificatifs d’achat portant atteinte aux droits de tiers, à l’ordre public ou aux bonnes mœurs.',
              'L’utilisateur demeure seul responsable des données qu’il partage au sein de son foyer.',
            ],
          },
          {
            number: 'Article 4',
            title: 'Propriété Intellectuelle',
            content: [
              'L’ensemble des marques, logos, graphismes, interfaces, photographies et technologies composant PokeDress sont protégés par le Code de la propriété intellectuelle.',
              'Toute reproduction, décompilation ou diffusion non autorisée est strictement interdite.',
            ],
          },
          {
            number: 'Article 5',
            title: 'Résiliation du Compte',
            content: [
              'L’utilisateur peut clôturer son compte à tout moment depuis son interface ou sur simple demande par email. La clôture entraîne la suppression définitive des données personnelles associées dans un délai de 30 jours.',
            ],
          },
        ],
      },
    ],
  },
  mentions: {
    title: 'Mentions Légales',
    shortTitle: 'Mentions Légales',
    badge: 'Informations Éditeur',
    lastUpdated: '30 octobre 2026',
    sections: [
      {
        title: 'Identification Légale & Hébergement',
        articles: [
          {
            number: '1',
            title: 'Éditeur de la Plateforme',
            content: [
              'La plateforme logicielle PokeDress est éditée par la société PokeDress SAS (société par actions simplifiée au capital de 10 000 €).',
              '• Siège social : 12 Avenue des Champs-Élysées, 75008 Paris, France',
              '• Numéro SIREN : 912 345 678 R.C.S. Paris',
              '• Numéro de TVA intracommunautaire : FR 12 912345678',
              '• Directeur de la publication : Le Responsable Produit PokeDress',
              '• Contact Support & Réclamations : support@pokedress.fr',
            ],
          },
          {
            number: '2',
            title: 'Hébergement de l’Application et des Données',
            content: [
              'L’infrastructure cloud, les serveurs d’application Node.js et les bases de données MongoDB sont hébergés au sein de l’Union Européenne :',
              '• Prestataire d’infrastructure Cloud : Cloud Hosting Services Europe',
              '• Localisation des centres de données : Francfort (Allemagne) et Paris (France)',
              '• Garantie de souveraineté : Les données ne font l’objet d’aucun transfert hors Union Européenne sans garanties adéquates.',
            ],
          },
          {
            number: '3',
            title: 'Service Client & Assistance',
            content: [
              'Notre service client est à votre disposition par courrier électronique à l’adresse : contact@pokedress.fr ou support@pokedress.fr.',
              'Une réponse est apportée sous 48 heures ouvrées pour les comptes gratuits, et sous 12 heures pour les foyers disposant de l’offre PokeDress Premium.',
            ],
          },
        ],
      },
    ],
  },
  rgpd: {
    title: 'Politique de Confidentialité & Données Personnelles (RGPD)',
    shortTitle: 'Confidentialité / RGPD',
    badge: 'Protection des Données',
    lastUpdated: '30 octobre 2026',
    sections: [
      {
        title: 'Protection de la Vie Privée & Règlement Général (UE 2016/679)',
        articles: [
          {
            number: 'Article 1',
            title: 'Données Personnelles Collectées',
            content: [
              'Dans le cadre de l’utilisation de PokeDress, nous collectons strictement les données nécessaires au bon fonctionnement de l’inventaire :',
              '• Données de compte : Nom, prénom, adresse email, mot de passe chiffré (bcrypt).',
              '• Données du foyer : Nom du foyer, code d’invitation partagé, rôles des membres.',
              '• Données d’inventaire : Nom des objets et vêtements, pièces, catégories, prix d’achat déclarés, dates de garantie, statut dressing, photos des objets et justificatifs d’achat téléversés.',
            ],
          },
          {
            number: 'Article 2',
            title: 'Finalités et Base Légale des Traitements',
            content: [
              'Les données collectées sont utilisées exclusivement pour :',
              '1. L’exécution du contrat de service : gestion de votre inventaire, calcul des statistiques du dressing et valorisation pour les assurances.',
              '2. La collaboration entre membres d’un même foyer.',
              '3. L’amélioration de l’ergonomie et la résolution des incidents techniques.',
              'PokeDress ne procède à AUCUNE vente, cession ou commercialisation de vos données personnelles ou de vos photos à des régies publicitaires ou tiers commerciaux.',
            ],
            callout: {
              type: 'info',
              text: '🔒 Engagement Zéro Revente : Vos données d’inventaire et vos photos de vêtements sont strictement privées. Elles ne sont ni partagées ni monétisées auprès de tiers.',
            },
          },
          {
            number: 'Article 3',
            title: 'Durée de Conservation & Sécurité',
            content: [
              'Vos données sont conservées pendant toute la durée active de votre compte.',
              'En cas d’inactivité continue supérieure à 24 mois, une alerte vous sera transmise avant archivage ou suppression.',
              'Sécurité : Les échanges sont chiffrés de bout en bout via protocole TLS 1.3 / SSL 256 bits, et les mots de passe sont hachés cryptographiquement.',
            ],
          },
          {
            number: 'Article 4',
            title: 'Vos Droits et Exercice du Droit à l’Oubli',
            content: [
              'Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants sur vos données personnelles :',
              '• Droit d’accès et de communication de vos données.',
              '• Droit de rectification des informations inexactes.',
              '• Droit à l’effacement (« Droit à l’oubli ») de votre compte et de l’ensemble des objets et photos associés.',
              '• Droit à la portabilité de vos données sous format structuré (JSON / CSV).',
              'Pour exercer ces droits, vous pouvez nous écrire à tout moment à : dpo@pokedress.fr ou support@pokedress.fr.',
            ],
          },
        ],
      },
    ],
  },
};
