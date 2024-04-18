import { SortActions } from "../../models/BookmarkActions";
import { BookmarkFolder, BookmarkType, BookmarkItem } from "../../models/BookmarkTypes";

const SortDirection = {
    ASC: "ASC",
    DESC: "DESC"
}

export function sortBookmarks(selectedFolder: BookmarkFolder, sortAction: SortActions) {
    switch (sortAction) {
        case SortActions.SortAscending:
            return sortByName(selectedFolder, SortDirection.ASC);
        case SortActions.SortDecending:
            return sortByName(selectedFolder, SortDirection.DESC);
        case SortActions.SortAscendingByFolder:
            return sortByFolder(selectedFolder, SortDirection.ASC);
        case SortActions.SortDescendingByFolder:
            return sortByFolder(selectedFolder, SortDirection.DESC);
        default:
            return selectedFolder;
    }
}

function sortByName(selectedFolder: BookmarkFolder, sortDirection: string): BookmarkFolder {
    if (selectedFolder.children == undefined) return selectedFolder;

    const childrenCopy = [...selectedFolder.children!];
    let sortedChildren = sortItemsBy(childrenCopy, sortDirection);
    sortedChildren = sortedChildren.map(mapChildren);

    selectedFolder.children = sortedChildren;
    return selectedFolder;
}

function sortByFolder(selectedFolder: BookmarkFolder, sortDirection: string): BookmarkFolder {
    if (selectedFolder.children == undefined) return selectedFolder;

    const childrenCopy = [...selectedFolder.children!];

    const folders = childrenCopy.filter((item)=> item.type == BookmarkType.Folder);
    const bookmarks = childrenCopy.filter((item)=> item.type == BookmarkType.Bookmark);

    let sortedFolders = sortItemsBy(folders, sortDirection);
    sortedFolders = sortedFolders.map(mapChildren);

    let sortedBookmarks = sortItemsBy(bookmarks, sortDirection);
    sortedBookmarks = sortedBookmarks.map(mapChildren);

    const sortedChildren = sortedFolders.concat(sortedBookmarks);

    selectedFolder.children = sortedChildren;
    return selectedFolder;
}

function sortItemsBy(items: BookmarkItem[], sortBy: string): BookmarkItem[] {

    function localeCompare(itemA: BookmarkItem, itemB: BookmarkItem) {
        const nameA = itemA.name.toUpperCase();
        const nameB = itemB.name.toUpperCase();

        if (sortBy == SortDirection.ASC) return nameA.localeCompare(nameB, 'en', { numeric: true });
        if (sortBy == SortDirection.DESC) return nameB.localeCompare(nameA, 'en', { numeric: true });
        return 0;
    }

    const sorted = items.slice().sort(localeCompare);
    return sorted;
}

function mapChildren(item: BookmarkItem, index) {
    const newItem = { ...item };
    newItem.index = index;

    const originalPath = newItem.pathFromRoot;
    const pathArray = originalPath?.split('/');

    pathArray?.pop();
    pathArray?.push(newItem.index!.toString());

    newItem.pathFromRoot = pathArray?.join("/");

    // Update pathFromRoot of children inside subfolders
    if (newItem.children != undefined) {
        const parentPath = newItem.pathFromRoot;
        newItem.children.forEach((item) => item.pathFromRoot = parentPath + "/0");
        newItem.children = newItem.children.map(mapChildren);
    }
    return newItem;
}