import browser from 'webextension-polyfill';
import SearchTrie from './search/SearchTrie';
import { BookmarkFolder, BookmarkItem, BookmarkType, BookmarksTree } from "../models/BookmarkTypes";

import { saveBookmarksTree, loadBookmarksTree } from '../services/storage/storageService';

class TreeStore {
    private _map: Map<string, BookmarkItem>;
    private _tree: BookmarksTree;
    private _searchTrie: SearchTrie;

    private static _instance: TreeStore;

    private constructor() {
        this._tree = { root: { id: '', name: '' } };
        this._map = new Map<string, BookmarkItem>();
        this._searchTrie = new SearchTrie();
    }

    public static getInstance() {
        if(!this._instance){
            this._instance = new TreeStore();
        }
        return this._instance;
    }

    public async createBookmarksTree(treeRoot: browser.Bookmarks.BookmarkTreeNode): Promise<BookmarksTree | undefined> {
        try {
            const root = this.convertFolder(treeRoot);
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

    private convertBookmark(item: browser.Bookmarks.BookmarkTreeNode, parenthPath: string = ""): BookmarkItem {
        
        const currentIndex = item.index?.toString() || "";
        const currentPath = parenthPath == "" ? currentIndex : "/" + currentIndex;
        const pathFromRoot = parenthPath.concat(currentPath);

        const adapted: BookmarkItem = {
            ...item,
            name: item.title,
            type: BookmarkType.Bookmark,
            children: undefined,
            pathFromRoot
        };

        this._map.set(item.id, adapted);
        return adapted;
    }

    private convertFolder(item: browser.Bookmarks.BookmarkTreeNode, parenthPath: string = "", mapChildren: boolean = true): BookmarkFolder {

        const currentIndex = item.index?.toString() || "";
        const currentPath = parenthPath == "" ? currentIndex : "/" + currentIndex;
        const pathFromRoot = item.parentId ? parenthPath.concat(currentPath) : "";

        let children;
        if (mapChildren) children = this.convertChildren(item.children, pathFromRoot);

        const adapted: BookmarkFolder = {
            ...item,
            name: item.title,
            type: BookmarkType.Folder,
            lastModified: item.dateGroupModified,
            children,
            pathFromRoot
        };
        this._map.set(item.id, adapted);
        return adapted;
    }

    convertChildren(
        children: browser.Bookmarks.BookmarkTreeNode[] | undefined,
        parenthPath: string = ""
    ): BookmarkItem[] | undefined {
        if (children == null || children == undefined) return undefined;

        const adaptedChildren: BookmarkItem[] = [];
        for (const child of children) {
            if (child.children) {
                const adapted = this.convertFolder(child, parenthPath);
                adaptedChildren.push(adapted);
            } else {
                const adapted = this.convertBookmark(child, parenthPath);
                adaptedChildren.push(adapted);
            }
        }

        return adaptedChildren;
    }

    public getChildrenFromPath(path: string | undefined): BookmarkItem[]{
        if(path == undefined || path == '') return [];
        let currentChild: BookmarkItem =  this._tree.root;
        const indexList = path.split("/");
        for(let currentIndex = 0; currentIndex < indexList.length; currentIndex++){
            let currentPathIndex = +indexList[currentIndex];

            currentChild = currentChild.children![currentPathIndex];
        }
        return currentChild?.children || [];
    }
}
export default TreeStore;