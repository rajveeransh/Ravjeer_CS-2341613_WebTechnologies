import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy API calls to the backend during development
// so we don't need CORS headers in dev mode
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
