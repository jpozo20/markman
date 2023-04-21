import * as fs from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import copyManifest from './src/plugins/copyManifest';
import fixHtmlPaths from './src/plugins/fixHtmlPaths';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@pages': pagesDir,
    },
  },
  plugins: [react(), copyManifest(), fixHtmlPaths()],
  //plugins: [react()],
  publicDir,
  build: {
    outDir,
    //sourcemap: process.env.__DEV__ === 'true',
    rollupOptions: {
      input: {
        //popup: resolve(pagesDir, 'popup', 'popup.html'),
        //main: resolve(pagesDir, 'main', 'main.html'),
        popup: resolve(pagesDir, 'popup', 'popup.tsx'),
        main: resolve(pagesDir, 'main', 'main.tsx'),
        contentScript: resolve(root, 'contentScript.ts'),
        backgroundScript: resolve(root, 'backgroundScript.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          //console.log('chunk:', chunk);
          if (chunk.name.includes('Script')) {
            return `${chunk.name}.js`;
          }
          return `${chunk.name}/${chunk.name}.js`;
        },
      },
    },
  },
});
