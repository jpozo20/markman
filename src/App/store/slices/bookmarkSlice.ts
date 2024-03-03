import Browser from 'webextension-polyfill';
import TreeStore from '../../services/TreeStore';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BookmarkItem, BookmarksTree } from '../../models/BookmarkTypes';

const treeStore = TreeStore.getInstance();

type BookmarksNodeState = {
  bookmarks?: BookmarksTree;
  error?: string | null;
  selectedFolder?: BookmarkItem;
  selectedFolderItems: BookmarkItem[];
};
const initialState: BookmarksNodeState = {
  bookmarks: undefined,
  selectedFolder: undefined,
  selectedFolderItems: [],
  error: '',
};

const actionNames = {
  saveBookmarks: 'bookmarks/saveBookmarksToStorage',
  loadBookmarks: 'bookmarks/loadBookmarksFromStorage',
  deleteBookmarks: 'bookmarks/deleteBookmarks',
} as const;

const deleteBookmarks = createAsyncThunk(
  actionNames.deleteBookmarks,
  async (bookmarkIds: string[]) => {
    if (!bookmarkIds || !bookmarkIds.length) return;
    bookmarkIds.forEach(
      async (bookmarkId) => await Browser.bookmarks.remove(bookmarkId),
    );
  },
);

const saveBookmarksToStorage = createAsyncThunk(
  actionNames.saveBookmarks,
  async (bookmarksTree: BookmarkItem[]) => {
    if (!bookmarksTree || !bookmarksTree.length) return;
    //await treeStore.saveBookmarksToStorage()
  }
);

const loadBookmarksFromStorage = createAsyncThunk(
  actionNames.loadBookmarks,
  async () =>  await treeStore.loadBookmarksFromStorage()
);



export const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    selectFolder: (state: BookmarksNodeState, action: PayloadAction<BookmarkItem>) => {
      state.selectedFolder = action.payload;
    },
    getFolderChildren: (state: BookmarksNodeState, action: PayloadAction<BookmarkItem>) => {
      const path = action.payload.pathFromRoot;
      const folderChildren = treeStore.getChildrenFromPath(path);
      state.selectedFolderItems = folderChildren;
    }
  },
  extraReducers(builder) {
    builder.addCase(loadBookmarksFromStorage.fulfilled, (state, action) => {
      state.bookmarks = action.payload;
    })
  }
});

export const bookmarkActions = {...bookmarkSlice.actions};
export { deleteBookmarks, saveBookmarksToStorage, loadBookmarksFromStorage };
export default bookmarkSlice.reducer;
