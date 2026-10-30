import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    // Mobile-first : on teste au format smartphone (CA-0.3)
    viewportWidth: 375,
    viewportHeight: 812,
    video: false,
    defaultCommandTimeout: 8000,
  },
});
