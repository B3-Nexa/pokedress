import { expandGroup, groupCard } from '../support/helpers';

// US2 : vue d'ensemble par pièce et par catégorie (F-09 à F-11)
describe("US2 : vue d'ensemble", () => {
  it('affiche les 5 pièces par défaut vides pour un nouveau foyer [CA-2.5]', () => {
    cy.apiRegister({ name: 'Sarah' }).then((session) => {
      cy.visitAs(session.token);
      ['Salon', 'Cuisine', 'Chambre', 'Salle de bain', 'Cave/Garage'].forEach((room) => {
        groupCard(room).should('contain', '0 objets');
      });
      expandGroup('Salon').should('contain', 'Aucun objet dans cette pièce');
    });
  });

  it('compte les objets par pièce et par catégorie [CA-2.1, CA-2.2]', () => {
    cy.apiRegister({ name: 'Léa' }).then(({ token }) => {
      cy.apiCreateItem(token, { name: 'Canapé', roomName: 'Salon', category: 'meubles_deco' });
      cy.apiCreateItem(token, { name: 'Télévision', roomName: 'Salon', category: 'hightech' });
      cy.apiCreateItem(token, { name: 'Bouilloire', roomName: 'Cuisine', category: 'electromenager' });
      cy.visitAs(token);

      groupCard('Salon').should('contain', '2 objets');
      groupCard('Cuisine').should('contain', '1 objet');
      expandGroup('Salon').should('contain', 'Canapé').and('contain', 'Télévision');

      cy.contains('button', 'Vue par Catégorie').click();
      groupCard('Meubles & Déco').should('contain', '1 objet');
      groupCard('High-Tech').should('contain', '1 objet');
      groupCard('Électroménager').should('contain', '1 objet');
      // Les catégories vides ne sont pas affichées
      cy.contains('h3', 'Loisirs & Livres').should('not.exist');
    });
  });

  it("compte une fiche pour 1 objet, quelle que soit sa quantité [CA-2.3]", () => {
    cy.apiRegister({ name: 'Marc' }).then(({ token }) => {
      cy.apiCreateItem(token, { name: 'Verre', roomName: 'Cuisine', category: 'vaisselle_cuisine', quantity: 6 });
      cy.visitAs(token);
      groupCard('Cuisine').should('contain', '1 objet');
      expandGroup('Cuisine').should('contain', '× 6');
    });
  });
});
