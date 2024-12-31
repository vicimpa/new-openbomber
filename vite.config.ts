import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";
import preact from '@preact/preset-vite';

export default defineConfig({
  root: './src',
  base: './',
  publicDir: '../public',
  build: {
    emptyOutDir: true,
    outDir: '../dist',
    target: 'esnext',
    reportCompressedSize: false
  },
  plugins: [
    paths({ root: '..' }),
    preact(),
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
});
