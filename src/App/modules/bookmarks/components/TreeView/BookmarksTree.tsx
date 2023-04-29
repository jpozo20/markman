import React from 'react';
import { Tree } from 'react-arborist';

import TreeRowRenderer from './TreeRowRenderer';
import BookmarkNodeRenderer from './BookmarkNodeRenderer';
import { BookmarkItem } from '../../../../models/BookmarkTypes';

type propsType = {
  items?: BookmarkItem[];
};

const BookmarksTree = ({ items }: propsType) => {
  //const onCreate = ({ parentId, index, type }) => {};
  const onRename = ({ id, name }) => {};
  const onMove = ({ dragIds, parentId, index }) => {};
  const onDelete = ({ ids }) => {};

  return (
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
      renderRow={TreeRowRenderer}>
      {BookmarkNodeRenderer}
    </Tree>
  );
};

export default BookmarksTree;
