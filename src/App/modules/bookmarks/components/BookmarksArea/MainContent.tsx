import React, { useEffect } from 'react'

import Sidebar from '../Sidebar/Sidebar';
import BookmarksArea from './BookmarksArea';

import { appStateActions, asyncAppThunks } from '../../../../store/slices/appSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { asyncBrowserThunks } from '../../../../store/slices/browserSlice';

const MainContent = () => {

    const dispatch = useAppDispatch();
    const shouldShow = useAppSelector((state) => state.appState.hasBookmarks);
    const bookmarksLoading = useAppSelector((rootState) => rootState.appState.isLoadingBookmarks);

    useEffect(() => {

        // Load bookmarks from localStorage. If bookmarks are not in localStorage, 
        // load from Browser and save them to localStorage
        async function loadBookmarks() {
            if (!bookmarksLoading) return;

            try {
                let tree: any = undefined;

                // let tree = await dispatch(asyncAppThunks.loadBookmarksFromStorage()).unwrap();
                // if (tree == undefined) tree = await dispatch(asyncBrowserThunks.getBookmarksTree()).unwrap();

                if (tree != undefined && tree.root != undefined) {
                    const hasBookmarks = tree.root.children?.length > 0;
                    dispatch(appStateActions.setHasBookmarks(hasBookmarks));
                }

            } catch (error) {
                console.log("Error loading bookmarks from useEffect");
            }
        }

        loadBookmarks();
    }, [useAppDispatch, bookmarksLoading]); 
    
    const content = (
        <div id="main-content" className="h-full flex flex-row">
            <Sidebar />
            <BookmarksArea />
        </div>
    );
    return shouldShow ? content : null;
}

export default MainContent;