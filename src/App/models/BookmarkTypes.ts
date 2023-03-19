const enum BookmarkType {
  Bookmark = 'bookmark',
  Folder = 'folder',
}
/**
 * Represents an item in the Bookmarks Bar
 */
interface BookmarkItem {
  id: string
  url: string
  title: string

  index: number
  dateAdded: number | null
  parentId?: number
  type: BookmarkType
}

/**
 * Represents a folder in the Bookmarks Bar
 */
interface BookmarkFolder extends Omit<BookmarkItem, 'url'> {
  /**
   * The list of children item associated to this folder
   */
  children: [BookmarkItem | BookmarkFolder]

  /**
   * Last time this folder was modified in ms since epoch
   */
  lastModified: number
}
