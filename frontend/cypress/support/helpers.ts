/// <reference types="cypress" />

/** Carte d'une pièce dans la vue « par pièce » (ou d'une catégorie dans la vue « par catégorie »). */
export function groupCard(name: string) {
  return cy.contains('h3', new RegExp(`^${escapeRegExp(name)}$`)).parents('.rounded-xl').first();
}

/** Déplie une pièce ou une catégorie si elle est repliée. */
export function expandGroup(name: string) {
  groupCard(name).then(($card) => {
    if ($card.find('.border-t').length === 0) {
      cy.wrap($card).find('button').first().click();
    }
  });
  return groupCard(name);
}

/** Sélectionne une option par son libellé dans la liste déroulante qui suit le label. */
export function selectByLabel(label: string, option: string) {
  cy.contains('label', label).parent().find('select').select(option);
}

export function fastAddName() {
  return cy.get('input[placeholder^="ex: Grille-pain"]');
}

export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
