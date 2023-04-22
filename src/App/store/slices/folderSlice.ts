import browser from 'webextension-polyfill';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { BookmarksAdapter } from '../../services/adapter/BookmarksAdapter';
import { BookmarkItem, BookmarkType, BookmarkFolder } from '../../models/BookmarkTypes';

export type FoldersState = {
  tree: BookmarkItem[] | undefined;
  error: string | null;
};
const initialState: FoldersState = {
  tree: [],
  error: '',
};

const actionNames = {
  getBookmarksTree: 'folders/getBookmarksTree',
  getChildren: 'folders/getChildren',
  deleteFolder: 'folders/deleteFolder',
} as const;

const adapter = new BookmarksAdapter();

const getBookmarksTree = createAsyncThunk(actionNames.getBookmarksTree, async () => {
  const tree = await browser.bookmarks.getTree();
  return adapter.convertTree(tree);
});

const getChildren = createAsyncThunk(
  actionNames.getChildren,
  async (folderId: string) => {
    const children = await browser.bookmarks.getChildren(folderId);
    return adapter.convertChildren(children);
  },
);

const deleteFolder = createAsyncThunk(
  actionNames.deleteFolder,
  async (folderId: string) => {
    await browser.bookmarks.removeTree(folderId);
  },
);

export const folderSlice = createSlice({
  name: 'folders',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getBookmarksTree.fulfilled, (state, action) => {
        state.tree = action.payload;
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
      });
  },
});

export { getBookmarksTree, getChildren, deleteFolder };
export default folderSlice.reducer;
