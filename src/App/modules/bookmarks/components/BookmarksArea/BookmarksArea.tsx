import React, { useEffect } from 'react';

import { bookmarkActions } from '../../../../store/slices/bookmarkSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

import BookmarksTree from '../TreeView/BookmarksTree';
import DropdownMenu from '../../../ui/menu/DropdownMenu';

import useMenuItems from '../../hooks/useMenuItems';


const BookmarksArea = () => {
  const dispatch = useAppDispatch();

  const selectedFolder = useAppSelector(state => state.bookmarks.selectedFolder);
  const sidebarSelectedItem = useAppSelector(state => state.bookmarks.sidebarSelectedItem);

  const [menuItems] = useMenuItems(selectedFolder);
  
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

  useEffect(()=>{

    const loadMenu = async () => {
      // const [dropdownItems] = await getMenuItems(selectedFolder);
      // setMenuItems(dropdownItems);
    }

    loadMenu();
  }, [sidebarSelectedItem]);


  const folderMenu = (
    <div className="flex justify-between items-center">
      <p className='font-bold text-xl'>{sidebarSelectedItem?.name}</p>
      <DropdownMenu items={menuItems} icon='horizontal' />
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
