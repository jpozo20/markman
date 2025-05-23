import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths'

import copyManifest from './src/plugins/copyManifest';
import copyHtmlOutput from './src/plugins/copyHtmlOutput';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

const isDev = process.env.VITE___ISDEV === 'true';


export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@pages': pagesDir,
    },
  },
  plugins: [
    tsconfigPaths({ projectDiscovery: "lazy", loose: true }),
    react(), copyManifest(), copyHtmlOutput()],
  publicDir,
  build: {
    outDir,

    // minify only when not in DEV
    //minify: process.env.VITE___ISDEV === 'true' ? true: false,
    minify: false,

    // remove sourcemaps when not in DEV
    sourcemap: process.env.VITE___ISDEV === 'true' ? 'inline' : undefined,

    rollupOptions: {
      input: {
        main: resolve(pagesDir, 'main', 'main.tsx'),
        offscreen: resolve(pagesDir, 'offscreen', 'offscreen.html'),
        popup: resolve(pagesDir, 'popup', 'popup.tsx'),

        contentScript: resolve(root, 'contentScript.ts'),
        backgroundScript: resolve(root, 'backgroundScript.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          console.log('chunk file:' + chunk.name);
          if (chunk.name.includes('Script')) {
            return `${chunk.name}.js`;
          }
          return `${chunk.name}/${chunk.name}.js`;
        },
      },
    },
  },
  // Resolves error when trying to load pglite-worker
  worker: {
    format: "es"
  },
  // Remove pglite from optimizations
  optimizeDeps: {
    exclude: ['@electric-sql/pglite', '@electric-sql/pglite/worker'],
  },
});
