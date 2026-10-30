import { PASSWORD, uniqueEmail } from '../support/commands';

// F-01, F-02 : inscription, connexion, déconnexion
describe('Compte : inscription, connexion, déconnexion', () => {
  it("s'inscrit en créant un foyer et arrive sur l'inventaire avec 5 pièces par défaut [CA-5.1, CA-2.5]", () => {
    const email = uniqueEmail('lea');
    cy.visit('/');
    cy.contains('button', 'Créer un compte').click();
    cy.get('input[placeholder="ex: Alex ou Marc"]').type('Léa');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(PASSWORD);
    cy.get('input[placeholder="Mon Foyer"]').clear().type('Chez Léa');
    cy.contains('button', "Commencer l'inventaire").click();

    cy.contains('Vue par Pièce').should('be.visible');
    cy.get('header').should('contain', 'Chez Léa');
    cy.get('header')
      .contains('Code :')
      .parent()
      .find('.font-mono')
      .invoke('text')
      .should('match', /^[A-Z0-9]{6}$/);
    ['Salon', 'Cuisine', 'Chambre', 'Salle de bain', 'Cave/Garage'].forEach((room) => {
      cy.contains('h3', room).should('be.visible');
    });
  });

  it('se déconnecte puis se reconnecte avec son email et son mot de passe', () => {
    cy.apiRegister({ name: 'Marc' }).then((session) => {
      cy.visitAs(session.token);
      cy.goToTab('Foyer');
      cy.contains('button', 'Se déconnecter').click();
      cy.contains('button', 'Se connecter').should('be.visible');
      cy.window().its('localStorage').invoke('getItem', 'pokedress_token').should('be.null');

      cy.get('input[type="email"]').type(session.user.email);
      cy.get('input[type="password"]').type(PASSWORD);
      cy.get('form').contains('button', 'Connexion').click();
      // Remarque : l'app rouvre le dernier onglet utilisé (ici « Foyer »), pas l'inventaire
      cy.get('header').should('contain', session.household.name);
      cy.goToTab('Inventaire');
      cy.contains('Vue par Pièce').should('be.visible');
    });
  });

  it('refuse un mauvais mot de passe', () => {
    cy.apiRegister({ name: 'Sarah' }).then((session) => {
      cy.visit('/');
      cy.get('input[type="email"]').type(session.user.email);
      cy.get('input[type="password"]').type('pas-le-bon');
      cy.get('form').contains('button', 'Connexion').click();
      cy.contains('Identifiants incorrects').should('be.visible');
    });
  });

  it("refuse une inscription avec un email déjà utilisé", () => {
    cy.apiRegister({ name: 'Sarah' }).then((session) => {
      cy.visit('/');
      cy.contains('button', 'Créer un compte').click();
      cy.get('input[placeholder="ex: Alex ou Marc"]').type('Sarah bis');
      cy.get('input[type="email"]').type(session.user.email);
      cy.get('input[type="password"]').type(PASSWORD);
      cy.contains('button', "Commencer l'inventaire").click();
      cy.contains('Un compte existe déjà avec cette adresse email').should('be.visible');
    });
  });
});
