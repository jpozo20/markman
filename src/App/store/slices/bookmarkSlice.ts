import Browser from 'webextension-polyfill';
import TreeStore from '../../services/TreeStore';
import { RootState } from '../store';
import { createSlice, createNextState } from '@reduxjs/toolkit'
import { createAsyncThunk, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit';

import { BookmarkItem } from '../../models/BookmarkTypes';
import { UserActionPayload } from '../../models/BookmarkActions';

const treeStore = TreeStore.getInstance();

type BookmarksNodeState = {
  error?: string | null;
  selectedFolder?: BookmarkItem;
  sidebarSelectedItem?: BookmarkItem;
  selectedFolderItems: BookmarkItem[];
};
const initialState: BookmarksNodeState = {
  sidebarSelectedItem: undefined,
  selectedFolderItems: [],
  error: '',
};

const actionNames = {
  saveBookmarks: 'bookmarks/saveBookmarksToStorage',
  loadBookmarks: 'bookmarks/loadBookmarksFromStorage',
  deleteBookmarks: 'bookmarks/deleteBookmarks',
  executeAction: 'bookmarks/executeAction'
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
  async () => await treeStore.loadBookmarksFromStorage()
);

export const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
     setSelectedFolder: (state: BookmarksNodeState, action: PayloadAction<BookmarkItem>) => {
      state.selectedFolder = action.payload;
      state.selectedFolderItems = action.payload.children || [];
    },
    selectSidebarItem: (state: BookmarksNodeState, action: PayloadAction<BookmarkItem>) => {
      state.selectedFolder = treeStore.getFolderFromPath(action.payload.pathFromRoot);
      state.sidebarSelectedItem = action.payload;
    },
    getFolderChildren: (state: BookmarksNodeState, action: PayloadAction<BookmarkItem>) => {
      const path = action.payload.pathFromRoot;
      const folderChildren = treeStore.getChildrenFromPath(path);
      state.selectedFolderItems = folderChildren;
    },
    // updateFolder: (state: BookmarksNodeState, action: PayloadAction<BookmarkItem>) => {
    //   const path = action.payload.pathFromRoot;
    //   const payloadFolder = action.payload;
    //   let folder = treeStore.getFolderFromPath(path);
    //   folder = { ...folder, ...payloadFolder };

    // },
  },
  extraReducers(builder) {
    builder.addCase(loadBookmarksFromStorage.fulfilled, (state, action) => {
      //state.bookmarks = action.payload;
    })
  }
});

type VoidThunk<TState> = ThunkAction<void, TState, any, AnyAction>;
const executeBookmarkAction = (action: UserActionPayload): VoidThunk<RootState> => (dispatch, getState) => {

  const baseState = getState().bookmarks;

  const updatedState = createNextState(baseState, (draft) => {
    let folder = action.items[0];
    if (folder == undefined) return;
    let cloned = structuredClone(folder);
    draft.selectedFolder = cloned;

    action.items = [cloned];
    treeStore.executeUserAction(action);
    
  });
  
  const actions = {...bookmarkActions};
  dispatch(actions.setSelectedFolder(updatedState.selectedFolder!));
  
}


export const selectors = {
  selectedFolder: (state: BookmarksNodeState) => state.selectedFolder,
  selectedSideBarItems: (state: BookmarksNodeState) => state.sidebarSelectedItem
};

export const bookmarkThunks = { executeBookmarkAction };
export const asyncBookmarkThunks = { deleteBookmarks, saveBookmarksToStorage, loadBookmarksFromStorage };
export const bookmarkActions = { ...bookmarkSlice.actions };

export default bookmarkSlice.reducer;
