import Browser from 'webextension-polyfill';
import TreeStore from '../../services/TreeStore';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type BookmarksNodeState = {
  bookmarks: Browser.Bookmarks.BookmarkTreeNode[];
  error: string | null;
};
const initialState: BookmarksNodeState = {
  bookmarks: [],
  error: '',
};

const actionNames = {
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

// const treeStore = new TreeStore();
// const newTree = await treeStore.createBookmarksTree(tree[0]);

export const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {},
});

export { deleteBookmarks };
export default bookmarkSlice.reducer;
