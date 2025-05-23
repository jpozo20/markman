const enum BookmarkType {
  Bookmark = 'bookmark',
  Folder = 'folder',
}
/**
 * Represents an item in the Bookmarks Bar
 */
interface BookmarkItem {
  id: string;
  url?: string;
  name: string;
  /**
   * The list of children item associated to this folder
   */
  children?: BookmarkItem[];

  index?: number;
  dateAdded?: number | null;
  parentId?: string;
  type?: BookmarkType;
  pathFromRoot?: string;
}

/**
 * Represents a folder in the Bookmarks Bar
 */
interface BookmarkFolder extends Omit<BookmarkItem, 'url'> {
  /**
   * Last time this folder was modified in ms since epoch
   */
  lastModified?: number;
}

interface BookmarksTree {
  root: BookmarkItem;
  bookmarksBar?: BookmarkItem[];
  otherBookmarks?: BookmarkItem[];
  mobileBookmarks?: BookmarkItem[];
}

export { BookmarkType, BookmarkItem, BookmarkFolder, BookmarksTree };
