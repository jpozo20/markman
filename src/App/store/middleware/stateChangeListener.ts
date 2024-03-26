import { createListenerMiddleware, TypedStartListening } from "@reduxjs/toolkit";

import { RootState, appDispatch } from "../store";
import { asyncAppThunks } from "../slices/appSlice";

export type StateChangeListener = TypedStartListening<RootState, appDispatch>
const listenerMiddleware = createListenerMiddleware({
    onError: (error, errorInfo) => {
        console.log("Error ocurred in listener middleware", error, errorInfo);
    }
});

let hasRun = false;
const stateChangeListener = listenerMiddleware.startListening as StateChangeListener;
stateChangeListener({
    predicate: (action, currentState, previousState) => {
        const shouldUpdateStorage = currentState.appState.shouldUpdateStorage;
        const isUserAction = action.type.indexOf('executeAction') >= 0;

        const userActionExecuted = shouldUpdateStorage && isUserAction;
        const bookmarkWereSaved = action.type.indexOf('saveBookmarksToStorage/fulfilled') >= 0;
        const bookmarkSaveError = action.type.indexOf('saveBookmarksToStorage/rejected') >= 0;
        
        return userActionExecuted || bookmarkWereSaved || bookmarkSaveError;
    },
    effect: (action, listenerApi) => {
        const actualState = listenerApi.getState();
        const shouldUpdateStorage = actualState.appState.shouldUpdateStorage;
        const bookmarkWereSaved = action.type.indexOf('saveBookmarksToStorage/fulfilled') >= 0;

        if (shouldUpdateStorage && !bookmarkWereSaved) {
            if (hasRun) return;
            listenerApi.dispatch(asyncAppThunks.saveBookmarksToStorage())
            hasRun = true;
        } else {
            hasRun = false;
        }
    }
});

export default listenerMiddleware;