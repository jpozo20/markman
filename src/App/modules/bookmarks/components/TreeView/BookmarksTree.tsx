import React, { useEffect, useRef, useState } from 'react';
import { NodeApi, Tree, TreeApi } from 'react-arborist';

import TreeRowRenderer from './TreeRowRenderer';
import BookmarkNodeRenderer from './BookmarkNodeRenderer';
import { BookmarkItem } from '../../../../models/BookmarkTypes';

import useMenuItems from '../../hooks/useMenuItems';
import useContextMenu from '../../hooks/useContextMenu';

type propsType = {
  items?: BookmarkItem[];
};

const BookmarksTree = ({ items }: propsType) => {
  //const onCreate = ({ parentId, index, type }) => {};
  const onRename = ({ id, name }) => { };
  const onMove = ({ dragIds, parentId, index }) => { };
  const onDelete = ({ ids }) => { };

  const treeRef = useRef<TreeApi<BookmarkItem>>(null);

  const [selectedItems, setSelectedItems] = useState<BookmarkItem[]>([]);

  const [_, contextMenuItems] = useMenuItems(selectedItems);
  const [{ onContextMenu, onItemMenuClick }, contextMenu] = useContextMenu(contextMenuItems);

  function onItemContextMenu(event: React.MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.value.includes('node-')) return; // right-click outside tree rows

    event.preventDefault();

    let currentSelection = selectedItems;
    if (treeRef && treeRef.current) {
      const selection = treeRef.current.selectedNodes;
      if (selection.length > 0) currentSelection = selection.map(node => node.data);
    }

    setSelectedItems(currentSelection);
    onContextMenu(event);
  }

  function onItemsSelected(nodes: NodeApi<BookmarkItem>[]): void {
    if (nodes.length == 0) return;

    const bookmarkItems = nodes.map((item) => item.data);
    setSelectedItems(bookmarkItems);
  }

  return (
    <>
      <Tree
        ref={treeRef}
        indent={12}
        rowHeight={32}
        height={1000}
        width={'100%'}
        className="treeview"
        data={items}
        openByDefault={false}

        onRename={onRename}
        onMove={onMove}
        onDelete={onDelete}
        onContextMenu={onItemContextMenu}
        onSelect={onItemsSelected}

        renderRow={TreeRowRenderer}
        children={(nodeProps) => BookmarkNodeRenderer(nodeProps, onItemMenuClick)}>

      </Tree>
      {contextMenu}
    </>
  );
};

export default BookmarksTree;
