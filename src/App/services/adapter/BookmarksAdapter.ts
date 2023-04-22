import Browser from 'webextension-polyfill';
import { BookmarkItem, BookmarkType, BookmarkFolder } from '../../models/BookmarkTypes';

export class BookmarksAdapter {
  convertTree(tree: Browser.Bookmarks.BookmarkTreeNode[]): BookmarkItem[] | undefined {
    const converted = this.convertChildren(tree);
    return converted;
  }

  private convertBookmark(item: Browser.Bookmarks.BookmarkTreeNode): BookmarkItem {
    const adapted: BookmarkItem = {
      ...item,
      name: item.title,
      type: BookmarkType.Bookmark,
      children: undefined,
    };
    return adapted;
  }

  private convertFolder(item: Browser.Bookmarks.BookmarkTreeNode): BookmarkFolder {
    const adapted: BookmarkFolder = {
      ...item,
      name: item.title,
      type: BookmarkType.Folder,
      lastModified: item.dateGroupModified,
      children: this.convertChildren(item.children),
    };
    return adapted;
  }

  convertChildren(
    children: Browser.Bookmarks.BookmarkTreeNode[] | undefined,
  ): BookmarkItem[] | undefined {
    if (children == null || children == undefined) return undefined;

    const adaptedChildren: BookmarkItem[] = [];
    for (const child of children) {
      if (child.children) {
        const adapted = this.convertFolder(child);
        adaptedChildren.push(adapted);
      } else {
        const adapted = this.convertBookmark(child);
        adaptedChildren.push(adapted);
      }
    }

    return adaptedChildren;
  }
}
