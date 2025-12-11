import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./",   // WAJIB: biar CSS & assets ketemu di Vercel
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
