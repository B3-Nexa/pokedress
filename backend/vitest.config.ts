import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: './tests/globalSetup.ts',
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 300000,
  },
});
