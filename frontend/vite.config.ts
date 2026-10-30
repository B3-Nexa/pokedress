import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API_URL permet de pointer le proxy vers un autre port (ex : backend des tests E2E)
const apiTarget = process.env.API_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/uploads': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
