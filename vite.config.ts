import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";

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
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
});
