import { PGlite } from "@electric-sql/pglite";
import { worker } from '@electric-sql/pglite/worker'
import { vector } from '@electric-sql/pglite/vector';
import { OpfsAhpFS } from "@electric-sql/pglite/opfs-ahp";

const log = console.log;
const error = console.error;

log('loading pglite-worker')

worker({
    async init(options) {
        const pg = new PGlite({
            fs: new OpfsAhpFS('markman.db'),
            extensions: { vector },
            ...options
        });
        log("loading pglite from OPFS");
        return pg;
    },
});