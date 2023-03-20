import browser from 'webextension-polyfill';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type BookmarksNodeState = {
  bookmarks: browser.Bookmarks.BookmarkTreeNode[];
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
      async (bookmarkId) => await browser.bookmarks.remove(bookmarkId),
    );
  },
);

export const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {},
});

export { deleteBookmarks };
export default bookmarkSlice.reducer;
