import React, { useEffect } from 'react';
import { NodeApi, Tree } from 'react-arborist';

import { useAppDispatch, useAppSelector } from '../../../../store/store';
import {
  BrowserApiState,
  getBookmarksTree,
} from '../../../../store/slices/browserSlice';

import FolderNodeRenderer from '../TreeView/FolderNodeRenderer';
import TreeRowRenderer from '../TreeView/TreeRowRenderer';
import { mapFolders } from '../../../../utils/arrayUtils';
import { BookmarkItem } from '../../../../models/BookmarkTypes';
import { loadBookmarksFromStorage, bookmarkActions } from '../../../../store/slices/bookmarkSlice';

const style: React.CSSProperties = {
  flexBasis: '30%',
  minWidth: '256px',
};
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const localState = useAppSelector((state)=>state.bookmarks);
  const browserState: BrowserApiState = useAppSelector((state) => state.browserApi);

  //const onCreate = ({ parentId, index, type }) => {};
  const onRename = ({ id, name }) => {};
  const onMove = ({ dragIds, parentId, index }) => {};
  const onDelete = ({ ids }) => {};
  const onSelect = (selectedItems: NodeApi<BookmarkItem>[]) => {
    const selectedFolder = selectedItems[0]?.data;
    if (selectedFolder) dispatch(bookmarkActions.selectFolder(selectedFolder));
  };

  useEffect(() => {
    
    // If bookmarks are not in localStorage, load from Browser
    // and save them to localStorage
    if(localState.bookmarks == undefined){
      const tree = browserState.tree;
      if(tree && tree.length == 0) dispatch(getBookmarksTree());
      else dispatch(loadBookmarksFromStorage());
    }
  }, [useAppDispatch, browserState.tree?.length]);

  let mappedTree: BookmarkItem[] | undefined;
  if (localState.bookmarks && localState.bookmarks.root) {
    const root = localState.bookmarks.root;

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
