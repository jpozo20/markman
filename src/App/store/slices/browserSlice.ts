import Browser from 'webextension-polyfill';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { BookmarksAdapter } from '../../services/adapter/BookmarksAdapter';
import { BookmarkItem, BookmarkType, BookmarkFolder } from '../../models/BookmarkTypes';

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
  deleteBookmarks: 'bookmarks/deleteBookmarks',
} as const;

const adapter = new BookmarksAdapter();


const getBookmarksTree = createAsyncThunk(actionNames.getBookmarksTree, async () => {
  const tree = await Browser.bookmarks.getTree();
  return adapter.convertTree(tree);
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

export const browserSlice = createSlice({
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
      })
      .addCase(deleteBookmarks.fulfilled, (state, action)=>{

      });
  },
});

export const folderActions = { ...browserSlice.actions };
export { getBookmarksTree, getChildren, deleteFolder };
export default browserSlice.reducer;