import React, { useEffect } from 'react';

import { bookmarkActions } from '../../../../store/slices/bookmarkSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

import BookmarksTree from '../TreeView/BookmarksTree';
import FolderMenu from './FolderMenu';


const BookmarksArea = () => {
  const dispatch = useAppDispatch();

  const selectedFolder = useAppSelector(state => state.bookmarks.selectedFolder);
  const sidebarSelectedItem = useAppSelector(state => state.bookmarks.sidebarSelectedItem);

  useEffect(() => {
    const loadItems = () => {
      try {
        if (sidebarSelectedItem && sidebarSelectedItem.pathFromRoot != undefined) {
          dispatch(bookmarkActions.getFolderChildren(sidebarSelectedItem));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadItems();
  }, [sidebarSelectedItem]);


  return (
    <main id="main-area" className="flex flex-col space-y-4 w-full px-8 py-6">
      {sidebarSelectedItem ? <FolderMenu folderName={sidebarSelectedItem?.name} /> : null}
      <BookmarksTree items={selectedFolder?.children} />
    </main>
  );
};

export default BookmarksArea;
