// US4 : catégorie Dressing et cycle de vie des vêtements (F-16 à F-18)
describe('US4 : dressing', () => {
  beforeEach(() => {
    cy.apiRegister({ name: 'Sarah' }).then(({ token }) => {
      cy.apiCreateItem(token, { name: 'Jean noir droit', roomName: 'Chambre', category: 'dressing_vetements' });
      cy.apiCreateItem(token, { name: 'Robe à fleurs', roomName: 'Chambre', category: 'dressing_vetements' });
      cy.apiCreateItem(token, { name: 'Aspirateur', roomName: 'Cave/Garage', category: 'electromenager' });
      cy.visitAs(token);
      cy.goToTab('Dressing');
    });
  });

  const clothingRow = (name: string) => cy.contains('h3', name).parents('.relative.group').first();

  it("n'affiche que les vêtements, « Portés régulièrement » par défaut [CA-4.2]", () => {
    cy.contains('2 pièces inventoriées dans le foyer').should('be.visible');
    cy.contains('button', 'Portés régulièrement (2)').should('be.visible');
    cy.contains('h3', 'Aspirateur').should('not.exist');
  });

  it('change le statut en 1 clic et filtre par statut [CA-4.4, CA-4.5]', () => {
    clothingRow('Robe à fleurs').contains('button', 'Marquer dormant').click();
    cy.contains('button', 'Dormants (1)').click();
    cy.contains('h3', 'Robe à fleurs').should('be.visible');
    cy.contains('h3', 'Jean noir droit').should('not.exist');

    clothingRow('Robe à fleurs').contains('button', 'À revendre').click();
    cy.contains('button', 'À donner ou revendre (1)').click();
    cy.contains('h3', 'Robe à fleurs').should('be.visible');
    cy.contains('1 pièces prêtes à revendre').should('be.visible');

    cy.contains('button', 'Dormants (0)').click();
    cy.contains('Aucun vêtement dans cette vue').should('be.visible');

    cy.contains('button', 'Tous (2)').click();
    cy.contains('h3', 'Jean noir droit').should('be.visible');
  });
});
