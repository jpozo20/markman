import React, { useState, useEffect } from 'react';
import { Dropdown } from 'flowbite-react'

import { getChildren } from '../../../../store/slices/folderSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

import BookmarksTree from '../TreeView/BookmarksTree';
import { BookmarkItem } from '../../../../models/BookmarkTypes';
import { MenuItem } from './DropdownMenu/DropdownMenu';
import BookmarksFolderMenu from './DropdownMenu/BookmarksFolderMenu';

const BookmarksArea = () => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<BookmarkItem[]>([]);
  const selectedFolder = useAppSelector((state) => state.folders.selectedFolder);

  useEffect(() => {
    const loadItems = async () => {
      dispatch(getChildren(selectedFolder?.id ?? ''))
        .unwrap()
        .then((result) => {
          if (result && result.length) setItems(result);
        })
        .catch((err) => console.log('promise exploded'));
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
      <BookmarksTree items={items} />
    </main>
  );
};

export default BookmarksArea;
