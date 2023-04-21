import * as fs from 'fs';
import { resolve, dirname } from 'path';

import { EmittedChunk, OutputBundle, OutputChunk, OutputOptions } from 'rollup';
import { PluginOption } from 'vite';
import { parse } from 'node-html-parser';
import createHtmlElement from 'create-html-element';

const rootDir = resolve(__dirname, '..', '..', 'dist');

export default function fixHtmlPaths(): PluginOption {
  function getOutputPaths(inputPath: string) {
    const htmlPath = inputPath.replace('tsx', 'html');
    const folderName = dirname(htmlPath);

    const fileReplaceIndex = htmlPath.lastIndexOf('/');
    const dirReplaceIndex = folderName.lastIndexOf('/');

    const fileName = htmlPath.substring(fileReplaceIndex + 1);
    const dirName = folderName.substring(dirReplaceIndex + 1);
    const finalPath = resolve(rootDir, dirName, fileName);
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

  function injectScriptToHtml(htmlFile, jsFile: OutputChunk) {
    console.log(jsFile.imports);
    const replaceIndex = jsFile.fileName.lastIndexOf('/');
    const finalName = jsFile.fileName.substring(replaceIndex + 1);
    const parsedHtml = parse(fs.readFileSync(htmlFile.finalPath, 'utf-8'));

    // Remove existing script tags
    const scripts = parsedHtml.querySelectorAll('script');
    for (const script of scripts) {
      script.remove();
    }

    // Add the vite-generated script tag
    const head = parsedHtml.querySelector('head');
    const script = createHtmlElement({
      name: 'script',
      attributes: {
        type: 'module',
        src: `./${finalName}`,
      },
    });

    const parsedScript = parse(script).firstChild as any;
    parsedScript.rawAttrs += ' crossorigin';
    head?.appendChild(parsedScript);
    return parsedHtml.outerHTML;
  }

  return {
    name: 'fixHtmlPaths',
    async writeBundle(options: OutputOptions, bundle: OutputBundle) {
      const htmlFiles = copyHtmlFilesToOutput(bundle);

      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (file.type !== 'chunk') continue;
        if (!file.isEntry) continue;

        const htmlFile = htmlFiles.find((html) => html.fileName.includes(file.name));
        if (!htmlFile) continue;

        const injectedHtml = injectScriptToHtml(htmlFile, file);
        fs.writeFile(htmlFile.finalPath, injectedHtml, 'utf-8', (err) => {
          if (err) throw err;
        });

        // crossorigin for js files
        // rel="modulepreload" for asset files
      }
    },
  };
}
