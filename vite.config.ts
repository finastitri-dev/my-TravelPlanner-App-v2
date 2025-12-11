import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // FIX PALING PENTING SUPAYA CSS & ASSET MUNCUL DI VERCEL
  base: "./",

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
