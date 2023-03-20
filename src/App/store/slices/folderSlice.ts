import browser from 'webextension-polyfill';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type FoldersState = {
  tree: browser.Bookmarks.BookmarkTreeNode[];
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

const getBookmarksTree = createAsyncThunk(
  actionNames.getBookmarksTree,
  async () => {
    return await browser.bookmarks.getTree();
  },
);

const getChildren = createAsyncThunk(
  actionNames.getChildren,
  async (folderId: string) => {
    return await browser.bookmarks.getChildren(folderId);
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
        const parent = state.tree.find((bookmark) => bookmark.id == parentId);
        if (!parent) return;
        parent.children = action.payload;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        const parentId = action.meta.arg;
        const parentIndex = state.tree.findIndex(
          (bookmark) => bookmark.id == parentId,
        );
        if (parentIndex < 0) return;

        state.tree = state.tree.splice(parentIndex, 1);
      });
  },
});

export { getBookmarksTree, getChildren, deleteFolder };
export default folderSlice.reducer;
