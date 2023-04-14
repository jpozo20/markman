import Browser from 'webextension-polyfill';

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
      //   let adapted: BookmarkItem = {
      //     ...child,
      //     name: child.title,
      //     type: BookmarkType.Bookmark,
      //   };
      //   if (child.children && child.children?.length > 0) {
      //     const folder = adapted as BookmarkFolder;
      //     folder.type = BookmarkType.Folder;
      //     folder.lastModified = child.dateGroupModified;
      //     folder.children = this.convertChildren(child.children);
      //     adaptedChildren.push(folder);
      //   } else {
      //     adaptedChildren.push(adapted);
      //   }
      if (child.children && child.children?.length) {
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
