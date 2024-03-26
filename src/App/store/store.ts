import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { appStateSlice } from './slices/appSlice';
import { browserSlice } from './slices/browserSlice';
import { bookmarkSlice } from './slices/bookmarkSlice';
import listenerMiddleware from './middleware/stateChangeListener';

export const store = configureStore({
  reducer: {
    browserApi: browserSlice.reducer,
    bookmarks: bookmarkSlice.reducer,
    appState: appStateSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  }
});

export default store;
export type appDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => appDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
