import { BookmarkItem } from "./BookmarkTypes";

 enum SortActions {
    SortAscending = 'SortASC',
    SortDecending = 'SortDESC',
    SortAscendingByFolder = 'SortASC_Folder',
    SortDescendingByFolder = 'SortDESC_Folder',
}

const SortOptions = {
    [SortActions.SortAscending]: "Sort by Name ASC",
    [SortActions.SortDecending]: "Sort by Name DESC",
    [SortActions.SortAscendingByFolder]: "Sort by Folder ASC",
    [SortActions.SortDescendingByFolder]: "Sort by Folder DESC",
}

enum ItemActions {
    EditItem = "EditItem",
    MoveItem = "MoveItem",
    DeleteItem = "DeleteItem",
    UpdateItem = "UpdateItem"
}

const enum BookmarkActions {
    SortActions = "SortActions",
    ItemActions = "ItemActions"
}

type UserActionPayload = {
    items: BookmarkItem[],
    actionType: BookmarkActions,
    executedAction: ItemActions | SortActions
}

export {BookmarkActions, ItemActions, SortActions, SortOptions, UserActionPayload};