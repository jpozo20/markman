import Browser from 'webextension-polyfill';
import { BookmarkItem, BookmarkType, BookmarkFolder } from '../../models/BookmarkTypes';

export class BookmarksAdapter {

  private map?: Map<string, BookmarkItem>;
  constructor(map?: Map<string, BookmarkItem>) {
    this.map = map;
  }

  public convertBookmark(item: Browser.Bookmarks.BookmarkTreeNode, parenthPath: string = ""): BookmarkItem {

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

    this.map?.set(item.id, adapted);
    return adapted;
  }

  public convertFolder(item: Browser.Bookmarks.BookmarkTreeNode, parenthPath: string = "", mapChildren: boolean = true): BookmarkFolder {

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

    this.map?.set(item.id, adapted);
    return adapted;
  }

  public convertChildren(
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
