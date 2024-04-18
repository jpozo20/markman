import { AnyAction, createAsyncThunk, createSlice, ThunkAction } from "@reduxjs/toolkit";

import { BookmarkActions, UserActionPayload } from "../../models/BookmarkActions";
import { RootState } from "../store";
import TreeStore from "../../services/TreeStore";
import { bookmarkActions } from "./bookmarkSlice";

import * as UrlActionExecutor from "../../services/browser/UrlActionExecutor";

const actionNames = {
    executeAction: 'app/executeAction',

    saveBookmarks: 'app/saveBookmarksToStorage',
    loadBookmarksFromStorage: 'app/loadBookmarksFromStorage',
    loadBookmarksFromBrowser: 'app/loadBookmarksFromBrowser'
} as const;

export type AppSliceState = {
    isLoadingBookmarks: boolean;
    shouldUpdateStorage: boolean;
}

const initialState: AppSliceState = {
    isLoadingBookmarks: true,
    shouldUpdateStorage: false
}


type VoidThunk<TState> = ThunkAction<void, TState, any, AnyAction>;


const treeStore = TreeStore.getInstance();
const saveBookmarksToStorage = createAsyncThunk(
    actionNames.saveBookmarks,
    async (_, thunkApi) => {

        const bookmarksTree = treeStore.getTree();
        if (bookmarksTree == undefined || bookmarksTree.root.children == undefined) thunkApi.rejectWithValue(null);

        console.log("Saving bookmarks to storage");
        await treeStore.saveBookmarksToStorage(bookmarksTree);
        thunkApi.fulfillWithValue(null);
    }
);

const loadBookmarksFromStorage = createAsyncThunk(
    actionNames.loadBookmarksFromStorage,
    async () => {
        console.log("Loading bookmarks from storage");
        return await treeStore.loadBookmarksFromStorage();
    }
);

export const appStateSlice = createSlice({
    name: 'appState',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder.addCase(bookmarkActions.executeAction, (state, action) => {
            state.shouldUpdateStorage = true;
        }),
            builder.addCase(loadBookmarksFromStorage.fulfilled, (state, action) => {
                state.isLoadingBookmarks = false
            }),
            builder.addCase(loadBookmarksFromStorage.rejected, (state, action) => {
                state.isLoadingBookmarks = false
            }),
            builder.addCase(saveBookmarksToStorage.fulfilled, (state, action) => {
                state.shouldUpdateStorage = false;
            }),
            builder.addCase(saveBookmarksToStorage.rejected, (state, action) => {
                state.shouldUpdateStorage = false;
            })
    }
});

const executeBookmarkAction = (action: UserActionPayload): VoidThunk<RootState> => (dispatch, getState) => {
    if(action.actionType == BookmarkActions.SortActions){
        dispatch(bookmarkActions.executeAction(action));
    } else {
        UrlActionExecutor.openBookmarks(action);
    }
}

export const appThunks = { executeBookmarkAction };
export const asyncAppThunks = { saveBookmarksToStorage, loadBookmarksFromStorage };

export const appStateActions = { ...appStateSlice.actions };
export default appStateSlice.reducer;