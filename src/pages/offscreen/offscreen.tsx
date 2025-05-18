import browser from 'webextension-polyfill';
import { PGliteWorker } from "@electric-sql/pglite/worker";

type OnMessageCallback = browser.Runtime.OnMessageListenerCallback;


let worker: Worker;
let pg: PGliteWorker;
const log = console.log;
const error = console.error;

console.log("Worker inside offscreen");

const handleQuery = (request: any, sendResponse: (response: unknown) => void) => {
  console.log('sending request to pglite');
  setTimeout(async () => {
    const result = await pg.query("select 'Hello world, from PGLite' as message;");
    sendResponse('this is the response from pglite: ' + result);
  }, 500);
}

async function loadPGlite() {
  worker = new Worker(
    new URL("./pglite-worker.ts", import.meta.url),
    { type: "module" },
  );

  pg = new PGliteWorker(worker);

  // Messages between the script and PGliteWorker
  worker.onmessage = function ({ data }) {
    switch (data.type) {
      case 'log':
        log(`Worker Message: ${data.payload.args}`);
        break;
      case 'ready':
        log("successfully loaded pglite!");
        break;
      default:
        log(`ERROR: Unhandled message in pglite-worker: ${data.type}`);
    }
  };

  // Messages between the script and the extension
  const handleMessage: OnMessageCallback = (request: any, sender, sendResponse) => {
    switch (request.type) {
      case 'pglite':
        log('receiving request from: ', sender);
        handleQuery(request, sendResponse);
        break;
      default:
        console.log('unknown message request');
        sendResponse('unknown message request');
        break;
    }
    return true;
  };

  browser.runtime.onMessage.addListener(handleMessage);
}

loadPGlite();