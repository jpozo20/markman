import browser from 'webextension-polyfill';
import SearchTrie from './search/SearchTrie';
import { BookmarkFolder, BookmarkItem, BookmarksTree } from "../models/BookmarkTypes";

import { BookmarksAdapter } from './adapter/BookmarksAdapter';
import { saveBookmarksTree, loadBookmarksTree } from './storage/storageService';
import { UserActionPayload } from '../models/BookmarkActions';
import { executeAction } from './tree/TreeActions';
import { createNextState as produce } from '@reduxjs/toolkit'


class TreeStore {
    private _adapter: BookmarksAdapter;
    private _map: Map<string, BookmarkItem>;
    private _tree: BookmarksTree;
    private _searchTrie: SearchTrie;

    private static _instance: TreeStore;

    private constructor() {
        this._tree = { root: { id: '', name: '' } };
        this._map = new Map<string, BookmarkItem>();
        this._searchTrie = new SearchTrie();
        this._adapter = new BookmarksAdapter(this._map);
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new TreeStore();
        }
        return this._instance;
    }

    public getTree() {
        return this._tree;
    }

    public async createBookmarksTree(treeRoot: browser.Bookmarks.BookmarkTreeNode): Promise<BookmarksTree | undefined> {
        try {
            const root = this._adapter.convertFolder(treeRoot);
            this._tree.root = root;

            await saveBookmarksTree(this._tree);
        } catch (error) {
            console.log("Error creating bookmarks tree", error);
        }

        return this._tree;
    }

    public async saveBookmarksToStorage(tree: BookmarksTree): Promise<void> {
        try {
            await saveBookmarksTree(tree);
        } catch (error) {
            console.log("Error saving bookmarks tree", error);
        }

    }
    public async loadBookmarksFromStorage(): Promise<BookmarksTree | undefined> {
        try {
            const tree = await loadBookmarksTree();
            if (tree == undefined) return tree;
            this._tree = tree;
        } catch (error) {
            console.log("Error occurred loading bookmarks", error);
        }

        return this._tree;
    }

    public getFolderFromPath(path: string | undefined): BookmarkFolder | undefined {
        if (path == undefined || path == '') return undefined;
        let currentChild: BookmarkItem = this._tree.root;
        const indexList = path.split("/");
        for (let currentIndex = 0; currentIndex < indexList.length; currentIndex++) {
            let currentPathIndex = +indexList[currentIndex];

            currentChild = currentChild.children![currentPathIndex];
        }
        return currentChild;
    }

    public getChildrenFromPath(path: string | undefined): BookmarkItem[] {
        const currentFolder = this.getFolderFromPath(path);
        return currentFolder?.children || [];
    }

    public executeUserAction(userAction: UserActionPayload): BookmarkItem[] | undefined {
        const result = executeAction(userAction);
        if (result == undefined) return result;

        if (userAction.items.length == 1) this.updateFolderAtPath(result.pathFromRoot!, result);
        return [result];
    }

    public updateTree(treeRoot: BookmarksTree) {
        this._tree = treeRoot;
    }

    private updateFolderAtPath(path: string, folder: BookmarkFolder) {
        if (path == undefined || path == '') return undefined;

        const updatedRoot = produce(this._tree.root, (draft) => {

            const indexList = path.split("/");
            let currentChild: BookmarkItem = draft;

            for (let currentIndex = 0; currentIndex < indexList.length; currentIndex++) {
                let currentPathIndex = +indexList[currentIndex];

                currentChild = currentChild.children![currentPathIndex];
                if (currentChild.pathFromRoot == path) {
                    currentChild.children = folder.children;
                }
            }
        });

        this._tree.root = updatedRoot;
    }


    private testTrieSearch() {
        for (const [path, bookmark] of this._map) {
            this._searchTrie.indexBookmarkTitle(bookmark);
        }

        console.log("Bookmarks count", this._map.size);
        console.log("Word index size", this._searchTrie.getWordsIndexSize());
        console.log("Trie size", this._searchTrie.getTrieSize());

        let foundBookMarks = [];
        const searchResults = this._searchTrie.findAllWords('money');
        for (const worldResult of searchResults) {
            const bookmarkResults = this._searchTrie.findBookmarksFromWord(worldResult);
            foundBookMarks = foundBookMarks.concat(bookmarkResults as any);
        }

        console.log("Search results:", foundBookMarks);
    }
}
export default TreeStore;