import browser from 'webextension-polyfill';
import { PGliteWorker } from "@electric-sql/pglite/worker";

import * as requests from '@models/MessageRequests'
import { initDb, runMigrations, MarkmanDb } from './markmanDb';
import BookmarkImporter from '@services/dataTransfer/BookmarkImporter';


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
      case requests.ExtensionRequest.PGLite.PGLiteRequest:
        log('receiving request from: ', sender);
        handleQuery(request, sendResponse);
        break;
      case requests.ExtensionRequest.PGLite.ImportBookmarks:
        log('receiving import bookmmarks request from: ', sender);
        const importer = new BookmarkImporter(db);
        importer.importBookmarks(request.payload);
        
        //handleQuery(request, sendResponse);
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

/**
 * Initializes the PGliteWorker and creates a new PGlite instance.
 * @param inMemory If true, the database will be stored in memory, otherwise it will be stored 
 * on the Origin Private Filesystem (OPFS).
 * @returns A promise that resolves to the PGliteWorker instance.
 * @throws An error if the PGliteWorker fails to initialize.
 */
async function initializePGlite(inMemory: boolean = false): Promise<PGliteWorker> {
  worker = new Worker(
    new URL("./pglite-worker.ts", import.meta.url),
    { type: "module" },
  );
  
  // @ts-ignore
  const pg = new PGliteWorker(worker, { inMemory: inMemory });
  return pg;
}

async function loadPGlite(): Promise<void> {
  
  const pg = await initializePGlite(true);
  db = await initDb(pg);
  await runMigrations(db);

  handleEvents(pg, worker);
}

loadPGlite();