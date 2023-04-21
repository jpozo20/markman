import * as fs from 'fs';
import { resolve } from 'path';
import { PluginOption } from 'vite';
import colorLog from '../util/coloredLog';

const root = resolve(__dirname, '..');
const outDir = resolve(__dirname, '..', '..', 'dist');
const manifest = resolve(root, 'manifest.json');

export default function copyManifest(): PluginOption {
  return {
    name: 'copyManifest',
    async writeBundle() {
      fs.copyFileSync(manifest, resolve(outDir, 'manifest.json'));
      colorLog('[plugin] Manifest file copied to output', 'success');
    },
  };
}
