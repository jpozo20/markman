import { PGlite } from '@electric-sql/pglite';
import { PGliteWorker } from '@electric-sql/pglite/worker';
import { drizzle, PgliteDatabase } from 'drizzle-orm/pglite';

import * as dbSchema from './dbSchema';
import { ExtractTables } from './dbSchema';

export type MarkmanDb = PgliteDatabase<typeof dbSchema> & { $client: PGlite }
export type SchemaTables = ExtractTables< typeof dbSchema>

let thisDb: MarkmanDb;

export const initDb = async (
    pgworker: PGliteWorker
): Promise<MarkmanDb> => {
    const pgdb = pgworker as unknown as PGlite;
    thisDb = drizzle(pgdb, { schema: dbSchema });
    console.log('drizzle initialized');

    return thisDb;;
};