import React, { useEffect } from 'react';

import TreeStore from '../../../../services/TreeStore';
import { NodeApi, Tree } from 'react-arborist';
import TreeRowRenderer from '../TreeView/TreeRowRenderer';
import FolderNodeRenderer from '../TreeView/FolderNodeRenderer';


import { asyncAppThunks } from '../../../../store/slices/appSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import {
  asyncBrowserThunks,
} from '../../../../store/slices/browserSlice';


import { mapFolders } from '../../../../utils/arrayUtils';
import { BookmarkItem } from '../../../../models/BookmarkTypes';
import { bookmarkActions } from '../../../../store/slices/bookmarkSlice';


const style: React.CSSProperties = {
  flexBasis: '30%',
  minWidth: '256px',
};
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const bookmarksLoading = useAppSelector((rootState) => rootState.appState.isLoadingBookmarks);

  //const onCreate = ({ parentId, index, type }) => {};
  const onRename = ({ id, name }) => { };
  const onMove = ({ dragIds, parentId, index }) => { };
  const onDelete = ({ ids }) => { };
  const onSelect = (selectedItems: NodeApi<BookmarkItem>[]) => {
    const selectedFolder = selectedItems[0]?.data;
    if (selectedFolder) dispatch(bookmarkActions.selectSidebarItem(selectedFolder));
  };

  useEffect(() => {

    // Load bookmarks from localStorage. If bookmarks are not in localStorage, 
    // load from Browser and save them to localStorage

    async function loadBookmarks() {
      if (!bookmarksLoading) return;

      try {
        let tree = await dispatch(asyncAppThunks.loadBookmarksFromStorage()).unwrap();
        if (tree == undefined) tree = await dispatch(asyncBrowserThunks.getBookmarksTree()).unwrap();
      } catch (error) {
        console.log("Error loading bookmarks from useEffect");
      }
    }

    loadBookmarks();
  }, [useAppDispatch, bookmarksLoading]);


  const treeStore = TreeStore.getInstance();
  let bookmarksTree = treeStore.getTree();

  let mappedTree: BookmarkItem[] | undefined;
  if (bookmarksTree != undefined && bookmarksTree.root) {
    const root = bookmarksTree.root;

    // Map and filter folders, since react-arborist shows a gap
    // where non-folder items are
    mappedTree = root.children?.flatMap(mapFolders);
  }

  return (
    <aside id="sidebar" className="bg-slate-800 grow-0 shrink" style={style}>
      {mappedTree && mappedTree.length ? (
        <Tree
          indent={12}
          rowHeight={32}
          width={'100%'}
          height={1000}
          className="treeview"
          data={mappedTree}
          openByDefault={false}
          onRename={onRename}
          onMove={onMove}
          onDelete={onDelete}
          renderRow={TreeRowRenderer}
          onSelect={onSelect}>
          {FolderNodeRenderer}
        </Tree>
      ) : null}
    </aside>
  );
};

export default Sidebar;
