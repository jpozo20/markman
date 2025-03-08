import { PGliteWorker } from "@electric-sql/pglite/worker";

const log = console.log;
const error = console.error;

console.log("Worker inside offscreen");

async function loadPg() {
  const worker = new Worker(
    new URL("./pglite-worker.ts", import.meta.url),
    { type: "module" },
  );

  const pg = new PGliteWorker(worker);
  //const result = await pg.query("select 'Hello world' as message;");


  worker.onmessage = function ({ data }) {
    switch (data.type) {
      case 'log':
        log(`Worker Message: ${data.payload.args}`);
        break;
      case 'ready':
        log("successfully loaded pglite!");
        break;
      default:
        log(`ERROR: Unhandled message in worker: ${data.type}`);
    }
  };
}

loadPg();