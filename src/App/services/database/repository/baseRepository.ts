import * as dbSchema from '../dbSchema';
import { MarkmanDb, SchemaTables } from '../markmanDb';



/**
 * Generic class for CRUD operation on entities
 * 
 */

class BaseRepository<TTable extends SchemaTables[keyof SchemaTables]> {
    protected pglite: MarkmanDb;
    protected table: TTable;



    constructor(pglite: MarkmanDb, table: TTable) {
        this.table = table;
        this.pglite = pglite;
    }

    /**
     * Get all rows from the specified table
     * @param fromTable The table to select from
     * @returns All rows from the specified table
     */
    public async getAllFromTable<T>(): Promise<TTable["$inferSelect"][]> {

        const tableName = this.table._.name;
        const table = dbSchema[tableName];
        const query = this.pglite.select().from(table).limit(100);

        const results = await query;

        return results;
    }

    /**
     * Get a row by id from the specified table
     * @param id The id of the row to select
     * @returns The row with the specified id
     */
    public async getById(id: number): Promise<TTable["$inferSelect"] | null> {
        const tableName = this.table._.name;
        const table = dbSchema[tableName];

        const query = this.pglite.select().from(table).where(table.id.eq(id));
        const result = await query;
        return result.length > 0 ? result[0] : null;
    }

    /**
     * Insert a row into the specified table
     * @param data The data to insert
     * @returns The inserted row
     */
    public async insert(data: TTable["$inferInsert"]): Promise<TTable["$inferSelect"]> {
        const tableName = this.table._.name;
        const table = dbSchema[tableName];

        const query = this.pglite.insert(table).values(data).returning();
        const result = await query;
        return result[0];
    }

    /**
     * Update a row in the specified table
     * @param id The id of the row to update
     * @param data The data to update
     * @returns The updated row
     */
    public async update(id: number, data: Partial<TTable["$inferInsert"]>): Promise<TTable["$inferSelect"] | null> {
        const tableName = this.table._.name;
        const table = dbSchema[tableName];

        const query = this.pglite.update(table)
            .set(data).where(table.id.eq(id))
            .returning();
        const result = await query;
        return result.length > 0 ? result[0] : null;
    }

    /**
     * Delete a row from the specified table
     * @param id The id of the row to delete
     * @returns True if the row was deleted, false otherwise
     */
    public async delete(id: number): Promise<boolean> {
        const tableName = this.table._.name;
        const table = dbSchema[tableName];

        const query = this.pglite.delete(table)
            .where(table.id.eq(id))
            .returning({ deletedId: table.id });

        const result = await query;
        return result.length > 0;
    }
}

export default BaseRepository;