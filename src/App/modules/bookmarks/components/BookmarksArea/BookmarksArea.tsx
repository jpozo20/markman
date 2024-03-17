import React, { useState, useEffect } from 'react';

import { bookmarkActions, bookmarkThunks, selectors } from '../../../../store/slices/bookmarkSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

import BookmarksTree from '../TreeView/BookmarksTree';
import { MenuItem } from './DropdownMenu/DropdownMenu';
import BookmarksFolderMenu from './DropdownMenu/BookmarksFolderMenu';
import { BookmarkActions, SortActions, SortOptions, UserActionPayload } from '../../../../models/BookmarkActions';

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

  const createMenuItems = () => {
    if (sidebarSelectedItem == undefined || selectedFolder == undefined) return [];

    const menuItems: MenuItem[] = [];
    const sortOptions = SortActions;
    for (const [action, name] of Object.entries(sortOptions)) {

      const label = SortOptions[name];
      const menuItem: MenuItem = {
        label,
        onClick: () => {
          console.log("Click option " + label)
          const payload: UserActionPayload = {
            items: [selectedFolder],
            actionType: BookmarkActions.SortActions,
            executedAction: SortActions[action]
          }
          //dispatch(bookmarkActions.executeAction(payload));
          //bookmarkThunks.executeBookmarkAction(payload);
          dispatch(bookmarkThunks.executeBookmarkAction(payload));
        }
      }
      menuItems.push(menuItem);
    }

    return menuItems;
  }

  //const menuItems: MenuItem[] = [{ label: "Juan Item 1", onClick: () => { } }, { label: "Pepe Item 2", onClick: () => { } }];
  const menuItems: MenuItem[] = createMenuItems();

  const folderMenu = (
    <div className="flex justify-between items-center">
      <p className='font-bold text-xl'>{sidebarSelectedItem?.name}</p>
      <BookmarksFolderMenu items={menuItems} />
    </div>
  );

  return (
    <main id="main-area" className="flex flex-col space-y-4 w-full px-8 py-6">
      {sidebarSelectedItem ? folderMenu : null}
      <BookmarksTree items={selectedFolder?.children} />
    </main>
  );
};

export default BookmarksArea;
