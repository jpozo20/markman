import React, { useEffect, useRef, useState } from 'react';

import TreeStore from '../../../../services/TreeStore';
import { NodeApi, Tree } from 'react-arborist';
import TreeRowRenderer from '../TreeView/TreeRowRenderer';
import FolderNodeRenderer from '../TreeView/FolderNodeRenderer';

import { useAppDispatch } from '../../../../store/store';

import { mapFolders } from '../../../../utils/arrayUtils';
import { BookmarkItem } from '../../../../models/BookmarkTypes';
import { bookmarkActions } from '../../../../store/slices/bookmarkSlice';
import useWindowSize from '../../hooks/useWindowSize';


const style: React.CSSProperties = {
  flexBasis: '30%',
  minWidth: '256px',
};
const Sidebar = () => {
  const dispatch = useAppDispatch();


  const windowSize = useWindowSize();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [renderedHeight, setRenderedHeight] = useState(0);

  //const onCreate = ({ parentId, index, type }) => {};
  const onRename = ({ id, name }) => { };
  const onMove = ({ dragIds, parentId, index }) => { };
  const onDelete = ({ ids }) => { };
  const onSelect = (selectedItems: NodeApi<BookmarkItem>[]) => {
    const selectedFolder = selectedItems[0]?.data;
    if (selectedFolder) dispatch(bookmarkActions.selectSidebarItem(selectedFolder));
  };


  useEffect(() => {
    if (!sidebarRef.current) return;

    // Needs a timeout so it runs after the treeview is rendered
    setTimeout(() => {
      const sidebar = sidebarRef.current;
      const treeview = sidebar?.childNodes[0] as HTMLDivElement;

      const treeviewPosition = treeview.getBoundingClientRect().top;
      const desiredHeight = Math.floor(windowSize.height - treeviewPosition);
      setRenderedHeight(desiredHeight);
    }, 100);

  }, [windowSize]);


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
    <aside ref={sidebarRef} id="sidebar" className="bg-slate-800 grow-0 shrink" style={style}>
      {mappedTree && mappedTree.length ? (
        <Tree
          indent={12}
          rowHeight={32}
          width={'100%'}
          height={renderedHeight}
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
