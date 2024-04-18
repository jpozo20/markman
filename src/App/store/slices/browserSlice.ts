import Browser from 'webextension-polyfill';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { BookmarkItem, BookmarkType, BookmarkFolder } from '../../models/BookmarkTypes';
import TreeStore from '../../services/TreeStore';
import { BookmarksAdapter } from '../../services/adapter/BookmarksAdapter';

export type BrowserApiState = {
  error: string | null;
  tree: BookmarkItem[] | undefined;
  selectedFolder?: BookmarkItem;
};
const initialState: BrowserApiState = {
  tree: [],
  error: '',
};

const actionNames = {
  getBookmarksTree: 'browser/getBookmarksTree',
  getChildren: 'browser/getChildren',

  deleteFolder: 'browser/deleteFolder',
  selectFolder: 'browser/selectFolder',
  deleteBookmarks: 'browser/deleteBookmarks',

  getExistingWindows: 'browser/getExistingWindows',
  getExistingIncognitoWindows: 'browser/getExistingIncognitoWindows'
} as const;

const adapter = new BookmarksAdapter();
const treeStore = TreeStore.getInstance();

const getBookmarksTree = createAsyncThunk(actionNames.getBookmarksTree, async () => {
  console.log("Loading bookmarks from browser");
  const tree = await Browser.bookmarks.getTree();
  return treeStore.createBookmarksTree(tree[0]);
});

const getChildren = createAsyncThunk(
  actionNames.getChildren,
  async (folderId: string) => {
    const folder = await Browser.bookmarks.getSubTree(folderId);
    return adapter.convertChildren(folder[0]?.children);
  },
);

const deleteFolder = createAsyncThunk(
  actionNames.deleteFolder,
  async (folderId: string) => {
    await Browser.bookmarks.removeTree(folderId);
  },
);

const deleteBookmarks = createAsyncThunk(
  actionNames.deleteBookmarks,
  async (bookmarkIds: string[]) => {
    if (!bookmarkIds || !bookmarkIds.length) return;
    bookmarkIds.forEach(
      async (bookmarkId) => await Browser.bookmarks.remove(bookmarkId),
    );
  },
);

const getExistingWindows = createAsyncThunk(
  actionNames.getExistingWindows,
  async () => {
    const windows = await Browser.windows.getAll({ windowTypes: ['normal'], populate: true });
    const normalWindows = windows.filter((window) => window.incognito == false);
    return normalWindows;
  }
);

const getExistingIncognitoWindows = createAsyncThunk(
  actionNames.getExistingWindows,
  async () => {
    const windows = await Browser.windows.getAll({ windowTypes: ['normal'], populate: true });
    const normalWindows = windows.filter((window) => window.incognito == true);
    return normalWindows;
  }
);

export const browserSlice = createSlice({
  name: 'browser',
  initialState: initialState,
  reducers: {
    selectFolder: (state: BrowserApiState, action: PayloadAction<BookmarkItem>) => {
      state.selectedFolder = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getBookmarksTree.fulfilled, (state, action) => {
        let root = action.payload?.root;
        if (root != undefined) state.tree = [root];
      })
      .addCase(getBookmarksTree.rejected, (state, action) => {
        state.error = 'An error ocurred loading the bookmarks tree';
      })
      .addCase(getChildren.fulfilled, (state, action) => {
        const parentId = action.meta.arg;
        const parent = state.tree?.find((bookmark) => bookmark.id == parentId);
        if (!parent) return;

        if (parent.type == BookmarkType.Folder) {
          const folder = parent as BookmarkFolder;
          folder.children = action.payload;
        }
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        const parentId = action.meta.arg;
        const parentIndex = state.tree?.findIndex((bookmark) => bookmark.id == parentId);
        if (!parentIndex || +parentId < 0) return;

        state.tree = state.tree?.splice(parentIndex, 1);
      })
      .addCase(deleteBookmarks.fulfilled, (state, action) => {

      });
  },
});

export const brwoserActions = { ...browserSlice.actions };
export const asyncBrowserThunks = { getBookmarksTree, getChildren, deleteFolder, getExistingWindows, getExistingIncognitoWindows };
export default browserSlice.reducer;
