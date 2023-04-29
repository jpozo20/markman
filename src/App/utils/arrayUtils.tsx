import { BookmarkItem, BookmarkType } from '../models/BookmarkTypes';

/**
 * Maps a list of Bookmark Folder and filters those that arent folders
 * @param folderItem The bookmarks root item
 */
export const mapFolders = (folderItem: BookmarkItem): BookmarkItem | [] => {
  if (folderItem.type !== BookmarkType.Folder) return [];

  let children: BookmarkItem[] | undefined = undefined;
  if (folderItem.children && folderItem.children?.length) {
    children = folderItem.children.flatMap(mapFolders) as BookmarkItem[];
  }

  return {
    ...folderItem,
    children,
  };
};
