import React, { useState, useEffect } from 'react';

import { getChildren } from '../../../../store/slices/folderSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

import BookmarksTree from '../TreeView/BookmarksTree';
import { BookmarkItem } from '../../../../models/BookmarkTypes';

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

  return (
    <main id="main-area" className="w-full px-8 py-6">
      <p>Selected folder is {selectedFolder?.name}</p>
      <BookmarksTree items={items} />
    </main>
  );
};

export default BookmarksArea;
