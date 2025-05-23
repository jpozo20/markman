import fs from "node:fs"
import { join } from "node:path";
import { readMigrationFiles } from "drizzle-orm/migrator";


const migrations = readMigrationFiles({ migrationsFolder: "./drizzle/" });

console.log(
    `📦 Found ${migrations.length} pending migrations`
  );

fs.writeFile(
  join(import.meta.dirname, "./drizzle/migrations.json"),
  JSON.stringify(migrations),
  (err) => {
    if (err) {
      console.error("❌ Error writing migrations.json:", err);
    } else {
      console.log("🎉 Migrations written to migrations.json");
    }
  }
);

console.log("📦 Writing migrations to migrations.js!");