import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page build: the portfolio (index.html) and the loader prototype (loader.html).
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        loader: resolve(__dirname, 'loader.html'),
      },
    },
  },
});
