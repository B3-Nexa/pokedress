import { PASSWORD, uniqueEmail } from '../support/commands';
import { expandGroup, fastAddName, groupCard, selectByLabel } from '../support/helpers';

// US5 : partage du foyer (F-12, F-21 à F-24)
describe('US5 : partage du foyer', () => {
  const joinWithCode = (name: string, code: string) => {
    cy.visit('/');
    cy.contains('button', 'Créer un compte').click();
    cy.get('input[placeholder="ex: Alex ou Marc"]').type(name);
    cy.get('input[type="email"]').type(uniqueEmail(name.toLowerCase()));
    cy.get('input[type="password"]').type(PASSWORD);
    cy.contains('button', 'Rejoindre avec code').click();
    cy.get('input[placeholder="ex: X7K9P2"]').type(code);
    cy.contains('button', "Commencer l'inventaire").click();
  };

  it('affiche et copie le code d\'invitation [CA-5.2]', () => {
    cy.apiRegister({ name: 'Léa' }).then((lea) => {
      cy.visitAs(lea.token);
      cy.goToTab('Foyer');
      cy.contains('.font-mono', lea.household.invite_code).should('be.visible');
      cy.contains('button', 'Copier le code').click();
      cy.contains('button', 'Copié !').should('be.visible');
      cy.get('@clipboardWrite').should('have.been.calledWith', lea.household.invite_code);
    });
  });

  it('Marc rejoint le foyer de Léa (code en minuscules) et ils partagent le même inventaire [CA-5.3, CA-5.4, CA-5.7]', () => {
    cy.apiRegister({ name: 'Léa', household_name: 'Chez Léa et Marc' }).then((lea) => {
      cy.apiCreateItem(lea.token, { name: 'Canapé', roomName: 'Salon', category: 'meubles_deco' });

      joinWithCode('Marc', lea.household.invite_code.toLowerCase());
      cy.contains('Vue par Pièce').should('be.visible');
      cy.get('header').should('contain', 'Chez Léa et Marc');
      expandGroup('Salon').should('contain', 'Canapé');

      // Marc ajoute un objet…
      cy.openFastAdd();
      fastAddName().type('Perceuse');
      selectByLabel('Pièce', 'Cave/Garage');
      selectByLabel('Catégorie', 'Bricolage & Outils');
      cy.contains('button', 'Enregistrer').click();

      cy.goToTab('Foyer');
      cy.contains('Membres du Foyer (2 / 2 gratuits)').should('be.visible');
      const memberRow = (name: string) =>
        cy.contains('span.font-semibold', new RegExp(`^${name}$`)).parents('.justify-between').first();
      memberRow('Léa').should('contain', 'Créateur');
      memberRow('Marc').should('contain', 'Membre');

      // … que Léa voit, et qui déclenche l'alerte doublon chez elle
      cy.visitAs(lea.token);
      groupCard('Cave/Garage').should('contain', '1 objet');
      cy.openFastAdd();
      fastAddName().type('perceuse');
      cy.contains('li', 'Perceuse').should('contain', '(Cave/Garage)');
    });
  });

  it('refuse un code qui ne correspond à aucun foyer [CA-5.5]', () => {
    joinWithCode('Marc', 'ZZZZZZ');
    cy.contains('Ce code ne correspond à aucun foyer').should('be.visible');
  });

  it('refuse un 3e membre en version gratuite [CA-5.6]', () => {
    cy.apiRegister({ name: 'Léa' }).then((lea) => {
      cy.apiRegister({ name: 'Marc', invite_code: lea.household.invite_code });
      joinWithCode('Sarah', lea.household.invite_code);
      cy.contains('complet en version gratuite').should('be.visible');
      cy.contains('button', 'Se connecter').should('be.visible');
    });
  });

  it('ajoute une pièce, qui devient disponible partout', () => {
    cy.apiRegister({ name: 'Léa' }).then((lea) => {
      cy.visitAs(lea.token);
      cy.goToTab('Foyer');
      cy.get('input[placeholder^="Nom de la nouvelle pièce"]').type('Bureau');
      cy.contains('form', 'Ajouter').find('button[type="submit"]').click();
      cy.contains('h2', /pièces \(6\)/).should('be.visible');

      cy.goToTab('Inventaire');
      groupCard('Bureau').should('contain', '0 objets');
      cy.openFastAdd();
      cy.contains('label', 'Pièce').parent().find('select').should('contain', 'Bureau');
    });
  });
});
