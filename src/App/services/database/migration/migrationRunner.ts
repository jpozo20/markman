import { MarkmanDb } from "../markmanDb";

// @ts-ignore will be created automatically
import migrations from "@drizzle/migrations.json"

let pgdb: MarkmanDb

async function ensureMigrationsTable() {
    await pgdb.execute(`
    CREATE TABLE IF NOT EXISTS drizzle_migrations (
      hash TEXT PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

async function getMigratedHashes(): Promise<string[]> {
    const result = await pgdb.execute(`
    SELECT hash FROM drizzle_migrations ORDER BY created_at ASC
  `);
    return result.rows.map((row) => row.hash as string);
}

async function recordMigration(hash: string) {
    await pgdb.execute(
        `
    INSERT INTO drizzle_migrations (hash, created_at)
    VALUES ('${hash}', NOW())
    ON CONFLICT DO NOTHING
  `,
    );
}


// All code copied from
// https://github.com/drizzle-team/drizzle-orm/discussions/2532#discussioncomment-11729397
export async function migrate_pglite(pglite: MarkmanDb) {
    pgdb = pglite;

    console.log("🔌 Connected to pglite database");
    console.log("🚀 Starting pglite migration...");

    // Ensure migrations table exists
    await ensureMigrationsTable();

    // Get already executed migrations
    const executedHashes = await getMigratedHashes();

    // Filter and execute pending migrations
    const pendingMigrations = migrations.filter(
        (migration) => !executedHashes.includes(migration.hash)
    );

    if (pendingMigrations.length === 0) {
        console.log("✨ No pending migrations found.");
        return;
    }

    console.log(
        `📦 Found ${pendingMigrations.length} pending migrations`
    );

    // Execute migrations in sequence
    for (const migration of pendingMigrations) {
        console.log(`⚡ Executing migration: ${migration.hash}`);
        try {
            // Execute each SQL statement in sequence
            for (const sql of migration.sql) {
                
                // Need to use $client.exec instead of execute
                // because execute does not support multiple statements
                await pgdb.$client.exec(sql);
            }

            // Record successful migration
            await recordMigration(migration.hash);
            console.log(
                `✅ Successfully completed migration: ${migration.hash}`
            );
        } catch (error) {
            console.error(
                `❌ Failed to execute migration ${migration.hash}:`,
                error
            );
            throw error;
        }
    }

    console.log("🎉 All migrations completed successfully");
}