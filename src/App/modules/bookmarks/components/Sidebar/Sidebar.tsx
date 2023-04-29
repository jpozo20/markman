import React, { useEffect } from 'react';
import { NodeApi, Tree } from 'react-arborist';

import { useAppDispatch, useAppSelector } from '../../../../store/store';
import {
  FoldersState,
  folderActions,
  getBookmarksTree,
} from '../../../../store/slices/folderSlice';

import FolderNodeRenderer from '../TreeView/FolderNodeRenderer';
import TreeRowRenderer from '../TreeView/TreeRowRenderer';
import { mapFolders } from '../../../../utils/arrayUtils';
import { BookmarkItem } from '../../../../models/BookmarkTypes';

const style: React.CSSProperties = {
  flexBasis: '30%',
  minWidth: '256px',
};
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const state: FoldersState = useAppSelector((state) => state.folders);

  //const onCreate = ({ parentId, index, type }) => {};
  const onRename = ({ id, name }) => {};
  const onMove = ({ dragIds, parentId, index }) => {};
  const onDelete = ({ ids }) => {};
  const onSelect = (selectedItems: NodeApi<BookmarkItem>[]) => {
    const selectedFolder = selectedItems[0]?.data;
    if (selectedFolder) dispatch(folderActions.selectFolder(selectedFolder));
  };

  useEffect(() => {
    if (state && !state.tree?.length) {
      dispatch(getBookmarksTree());
    }
  }, [useAppDispatch]);

  let mappedTree: BookmarkItem[] | undefined;
  if (state && state.tree?.length) {
    const root = state.tree[0];

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
