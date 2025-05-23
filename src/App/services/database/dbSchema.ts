import { sql } from 'drizzle-orm';
import { boolean, integer, varchar, pgEnum, pgSchema, timestamp } from 'drizzle-orm/pg-core';


const dbSchema = pgSchema('markman');
export const bookmarkType = dbSchema.enum('bookmarkType', ['folder', 'bookmark']);

export const Bookmarks = dbSchema.table('bookmarks', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    chromeId: integer('chromeId').notNull(),
    type: bookmarkType().notNull(),
    isPinned: boolean('isPinned').default(false),
    pinOrder: integer('pinOrder'),
    title: varchar('title', { length: 255 }).notNull(),
    url: varchar('url', { length: 255 }).notNull(),
    domain: varchar('domain', { length: 255 }),
    favIcon: varchar('favicon', { length: 255 }),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt'),
    parentId: integer('parentId').notNull(),
    tags: integer('tags').array().notNull().default(sql`ARRAY[]::integer[]`)
});
export const Tags = dbSchema.table('tags', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt'),
});

// Extract types that implement $inferSelect from the dbSchema
export type ExtractTables<T> = {
    [K in keyof T as T[K] extends { $inferSelect: infer U } ? K : never]: T[K];
}