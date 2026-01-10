import { worker } from '@electric-sql/pglite/worker'
import { vector } from '@electric-sql/pglite/vector';
import { OpfsAhpFS } from "@electric-sql/pglite/opfs-ahp";
import { MemoryFS, PGlite, PGliteOptions } from "@electric-sql/pglite";

const log = console.log;

log('loading pglite-worker')

worker({
    async init(options: PGliteOptions & { inMemory?: boolean }) {

        const dataDir = "markman/markman.db";
        const fileSystem = options.inMemory ? new MemoryFS(dataDir) : new OpfsAhpFS(dataDir);

        const pg = new PGlite({
            //fs: new OpfsAhpFS('markman/markman.db'),
            //fs: new MemoryFS("markman/markman.db"),
            fs: fileSystem,
            extensions: { vector },
            ...options,
        });
        log(`loading pglite from ${options.inMemory ? "memory" : "OPFS"}`);
        return pg;
    },
});