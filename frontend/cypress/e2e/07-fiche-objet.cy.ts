import { expandGroup, groupCard } from '../support/helpers';

// F-06, F-08 : compléter plus tard et supprimer un objet
describe("Fiche d'un objet : compléter plus tard et supprimer", () => {
  beforeEach(() => {
    cy.apiRegister({ name: 'Marc' }).then(({ token }) => {
      cy.apiCreateItem(token, { name: 'Écran 27 pouces', roomName: 'Salon', category: 'hightech' });
      cy.apiCreateItem(token, { name: 'Lampe', roomName: 'Salon', category: 'meubles_deco' });
      cy.visitAs(token);
    });
  });

  const openItem = (name: string) => {
    expandGroup('Salon').contains('h3', name).click();
    cy.contains('Compléter plus tard').should('be.visible');
  };

  it('complète un objet après coup : prix, marque, dates, notes [CA-6.3]', () => {
    openItem('Écran 27 pouces');
    cy.contains('label', "Prix d'achat").parent().find('input').type('249.90');
    cy.contains('label', 'Marque').parent().find('input').type('Dell');
    cy.contains('label', "Date d'achat").parent().find('input').type('2026-01-15');
    cy.contains('label', 'Fin de garantie').parent().find('input').type('2028-01-15');
    cy.contains('label', 'Notes').parent().find('textarea').type('SN-12345');
    cy.contains('.fixed', 'Compléter plus tard').contains('button', 'Enregistrer').click();
    cy.contains('Compléter plus tard').should('not.exist');

    // Icône facture / garantie sur la carte
    expandGroup('Salon').contains('h3', 'Écran 27 pouces').parents('[role="button"]').find('[title="Facture / Garantie enregistrée"]').should('exist');

    // Les valeurs sont bien enregistrées
    openItem('Écran 27 pouces');
    cy.contains('label', "Prix d'achat").parent().find('input').should('have.value', '249.9');
    cy.contains('label', 'Marque').parent().find('input').should('have.value', 'Dell');
    cy.contains('label', 'Fin de garantie').parent().find('input').should('have.value', '2028-01-15');
    cy.contains('label', 'Notes').parent().find('textarea').should('have.value', 'SN-12345');
  });

  it('ouvre successivement deux fiches différentes', () => {
    openItem('Écran 27 pouces');
    cy.get('button[aria-label="Fermer"]').click();
    openItem('Lampe');
    cy.contains('.fixed h2', 'Lampe').should('be.visible');
  });

  it('supprime un objet après confirmation [CA-6.8]', () => {
    openItem('Lampe');
    cy.on('window:confirm', (text) => {
      expect(text).to.contain('Supprimer définitivement « Lampe »');
      return true;
    });
    cy.contains('button', 'Supprimer').click();
    cy.contains('Compléter plus tard').should('not.exist');
    groupCard('Salon').should('contain', '1 objet');
    cy.contains('h3', 'Lampe').should('not.exist');
  });

  it("ne supprime rien si l'on annule la confirmation", () => {
    openItem('Lampe');
    cy.on('window:confirm', () => false);
    cy.contains('button', 'Supprimer').click();
    cy.get('button[aria-label="Fermer"]').click();
    groupCard('Salon').should('contain', '2 objets');
  });
});
