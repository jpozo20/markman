import React, { useState, useEffect } from 'react';

import {bookmarkActions} from '../../../../store/slices/bookmarkSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

import BookmarksTree from '../TreeView/BookmarksTree';
import { MenuItem } from './DropdownMenu/DropdownMenu';
import BookmarksFolderMenu from './DropdownMenu/BookmarksFolderMenu';

const BookmarksArea = () => {
  const dispatch = useAppDispatch();
  const selectedFolder = useAppSelector((state) => state.bookmarks.selectedFolder);
  const selectedFolderItems = useAppSelector(state => state.bookmarks.selectedFolderItems);

  useEffect(() => {
    const loadItems = () => {
      try {
        if(selectedFolder && selectedFolder.pathFromRoot != undefined){
          dispatch(bookmarkActions.getFolderChildren(selectedFolder));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadItems();
  }, [selectedFolder]);

  const menuItems: MenuItem[] = [{ label: "Juan Item 1", onClick: () => { } }, { label: "Pepe Item 2", onClick: () => { } }];
  const folderMenu = (
    <div className="flex justify-between items-center">
      <p className='font-bold text-xl'>{selectedFolder?.name}</p>
      <BookmarksFolderMenu items={menuItems} />
    </div>
  );

  return (
    <main id="main-area" className="flex flex-col space-y-4 w-full px-8 py-6">
      {selectedFolder ? folderMenu : null}
      <BookmarksTree items={selectedFolderItems} />
    </main>
  );
};

export default BookmarksArea;
