import { BookmarksTree } from '../../models/BookmarkTypes';
import Browser from 'webextension-polyfill';

const keys = {
    userBookmarks: 'userBookmarks',
    userSettings: 'userSettings',
    bookmarksIndex: 'bookmarksIndex'
};

const saveBookmarksTree = async (userBookmarks: BookmarksTree): Promise<void> => {
    try {
        const key = keys.userBookmarks;
        const storage = Browser.storage.local;
        await storage.set({ [key]: userBookmarks});
    } catch (error) {
        console.log(error)
    }
};

const loadBookmarksTree = async(): Promise<BookmarksTree | undefined> => {
    const storage = Browser.storage.local;
    const {userBookmarks} = await storage.get(keys.userBookmarks);

    return userBookmarks;
}

const saveUserSettings = async () => {}
const loadUserSettings = async () => {}

export {saveBookmarksTree, loadBookmarksTree};