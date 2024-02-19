import browser from 'webextension-polyfill';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { BookmarksAdapter } from '../../services/adapter/BookmarksAdapter';
import { BookmarkItem, BookmarkType, BookmarkFolder } from '../../models/BookmarkTypes';
import TreeStore from '../../services/TreeStore';

export type FoldersState = {
  tree: BookmarkItem[] | undefined;
  error: string | null;
  selectedFolder?: BookmarkItem;
};
const initialState: FoldersState = {
  tree: [],
  error: '',
};

const actionNames = {
  getBookmarksTree: 'folders/getBookmarksTree',
  getChildren: 'folders/getChildren',
  deleteFolder: 'folders/deleteFolder',
  selectFolder: 'folders/selectFolder',
} as const;

const adapter = new BookmarksAdapter();
const treeStore = new TreeStore();

const getBookmarksTree = createAsyncThunk(actionNames.getBookmarksTree, async () => {
  const tree = await browser.bookmarks.getTree();
  const newTree = treeStore.createBookmarksTree(tree[0]);
  return adapter.convertTree(tree);
});

const getChildren = createAsyncThunk(
  actionNames.getChildren,
  async (folderId: string) => {
    const folder = await browser.bookmarks.getSubTree(folderId);
    return adapter.convertChildren(folder[0]?.children);
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
  reducers: {
    selectFolder: (state: FoldersState, action: PayloadAction<BookmarkItem>) => {
      state.selectedFolder = action.payload;
    },
  },
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

export const folderActions = { ...folderSlice.actions };
export { getBookmarksTree, getChildren, deleteFolder };
export default folderSlice.reducer;
