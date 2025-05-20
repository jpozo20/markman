import * as dbSchema from '../dbSchema';
import { MarkmanDb } from '../markmanDb';
import BaseRepository from './baseRepository';


type Bookmark = typeof dbSchema.Bookmarks;
type BookmarkSelect = Bookmark["$inferSelect"];
type BookmarkInsert = Bookmark["$inferInsert"];

/**
 * Repository class for CRUD operations on bookmarks
 * 
 * @extends BaseRepository
 */
class BookmarksRepository extends BaseRepository<Bookmark> {
    constructor(pglite: MarkmanDb) {
        super(pglite, dbSchema.Bookmarks);
    }

    /**
     * Get all bookmarks from the bookmarks table
     * @returns All bookmarks from the bookmarks table
     */
    public async getAllBookmarks(): Promise<BookmarkSelect[]> {
        return await this.getAllFromTable();
    }

    /**
     * Select a bookmark by id
     * @param id The id of the bookmark to select
     * @returns The bookmark with the specified id
     */
    public async getBookmarkById(id: number): Promise<BookmarkSelect | null> {
        return await this.getById(id);
    }

    /**
     * Inserts a bookmark into the bookmarks table
     * @param data The bookmark data to insert
     * @returns The inserted bookmark
     */
    public async insertBookmark(data: BookmarkInsert): Promise<BookmarkSelect> {
        return await this.insert(data);
    }

    /**
     * Updates a bookmark in the bookmarks table
     * @param id The id of the bookmark to update
     * @param data The bookmark data to update
     * @returns The updated bookmark
     */
    public async updateBookmark(id: number, data: Partial<BookmarkInsert>): Promise<BookmarkSelect | null> {
        return await this.update(id, data);
    }

    /**
     * Deletes a bookmark from the bookmarks table
     * @param id The id of the bookmark to delete
     * @returns True if the bookmark was deleted, false otherwise
     */
    public async deleteBookmark(id: number): Promise<boolean>{
        return await this.delete(id);
    }
}

export default BookmarksRepository;