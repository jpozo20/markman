import browser from 'webextension-polyfill';
import { PGliteWorker } from "@electric-sql/pglite/worker";

import { initDb, runMigrations, MarkmanDb } from './markmanDb';

type OnMessageCallback = browser.Runtime.OnMessageListenerCallback;


let worker: Worker;
let db: MarkmanDb;


const log = console.log;
const error = console.error;

console.log("Worker inside offscreen");

const handleQuery = (request: any, sendResponse: (response: unknown) => void) => {
  console.log('sending request to pglite');
  setTimeout(async () => {
    const result = await db.$client.query("select 'Hello world, from PGLite' as message;");
    sendResponse('this is the response from pglite: ' + result);
  }, 500);
}

function handleEvents(pg: PGliteWorker, worker: Worker): void {

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
        log(`WARNING: Unhandled message in pglite-worker: ${data.type}`, data);
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

    // This is required to send a response asynchronously
    // https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
    return true;
  };

  browser.runtime.onMessage.addListener(handleMessage);
}

async function loadPGlite(): Promise<void> {
  worker = new Worker(
    new URL("./pglite-worker.ts", import.meta.url),
    { type: "module" },
  );

  const pg = await PGliteWorker.create(worker);

  db = await initDb(pg);
  await runMigrations(db);

  handleEvents(pg, worker);
}

loadPGlite();