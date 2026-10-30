import { fastAddName, selectByLabel } from '../support/helpers';

// US6 : tableau de bord et mur des 100 objets (F-25 à F-29)
describe('US6 : tableau de bord et mur des 100 objets', () => {
  it('affiche le total, le décompte par pièce et la valeur estimée [CA-6.1, CA-6.2, CA-6.4]', () => {
    cy.apiRegister({ name: 'Marc' }).then(({ token }) => {
      cy.apiCreateItem(token, { name: 'Télé', roomName: 'Salon', category: 'hightech', purchase_price: 600 });
      cy.apiCreateItem(token, { name: 'Canapé', roomName: 'Salon', category: 'meubles_deco', purchase_price: 399.99 });
      cy.apiCreateItem(token, { name: 'Bouilloire', roomName: 'Cuisine', category: 'electromenager' });
      cy.visitAs(token);
      cy.goToTab('Stats');

      cy.contains('North Star Metric').parent().should('contain', '3').and('contain', 'objets inventoriés');
      cy.contains('Répartition par Pièce').parent().within(() => {
        cy.contains('Salon').parents('.rounded-xl').first().should('contain', '2 objets');
        cy.contains('Cuisine').parents('.rounded-xl').first().should('contain', '1 objet');
      });
      cy.contains('999,99 €').should('be.visible');
      cy.contains('Valeur estimée sur 2 objets sur 3').should('be.visible');
    });
  });

  it('prévient à partir de 90 objets [CA-6.7]', () => {
    cy.apiRegister({ name: 'Sarah' }).then(({ token }) => {
      cy.apiCreateMany(token, 90, 'Chambre', 'T-shirt');
      cy.visitAs(token);
      cy.goToTab('Stats');
      cy.contains('Plus que 10 objets en version gratuite').should('be.visible');
    });
  });

  it("bloque le 101e ajout, garde tout lisible, et libère une place après une suppression [CA-6.5, CA-6.6, CA-6.8]", () => {
    cy.apiRegister({ name: 'Sarah' }).then(({ token }) => {
      cy.apiCreateMany(token, 100, 'Chambre', 'Vêtement');
      cy.visitAs(token);

      // 101e ajout refusé, avec un message clair et sans perdre la saisie
      cy.openFastAdd();
      fastAddName().type('Objet de trop');
      selectByLabel('Pièce', 'Salon');
      cy.contains('button', 'Enregistrer').click();
      cy.contains('Cap des 100 objets atteint').should('be.visible');
      fastAddName().should('have.value', 'Objet de trop');
      cy.get('button[aria-label="Fermer"]').click();

      // Tout reste lisible et cherchable
      cy.get('input[placeholder^="Rechercher un objet"]').type('Vêtement 42');
      cy.contains('h3', 'Vêtement 42').should('be.visible');
      cy.get('button[aria-label="Effacer la recherche"]').click();
      cy.goToTab('Stats');
      cy.contains('h4', 'Cap des 100 objets atteint').should('be.visible');

      // Une suppression libère une place
      cy.request({
        url: '/api/items?search=Vêtement 1',
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        const first = (res.body as Array<{ id: string; name: string }>).find((i) => i.name === 'Vêtement 1');
        cy.request({ method: 'DELETE', url: `/api/items/${first!.id}`, headers: { Authorization: `Bearer ${token}` } });
      });
      cy.goToTab('Inventaire');
      cy.reload();
      cy.openFastAdd();
      fastAddName().type('Objet de trop');
      selectByLabel('Pièce', 'Salon');
      cy.contains('button', 'Enregistrer').click();
      cy.contains('h2', 'Ajout Rapide').should('not.exist');
    });
  });
});
