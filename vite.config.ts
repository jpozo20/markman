import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import copyManifest from './src/plugins/copyManifest';
import copyHtmlOutput from './src/plugins/copyHtmlOutput';

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
  plugins: [react(), copyManifest(), copyHtmlOutput()],
  publicDir,
  build: {
    outDir,
    
    // minify only when not in DEV
    minify: process.env.VITE__ISDEV !== 'true',
    // remove sourcemaps when not in DEV
    sourcemap: process.env.VITE__ISDEV === 'true' ? 'inline' : undefined,

    rollupOptions: {
      input: {
        popup: resolve(pagesDir, 'popup', 'popup.tsx'),
        main: resolve(pagesDir, 'main', 'main.tsx'),
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
});
