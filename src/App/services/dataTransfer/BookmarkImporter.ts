import browser from 'webextension-polyfill';

import { MarkmanDb } from '../database/markmanDb';

type OnMessageCallback = browser.Runtime.OnMessageListenerCallback;

import { BookmarkItem, BookmarkType } from '../../models/BookmarkTypes';
import { DbBookmark, NewBookmark } from '@services/database/dbSchema';
import BookmarksRepository from '@database/repository/bookmarksRepository';
import { WorkerResponse } from '@models/MessageRequests';

class BookmarkImporter {
    private readonly _db: MarkmanDb;
    private readonly _bookmarksRepository: BookmarksRepository;

    public imported = 0;
    public batchSize = 100;
    public currentBatch = 0;

    constructor(db: MarkmanDb) {
        this._db = db;
        this._bookmarksRepository = new BookmarksRepository(this._db);
    }

    async importBookmarks(
        bookmarks: BookmarkItem[],
    ): Promise<void> {
        for (const bookmark of bookmarks) {
            await this.importBookmark(bookmark);
        }

        // Send final progress update
        const message = {
            type: WorkerResponse.PGLite.ImportFinished,
            data: {
                imported: this.imported,
            }
        };
        browser.runtime.sendMessage(message);
    }

    private async importBookmark(bookmark: BookmarkItem): Promise<void> {
        if (bookmark.type == BookmarkType.Folder) {
            await this.importFolder(bookmark);
        }
        else {
            console.log("Inserting non-folder bookmark")
            const insertable = this.convertBookmarkToInsertable(bookmark);
            const inserted = await this._bookmarksRepository.insertBookmark(insertable);
        }
    }

    private async importFolder(bookmark: BookmarkItem, childParentId: number = 0): Promise<void> {
        const inserted = await this.insertBookmark(bookmark, childParentId);

        let parentId = 0;
        if (inserted) parentId = inserted.id;

        const children = bookmark.children ?? [];
        for (const child of children) {
            if (child.type == BookmarkType.Folder) {
                await this.importFolder(child, parentId);
            } else {
                await this.insertBookmark(child, parentId);
            }
        }
    }

    private async insertBookmark(bookmark: BookmarkItem, parentId: number = 0): Promise<DbBookmark | undefined> {
        const insertable = this.convertBookmarkToInsertable(bookmark, parentId);
        const inserted = await this._bookmarksRepository.insertBookmark(insertable);

        this.imported++;
        this.currentBatch++;

        console.log("Imported bookmarks: ", this.imported);
        this.currentBatch = 0;

        // Notify the modal of the progress
        const message = {
            type: WorkerResponse.PGLite.ImportBookmarks,
            data: {
                imported: this.imported,
            }
        };

        browser.runtime.sendMessage(message);

        return inserted;
    }

    private convertBookmarkToInsertable(bookmark: BookmarkItem, parentId: number = 0): any {
        const createdAt = bookmark.dateAdded ? new Date(bookmark.dateAdded) : new Date();

        const insertable: NewBookmark = {
            browserId: Number(bookmark.id),
            title: bookmark.name,
            url: bookmark.url || '',
            createdAt: createdAt,
            updatedAt: null,
            parentId: parentId,
            type: bookmark.type?.toString() as BookmarkType,
            pathFromRoot: bookmark.pathFromRoot ?? '',
            isPinned: false,
            pinOrder: null,
            domain: null,
            favIcon: null,
            tags: []
        };
        return insertable;
    }

}

export default BookmarkImporter;