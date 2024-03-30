import * as fs from 'fs';
import { resolve, dirname } from 'path';

import { EmittedChunk, OutputBundle, OutputChunk, OutputOptions } from 'rollup';
import { PluginOption } from 'vite';
import { parse, Node as PNode } from 'node-html-parser';
import { generateRelTag, generateScriptTag, getOutputPaths } from './filesHelper';
import colorLog from '../util/coloredLog';

const rootDir = resolve(__dirname, '..', '..', 'dist');

export default function copyHtmlOutput(): PluginOption {
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

  function injectScriptsToHtml(htmlFile, jsFile: OutputChunk) {
    const parsedHtml = parse(fs.readFileSync(htmlFile.finalPath, 'utf-8'));
    const head = parsedHtml.querySelector('head');

    // Remove existing script tags
    const scripts = parsedHtml.querySelectorAll('script');
    for (const script of scripts) {
      script.remove();
    }

    // Add the vite-generated user script tag
    const replaceIndex = jsFile.fileName.lastIndexOf('/');
    const finalName = jsFile.fileName.substring(replaceIndex + 1);
    const scriptTag = generateScriptTag(finalName);
    head?.appendChild(scriptTag);

    for (const imported of jsFile.imports) {
      const tag = generateRelTag(imported, 'module');
      head?.appendChild(tag);
    }
    return parsedHtml.outerHTML;
  }

  function injectAssets(htmlFile: any, htmlData: string, bundle: OutputBundle) {
    const parsedHtml = parse(htmlData);
    const head = parsedHtml.querySelector('head');

    for (const fileName in bundle) {

      const file = bundle[fileName];
      if (file.type !== 'asset') continue;

      const relTag = generateRelTag(file.fileName, 'css');
      head?.appendChild(relTag);
    }

    return parsedHtml.outerHTML;
  }

  return {
    name: 'copyHtmlOutput',
    async writeBundle(options: OutputOptions, bundle: OutputBundle) {
      const htmlFiles = copyHtmlFilesToOutput(bundle);

      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (file.type !== 'chunk') continue;
        if (!file.isEntry) continue;

        const htmlFile = htmlFiles.find((html) => html.fileName.includes(file.name));
        if (!htmlFile) continue;

        const injectedHtml = injectScriptsToHtml(htmlFile, file);
        colorLog('[plugin] Injected script files to ' + htmlFile.fileName, 'info');

        const htmlWithAssets = injectAssets(htmlFile, injectedHtml, bundle) ?? injectedHtml;
        colorLog('[plugin] Injected css files to ' + htmlFile.fileName, 'info');

        fs.writeFile(htmlFile.finalPath, htmlWithAssets, 'utf-8', (err) => {
          if (err) throw err;
        });
      }

      colorLog('[plugin] HTML files copied to output', 'success');
    },
  };
}
