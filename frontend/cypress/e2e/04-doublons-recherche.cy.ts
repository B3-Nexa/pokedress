import { fastAddName, groupCard, selectByLabel } from '../support/helpers';

// US3 : alerte doublon et recherche (F-14, F-15)
describe('US3 : doublons et recherche', () => {
  let token: string;

  beforeEach(() => {
    cy.apiRegister({ name: 'Léa' }).then((session) => {
      token = session.token;
      cy.apiCreateItem(token, { name: 'Rallonge 5m', roomName: 'Salon', category: 'outils_bricolage' });
      cy.apiCreateItem(token, { name: 'Sèche-cheveux', roomName: 'Salle de bain', category: 'electromenager' });
      cy.apiCreateItem(token, { name: 'Perceuse', roomName: 'Cave/Garage', category: 'outils_bricolage' });
    });
  });

  it("signale un doublon pendant la saisie, sans bloquer l'enregistrement [CA-3.1, CA-3.2]", () => {
    cy.visitAs(token);
    cy.openFastAdd();
    fastAddName().type('rallonge');
    cy.contains('1 objet similaire déjà possédé').should('be.visible');
    cy.contains('li', 'Rallonge 5m').should('contain', '(Salon)');

    selectByLabel('Pièce', 'Salon');
    cy.contains('button', 'Enregistrer').click();
    cy.contains('h2', 'Ajout Rapide').should('not.exist');
    groupCard('Salon').should('contain', '2 objets');
  });

  it('ignore les accents et les majuscules [CA-3.3]', () => {
    cy.visitAs(token);
    cy.openFastAdd();
    fastAddName().type('SECHE-CHEVEUX');
    cy.contains('li', 'Sèche-cheveux').should('contain', '(Salle de bain)');
  });

  it("n'affiche rien sous 2 caractères ni sans correspondance [CA-3.5]", () => {
    cy.visitAs(token);
    cy.openFastAdd();
    fastAddName().type('r');
    cy.wait(500);
    cy.contains('similaire').should('not.exist');
    fastAddName().clear().type('aspirateur');
    cy.wait(500);
    cy.contains('similaire').should('not.exist');
  });

  it('résume 5 correspondances et permet de toutes les voir [CA-3.4]', () => {
    for (let i = 1; i <= 4; i++) {
      cy.apiCreateItem(token, { name: `Rallonge n°${i}`, roomName: 'Cuisine', category: 'outils_bricolage' });
    }
    cy.visitAs(token);
    cy.openFastAdd();
    fastAddName().type('rallonge');
    cy.contains('5 objets similaires déjà possédés').should('be.visible');
    cy.get('ul li').should('have.length', 2);
    cy.contains('button', 'Voir les 5 correspondances').click();
    cy.get('ul li').should('have.length', 5);
  });

  it('recherche par nom, par pièce, et dit clairement quand rien ne correspond [CA-3.6 à CA-3.8]', () => {
    cy.visitAs(token);
    const search = () => cy.get('input[placeholder^="Rechercher un objet"]');

    search().type('perceuse');
    cy.contains('Résultats de recherche (1)').should('be.visible');
    cy.contains('h3', 'Perceuse').should('be.visible');

    search().clear().type('cave');
    cy.contains('Résultats de recherche (1)').should('be.visible');
    cy.contains('h3', 'Perceuse').should('be.visible');

    search().clear().type('trottinette');
    cy.contains('Vous ne possédez rien qui ressemble à « trottinette »').should('be.visible');

    cy.get('button[aria-label="Effacer la recherche"]').click();
    cy.contains('Vue par Pièce').should('be.visible');
  });
});
