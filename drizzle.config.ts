import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/App/services/database/dbSchema.ts',
  dialect: 'postgresql',
  driver: 'pglite',
  dbCredentials: {
    url: 'opfs-ahp://markman/markman.db',
  },
});