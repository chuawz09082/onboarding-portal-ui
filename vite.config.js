import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // forward /api to your gateway (9000). If you prefer auth server (8080), change target below.
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
});