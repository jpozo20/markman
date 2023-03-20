import React, { useEffect } from 'react';

import {
  FoldersState,
  getBookmarksTree,
} from '../../../../store/slices/folderSlice';

import { useAppDispatch, useAppSelector } from '../../../../store/store';

const style: React.CSSProperties = {
  height: '100vh',
  flexBasis: '30%',
  minWidth: '256px',
};
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const state: FoldersState = useAppSelector((state) => state.folders);

  useEffect(() => {
    if (state && !state.tree?.length) {
      dispatch(getBookmarksTree());
    }
  }, [useAppDispatch]);

  let mappedTree;
  if (state && state.tree?.length) {
    const root = state.tree[0];
    mappedTree = root.children?.map((folder) => (
      <h2 key={folder.id}>{folder.title}</h2>
    ));
  }
  return (
    <aside id="sidebar" className="bg-slate-800 grow-0 shrink" style={style}>
      {mappedTree}
    </aside>
  );
};

export default Sidebar;
