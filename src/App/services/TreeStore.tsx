import Browser from 'webextension-polyfill';
import { BookmarkFolder, BookmarkItem, BookmarkType, BookmarksTree } from "../models/BookmarkTypes";
import SearchTrie from './search/SearchTrie';

class TreeStore {
    private _map: Map<string, BookmarkItem>;
    private _tree: BookmarksTree;
    private _searchTrie: SearchTrie;

    constructor() {
        this._tree = { root: { id: '', name: '' } };
        this._map = new Map<string, BookmarkItem>();
        this._searchTrie = new SearchTrie();
    }

    public createBookmarksTree(treeRoot: Browser.Bookmarks.BookmarkTreeNode): BookmarksTree | undefined {
        const root = this.convertFolder(treeRoot);

        this._tree.root = root;
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

    private convertBookmark(item: Browser.Bookmarks.BookmarkTreeNode, parenthPath: string = ""): BookmarkItem {
        const pathFromRoot = parenthPath.concat(item.index!.toString());

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

    private convertFolder(item: Browser.Bookmarks.BookmarkTreeNode, parenthPath: string = "", mapChildren: boolean = true): BookmarkFolder {

        const pathFromRoot = item.parentId ? parenthPath.concat(item.index!.toString()) : "";

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
        children: Browser.Bookmarks.BookmarkTreeNode[] | undefined,
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
}
export default TreeStore;