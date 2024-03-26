import { createSlice, createNextState } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit';

import TreeStore from '../../services/TreeStore';
import { BookmarkItem } from '../../models/BookmarkTypes';
import { UserActionPayload } from '../../models/BookmarkActions';

export type BookmarksNodeState = {
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
  executeAction: 'bookmarks/executeAction',
  updateStorage: 'bookmarks/updateStorage'
} as const;


const treeStore = TreeStore.getInstance();
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
    executeAction: (state: BookmarksNodeState, action: PayloadAction<UserActionPayload>) => {
      const actualAction = action.payload;
      const nextState = createNextState(state, (draft)=>{
        let folder = actualAction.items[0];
        if (folder == undefined) return;
        let cloned = structuredClone(folder);

        actualAction.items = [cloned];
        treeStore.executeUserAction(actualAction);

        
        draft.selectedFolder = cloned;
        draft.selectedFolderItems = cloned.children || [];
      });

      return {...nextState};
    },
  },
  extraReducers(builder) {
   
  }
});

export const bookmarkActions = { ...bookmarkSlice.actions };
export default bookmarkSlice.reducer;
