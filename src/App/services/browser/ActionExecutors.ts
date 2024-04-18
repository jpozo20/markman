import { BookmarkActions, SortActions, UserActionPayload } from "../../models/BookmarkActions";
import { BookmarkFolder, BookmarkItem, BookmarkType } from "../../models/BookmarkTypes";

import { sortBookmarks } from "./SortActionExecutor";
import { openBookmarks } from "./UrlActionExecutor";

function executeAction(action: UserActionPayload): BookmarkItem | undefined {
    switch (action.actionType) {
        case BookmarkActions.SortActions:
            if (action.items.length == 1) return sortBookmarks(action.items[0], action.executedAction as unknown as SortActions);
            return;
        case BookmarkActions.UrlActions:
            openBookmarks(action);
            return;
        default:
            return;
    }
}

export {executeAction};