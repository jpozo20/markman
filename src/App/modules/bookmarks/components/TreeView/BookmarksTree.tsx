import React from 'react';
import { Tree } from 'react-arborist';

import TreeRowRenderer from './TreeRowRenderer';
import BookmarkNodeRenderer from './BookmarkNodeRenderer';
import { BookmarkItem } from '../../../../models/BookmarkTypes';
import useContextMenu from '../../hooks/useContextMenu';
import useMenuItems from '../../hooks/useMenuItems';


type propsType = {
  items?: BookmarkItem[];
};

const BookmarksTree = ({ items }: propsType) => {
  //const onCreate = ({ parentId, index, type }) => {};
  const onRename = ({ id, name }) => { };
  const onMove = ({ dragIds, parentId, index }) => { };
  const onDelete = ({ ids }) => { };

  const [_, contextMenuItems] = useMenuItems(items);
  const [{ onContextMenu, onItemMenuClick }, contextMenu] = useContextMenu(contextMenuItems);

  return (
    <>
      <Tree
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
        onContextMenu={onContextMenu}

        renderRow={TreeRowRenderer}
        children={(nodeProps) => BookmarkNodeRenderer(nodeProps, onItemMenuClick)}>

      </Tree>
      {contextMenu}
    </>
  );
};

export default BookmarksTree;
