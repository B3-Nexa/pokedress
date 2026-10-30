import { expandGroup, fastAddName, groupCard, selectByLabel } from '../support/helpers';

// US1 : ajout rapide et ajout enchaîné (F-03 à F-05)
describe('US1 : ajout rapide et ajout enchaîné', () => {
  beforeEach(() => {
    cy.apiRegister({ name: 'Léa' }).then((session) => cy.visitAs(session.token));
  });

  it("ajoute un objet avec seulement nom, pièce et catégorie [CA-1.1]", () => {
    cy.openFastAdd();
    fastAddName().should('have.focus').type('Grille-pain');
    selectByLabel('Pièce', 'Cuisine');
    selectByLabel('Catégorie', 'Électroménager');
    cy.contains('button', 'Enregistrer').click();

    cy.contains('h2', 'Ajout Rapide').should('not.exist');
    groupCard('Cuisine').should('contain', '1 objet');
    expandGroup('Cuisine').should('contain', 'Grille-pain').and('contain', 'Électroménager');
  });

  it('refuse un nom de moins de 2 caractères [CA-1.3]', () => {
    cy.openFastAdd();
    fastAddName().type('A');
    cy.contains('button', 'Enregistrer').click();
    cy.contains('Le nom doit comporter au moins 2 caractères').should('be.visible');
    cy.contains('h2', 'Ajout Rapide').should('be.visible');
  });

  it('enchaîne les ajouts en gardant la pièce et la catégorie [CA-1.4, CA-1.5]', () => {
    cy.openFastAdd();
    selectByLabel('Pièce', 'Chambre');
    selectByLabel('Catégorie', 'Dressing & Vêtements');

    // Entrée = « Enchaîner »
    fastAddName().type('Pull col roulé{enter}');
    cy.contains('« Pull col roulé » enregistré !').should('be.visible');
    fastAddName().should('have.value', '').and('have.focus');
    cy.contains('label', 'Pièce').parent().find('select option:selected').should('have.text', 'Chambre');
    cy.contains('label', 'Catégorie')
      .parent()
      .find('select option:selected')
      .should('have.text', 'Dressing & Vêtements');

    fastAddName().type('Jean noir');
    cy.contains('button', 'Enchaîner').click();
    cy.contains('« Jean noir » enregistré !').should('be.visible');

    // Changer de pièce en cours d'enchaînement : la nouvelle pièce est gardée [CA-1.5]
    selectByLabel('Pièce', 'Salon');
    fastAddName().type('Plaid{enter}');
    cy.contains('« Plaid » enregistré !').should('be.visible');
    cy.contains('label', 'Pièce').parent().find('select option:selected').should('have.text', 'Salon');

    cy.get('button[aria-label="Fermer"]').click();
    groupCard('Chambre').should('contain', '2 objets');
    groupCard('Salon').should('contain', '1 objet');
  });

  it('ajoute un objet avec une photo, enregistrée telle quelle [CA-1.6]', () => {
    cy.openFastAdd();
    fastAddName().type('Lampe de bureau');
    selectByLabel('Pièce', 'Salon');
    selectByLabel('Catégorie', 'Meubles & Déco');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/objet.png', { force: true });
    cy.get('img[alt="Aperçu"]').should('be.visible');
    cy.contains('button', 'Enregistrer').click();

    cy.contains('h2', 'Ajout Rapide').should('not.exist');
    expandGroup('Salon')
      .find('img[alt="Lampe de bureau"]')
      .should('have.attr', 'src')
      .and('match', /^\/uploads\//);
  });
});
