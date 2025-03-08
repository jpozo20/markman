console.log('background script loaded');
const browser2 = self.chrome;

let creating; // A global promise to avoid concurrency issues
async function setupOffscreenDocument(path) {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const offscreenUrl = browser2.runtime.getURL(path);
  const existingContexts = await browser2.runtime.getContexts({
    contextTypes: [browser2.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) {
    return;
  }

  // create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = browser2.offscreen.createDocument({
      url: path,
      reasons: ['WORKERS'],
      justification: 'Need to spawn workers to use pglite-wasm',
    });
    await creating;
    creating = null;
    console.log('offscreen html loaded');
  }
};

setupOffscreenDocument('offscreen/offscreen.html');