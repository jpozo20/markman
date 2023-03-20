import { configureStore } from '@reduxjs/toolkit';
import { folderSlice } from './slices/folderSlice';
import { bookmarkSlice } from './slices/bookmarkSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    folders: folderSlice.reducer,
    bookmarks: bookmarkSlice.reducer,
  },
});

export default store;
export type appDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => appDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
