import * as fs from 'fs';
import { resolve, dirname } from 'path';

import { EmittedChunk, OutputBundle, OutputChunk, OutputOptions } from 'rollup';
import { PluginOption } from 'vite';

const root = resolve(__dirname, '..');
const outDir = resolve(__dirname, '..', '..', 'dist');

export default function fixHtmlPaths(): PluginOption {
  function getOutputPaths(inputPath: string) {
    const htmlPath = inputPath.replace('tsx', 'html');
    const folderName = dirname(htmlPath);

    const fileReplaceIndex = htmlPath.lastIndexOf('/');
    const dirReplaceIndex = folderName.lastIndexOf('/');

    const fileName = htmlPath.substring(fileReplaceIndex + 1);
    const dirName = folderName.substring(dirReplaceIndex + 1);
    const finalPath = resolve(outDir, dirName, fileName);
    return {
      dirName,
      fileName,
      finalPath,
      html: htmlPath,
    };
  }

  function copyHtmlFilesToOutput(bundle: OutputBundle) {
    const processedFiles: any[] = [];
    for (const fileName in bundle) {
      const file = bundle[fileName];

      if (file.type !== 'chunk') continue;
      if (!file.isEntry) continue;

      // //if (file.name === 'main') continue;
      if (!file.facadeModuleId?.includes('pages')) continue;
      const output = getOutputPaths(file.facadeModuleId);
      fs.copyFileSync(output.html, output.finalPath);
      processedFiles.push(output);
    }
    return processedFiles;
  }

  return {
    name: 'fixHtmlPaths',
    async writeBundle(options: OutputOptions, bundle: OutputBundle) {
      const htmlFiles = copyHtmlFilesToOutput(bundle);
    },
  };
}
