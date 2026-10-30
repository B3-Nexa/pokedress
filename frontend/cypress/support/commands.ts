/// <reference types="cypress" />

// Commandes partagées par les tests E2E.
// Chaque test crée son propre foyer avec un email unique : pas besoin de vider la base entre deux tests.

export type CategoryKey =
  | 'dressing_vetements'
  | 'meubles_deco'
  | 'electromenager'
  | 'vaisselle_cuisine'
  | 'hightech'
  | 'outils_bricolage'
  | 'loisirs_livres'
  | 'autre';

export interface AuthSession {
  token: string;
  user: { id: string; email: string; name: string; role: string };
  household: { id: string; name: string; invite_code: string; plan: string };
  password: string;
}

export interface RoomDto {
  id: string;
  name: string;
  item_count: number;
}

export interface ItemDto {
  id: string;
  _id: string;
  name: string;
  room_id: string;
  category: CategoryKey;
}

export const PASSWORD = 'motdepasse-e2e';

export function uniqueEmail(prefix: string): string {
  // Les accents (« Léa ») rendraient l'email invalide
  const local = prefix.normalize('NFD').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';
  return `${local}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@e2e.test`;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Crée un compte (et un foyer, sauf si invite_code est fourni) via l'API. */
      apiRegister(options: {
        name: string;
        email?: string;
        invite_code?: string;
        household_name?: string;
      }): Chainable<AuthSession>;
      /** Liste les pièces du foyer via l'API. */
      apiRooms(token: string): Chainable<RoomDto[]>;
      /** Crée un objet via l'API, dans la pièce nommée roomName. */
      apiCreateItem(
        token: string,
        item: { name: string; roomName: string; category: CategoryKey; [key: string]: unknown }
      ): Chainable<ItemDto>;
      /** Crée `count` objets « <prefix> n » dans la pièce donnée. */
      apiCreateMany(token: string, count: number, roomName: string, prefix?: string): Chainable<void>;
      /** Ouvre l'application déjà connectée avec ce jeton. */
      visitAs(token: string): Chainable<void>;
      /** Ouvre l'ajout rapide via le bouton « + » central. */
      openFastAdd(): Chainable<void>;
      /** Change d'onglet dans la barre de navigation basse. */
      goToTab(label: 'Inventaire' | 'Dressing' | 'Stats' | 'Foyer'): Chainable<void>;
    }
  }
}

Cypress.Commands.add('apiRegister', ({ name, email, invite_code, household_name }) => {
  const body = {
    name,
    email: email ?? uniqueEmail(name.toLowerCase()),
    password: PASSWORD,
    ...(invite_code ? { invite_code } : {}),
    ...(household_name ? { household_name } : {}),
  };
  return cy
    .request('POST', '/api/auth/register', body)
    .then((res) => ({ ...(res.body as Omit<AuthSession, 'password'>), password: PASSWORD }));
});

Cypress.Commands.add('apiRooms', (token) => {
  return cy
    .request({ url: '/api/rooms', headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.body as RoomDto[]);
});

Cypress.Commands.add('apiCreateItem', (token, { roomName, ...item }) => {
  return cy.apiRooms(token).then((rooms) => {
    const room = rooms.find((r) => r.name === roomName);
    if (!room) throw new Error(`Pièce introuvable : ${roomName}`);
    return cy
      .request({
        method: 'POST',
        url: '/api/items',
        headers: { Authorization: `Bearer ${token}` },
        body: { ...item, room_id: room.id },
      })
      .then((res) => res.body as ItemDto);
  });
});

Cypress.Commands.add('apiCreateMany', (token, count, roomName, prefix = 'Objet') => {
  cy.apiRooms(token).then((rooms) => {
    const room = rooms.find((r) => r.name === roomName);
    if (!room) throw new Error(`Pièce introuvable : ${roomName}`);
    for (let i = 1; i <= count; i++) {
      cy.request({
        method: 'POST',
        url: '/api/items',
        headers: { Authorization: `Bearer ${token}` },
        body: { name: `${prefix} ${i}`, room_id: room.id, category: 'autre' },
        log: false,
      });
    }
  });
});

Cypress.Commands.add('visitAs', (token) => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.clear();
      win.localStorage.setItem('pokedress_token', token);
      // Le presse-papiers n'est pas autorisé dans le navigateur de test : on le simule
      Object.defineProperty(win.navigator, 'clipboard', {
        value: { writeText: cy.stub().as('clipboardWrite').resolves() },
        configurable: true,
      });
    },
  });
  cy.contains('Vue par Pièce').should('be.visible');
});

Cypress.Commands.add('openFastAdd', () => {
  cy.get('button[aria-label="Ajout rapide d\'un objet"]').click();
  cy.contains('h2', 'Ajout Rapide').should('be.visible');
});

Cypress.Commands.add('goToTab', (label) => {
  // Deux barres existent (desktop dans le header, mobile en bas) : on prend celle qui est visible
  cy.get('nav:visible').contains('button', label).click();
});

export {};
