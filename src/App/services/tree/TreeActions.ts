import { BookmarkActions, SortActions, UserActionPayload } from "../../models/BookmarkActions";
import { BookmarkFolder, BookmarkItem } from "../../models/BookmarkTypes";

function executeAction(action: UserActionPayload): BookmarkItem | undefined {
    switch (action.actionType) {
        case BookmarkActions.SortActions:
            if (action.items.length == 1) return sortBookmarks(action.items[0], action.executedAction as SortActions);
            return;
        default:
            return;
    }
}

const sortDirection = {
    ASC: "ASC",
    DESC: "DESC"
}

function sortBookmarks(selectedFolder: BookmarkFolder, sortAction: SortActions) {
    switch (sortAction) {
        case SortActions.SortAscending:
            return sortByNameAsc(selectedFolder);
        case SortActions.SortDecending:
            return sortByNameDesc(selectedFolder);
        default:
            return selectedFolder;
    }

}

function sortByNameAsc(selectedFolder: BookmarkFolder): BookmarkFolder {

    if (selectedFolder.children == undefined) return selectedFolder;

    const childrenCopy = [...selectedFolder.children!];
    let sortedChildren = sortItemsBy(childrenCopy, sortDirection.ASC);
    // sortedChildren = sortedChildren.map((item, index) => {
    //     const newItem = { ...item };
    //     newItem.index = index;
    //     return newItem;
    // });
    sortedChildren = sortedChildren.map(mapChildren);

    selectedFolder.children = sortedChildren;
    return selectedFolder;
}

function sortByNameDesc(selectedFolder: BookmarkFolder): BookmarkFolder {

    const newFolder = { ...selectedFolder };
    if (newFolder.children == undefined) return selectedFolder;

    let sortedChildren = sortItemsBy(newFolder.children, sortDirection.DESC);
    sortedChildren = sortedChildren.map(mapChildren);

    newFolder.children = sortedChildren;
    return newFolder;
}

function sortItemsBy(items: BookmarkItem[], sortBy: string): BookmarkItem[] {

    function localeCompare(itemA: BookmarkItem, itemB: BookmarkItem) {
        const nameA = itemA.name.toUpperCase();
        const nameB = itemB.name.toUpperCase();

        if (sortBy == sortDirection.ASC) return nameA.localeCompare(nameB, 'en', { numeric: true });
        if (sortBy == sortDirection.DESC) return nameB.localeCompare(nameA, 'en', { numeric: true });
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
    return newItem;
}

export { executeAction, sortBookmarks };