
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que process.env.API_KEY esteja disponível no lado do cliente
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'esbuild'
  },
  server: {
    port: 3000
  }
});
