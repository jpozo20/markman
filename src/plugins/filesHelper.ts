import { resolve, dirname } from 'path';
import { parse, Node as PNode } from 'node-html-parser';
import createHtmlElement from 'create-html-element';

const rootDir = resolve(__dirname, '..', '..', 'dist');

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

function generateScriptTag(scriptPath: string, isLocalFile: boolean = true): PNode {
  let path = '';
  if (isLocalFile) path = `./${scriptPath}`;
  else path = `../${scriptPath}`;

  const script = createHtmlElement({
    name: 'script',
    attributes: {
      type: 'module',
      src: path,
    },
  });

  const parsedScript = parse(script).firstChild as any;
  parsedScript.rawAttrs += ' crossorigin';
  return parsedScript as PNode;
}

function generateRelTag(assetPath: string, assetType: 'css' | 'module'): PNode {
  const path = `../${assetPath}`;
  const rel = assetType === 'css' ? 'stylesheet' : 'modulepreload';

  const linkTag = createHtmlElement({
    name: 'link',
    attributes: {
      rel: rel,
      href: path,
    },
  });

  const parsedLink = parse(linkTag);
  return parsedLink;
}

export { getOutputPaths, generateScriptTag, generateRelTag };
//<link rel="modulepreload" crossorigin href="/assets/index-e4cf8eb0.js">
//<link rel="stylesheet" href="/assets/index-a43f1d4c.css">
