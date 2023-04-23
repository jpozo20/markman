import React, { useEffect } from 'react';
import { Tree } from 'react-arborist';

import { FoldersState, getBookmarksTree } from '../../../../store/slices/folderSlice';

import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Bookmark from './Bookmark';

const style: React.CSSProperties = {
  height: '100vh',
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

  useEffect(() => {
    if (state && !state.tree?.length) {
      dispatch(getBookmarksTree());
    }
  }, [useAppDispatch]);

  let mappedTree;
  if (state && state.tree?.length) {
    const root = state.tree[0];
    mappedTree = root.children?.map((folder) => ({
      ...folder,
    }));
    //mappedTree = root.children;
    console.log(mappedTree);
  }

  return (
    <aside id="sidebar" className="bg-slate-800 grow-0 shrink" style={style}>
      {mappedTree && mappedTree.length ? (
        <Tree
          width={'100%'}
          data={mappedTree}
          openByDefault={false}
          onRename={onRename}
          onMove={onMove}
          onDelete={onDelete}>
          {Bookmark}
        </Tree>
      ) : null}
    </aside>
  );
};

export default Sidebar;
