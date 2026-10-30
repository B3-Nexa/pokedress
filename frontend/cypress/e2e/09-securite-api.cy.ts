// Règles communes : isolation des foyers et robustesse de l'API (CA-0.1, CA-0.2, CA-0.4)
describe('Sécurité et robustesse de l\'API', () => {
  it('refuse toute route protégée sans jeton [CA-0.2]', () => {
    ['/api/items', '/api/rooms', '/api/dashboard', '/api/household'].forEach((url) => {
      cy.request({ url, failOnStatusCode: false }).its('status').should('eq', 401);
    });
  });

  it("ne donne jamais accès à l'objet d'un autre foyer [CA-0.1]", () => {
    cy.apiRegister({ name: 'Léa' }).then((lea) => {
      cy.apiCreateItem(lea.token, { name: 'Bijou de famille', roomName: 'Chambre', category: 'autre' }).then((item) => {
        cy.apiRegister({ name: 'Intrus' }).then((intrus) => {
          const headers = { Authorization: `Bearer ${intrus.token}` };
          cy.request({ url: `/api/items/${item._id}`, headers, failOnStatusCode: false }).its('status').should('eq', 404);
          cy.request({ method: 'DELETE', url: `/api/items/${item._id}`, headers, failOnStatusCode: false })
            .its('status')
            .should('eq', 404);
          cy.request({ url: '/api/items', headers }).its('body').should('have.length', 0);
        });
      });
    });
  });

  it("ignore les en-têtes x-household-id / x-user-id quand il n'y a pas de jeton [CA-0.1, CA-0.2]", () => {
    cy.apiRegister({ name: 'Léa' }).then((lea) => {
      cy.request({
        url: '/api/items',
        headers: { 'x-household-id': lea.household.id, 'x-user-id': lea.user.id },
        failOnStatusCode: false,
      })
        .its('status')
        .should('eq', 401);
    });
  });

  it('refuse un objet invalide avec un message en français par champ [CA-0.4]', () => {
    cy.apiRegister({ name: 'Marc' }).then(({ token }) => {
      cy.request({
        method: 'POST',
        url: '/api/items',
        headers: { Authorization: `Bearer ${token}` },
        body: { name: 'A' },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.details.name).to.eq('Le nom doit comporter au moins 2 caractères');
        expect(res.body.details).to.have.property('room_id');
        expect(res.body.details).to.have.property('category');
      });
    });
  });

  it('ne plante pas sur une recherche contenant des caractères spéciaux', () => {
    cy.apiRegister({ name: 'Marc' }).then(({ token }) => {
      cy.request({
        url: '/api/items?search=' + encodeURIComponent('câble (HDMI'),
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      })
        .its('status')
        .should('eq', 200);
    });
  });
});
