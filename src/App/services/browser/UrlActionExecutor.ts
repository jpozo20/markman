import Browser from "webextension-polyfill";

import { BookmarkActions, SortActions, UrlActions, UserActionPayload } from "../../models/BookmarkActions";
import { BookmarkFolder, BookmarkItem, BookmarkType } from "../../models/BookmarkTypes";

// export async function openBookmarks(action: UserActionPayload, bookmarks: BookmarkItem[], actionType: UrlActions, windowId?: number,) {
export async function openBookmarks(action: UserActionPayload) {
    
    const windowId = action.param;
    const urlaction = action.executedAction as unknown as UrlActions;
    
    switch(urlaction){
        case UrlActions.Open_CurrentWindow:
            await openBookmarksCurrentWindow(action.items)
            return;
        case UrlActions.Open_NewWindow:
            await openBookmarksNewWindow(action.items);
            return;
        case UrlActions.Open_ExistingWindow:
            if(windowId == undefined) return;
            await openBookmarksExistingWindow(action.items, windowId as number);
            return;
        case UrlActions.OpenIncognito_NewWindow:
            await openBookmarksNewWindow(action.items, true);
            return;
        case UrlActions.OpenIncognito_ExistingWindow:
            if(windowId == undefined) return;
            await openBookmarksExistingWindow(action.items, windowId as number);
            return;
    }
}

async function openBookmarksCurrentWindow(bookmarks: BookmarkItem[]) {
    const allBookmarks = mapBookmarks(bookmarks);

    //const currentWindow = await Browser.windows.getCurrent();
    for (const bookmark of allBookmarks) {
        await Browser.tabs.create({
            url: bookmark.url
        });
    }
}

async function openBookmarksNewWindow(bookmarks: BookmarkItem[], isIncognito: boolean = false) {
    const allBookmarks = mapBookmarks(bookmarks);

    await Browser.windows.create({
        incognito: isIncognito,
        url: allBookmarks.map((bookmark) => bookmark.url!)
    });
}

async function openBookmarksExistingWindow(bookmarks: BookmarkItem[], windowId: number) {
    const allBookmarks = mapBookmarks(bookmarks);

    for (const bookmark of allBookmarks) {
        await Browser.tabs.create({
            windowId: windowId,
            url: bookmark.url
        });
    }
     await Browser.windows.update(windowId, {focused: true});
}


function mapBookmarks(bookmarks: BookmarkItem[]) {
    const allBookmarks: BookmarkItem[] = []

    function concatChildren(children: BookmarkItem[]) {
        for (const bookmarkItem of children) {
            if (bookmarkItem.type == BookmarkType.Bookmark) allBookmarks.push(bookmarkItem);
            else concatChildren(bookmarkItem.children ?? []);
        }
    }

    concatChildren(bookmarks);
    return allBookmarks;

}