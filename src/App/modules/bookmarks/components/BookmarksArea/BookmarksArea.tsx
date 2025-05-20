import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { bookmarkActions } from '../../../../store/slices/bookmarkSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

import BookmarksTree from '../TreeView/BookmarksTree';
import FolderMenu from './FolderMenu';
import useWindowSize from '../../hooks/useWindowSize';


const BookmarksArea = () => {
  const dispatch = useAppDispatch();

  const windowSize = useWindowSize();
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [renderedHeight, setRenderedHeight] = useState(0);



  const selectedFolder = useAppSelector(state => state.bookmarks.selectedFolder);
  const sidebarSelectedItem = useAppSelector(state => state.bookmarks.sidebarSelectedItem);

  useEffect(() => {
    const loadItems = () => {
      try {
        if (sidebarSelectedItem && sidebarSelectedItem.pathFromRoot != undefined) {
          dispatch(bookmarkActions.getFolderChildren(sidebarSelectedItem));
          //chrome.runtime.sendMessage("bfocajfjmmbgbnmbcpmpkajfijflpnhe",{type: 'pglite', message:'message for pglite'})
          //.then((response) => {console.log(response)});
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadItems();
  }, [sidebarSelectedItem]);

  useLayoutEffect(() => {
    if (!mainAreaRef.current) return;
    if (!sidebarSelectedItem) return;

    const mainDiv = mainAreaRef.current;

    const folderMenu = mainDiv?.childNodes[0] as HTMLDivElement;
    const treeview = mainDiv?.childNodes[1] as HTMLDivElement;

    const folderMenuHeight = folderMenu.getBoundingClientRect().height;
    const treeviewPosition = treeview.getBoundingClientRect().top;

    const desiredHeight = Math.floor(windowSize.height - treeviewPosition - folderMenuHeight);
    setRenderedHeight(desiredHeight);
  }, [sidebarSelectedItem, windowSize]);


  return (
    <main ref={mainAreaRef} id="main-area" className="flex flex-col space-y-4 w-full px-8 py-6">
      {sidebarSelectedItem ? <FolderMenu folderName={sidebarSelectedItem?.name} /> : null}
      <BookmarksTree items={selectedFolder?.children} desiredHeight={renderedHeight} />
    </main>
  );
};

export default BookmarksArea;
