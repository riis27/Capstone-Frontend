// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/Capstone-Frontend/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2727',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
