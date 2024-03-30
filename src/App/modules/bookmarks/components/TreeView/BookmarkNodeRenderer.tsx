import React from 'react';
import { NodeRendererProps } from 'react-arborist';
import { FaFolder, FaGlobe, FaEllipsisV } from 'react-icons/fa';
import { BookmarkItem, BookmarkType } from '../../../../models/BookmarkTypes';
import { DotsVertical } from '../../../../style/icons/DotsVertical';


/**
 * Component that renders the Chevron and Folder icons and the folder name
 */
const BookmarkNodeRenderer = ({
  node,
  style,
  dragHandle,
}: NodeRendererProps<BookmarkItem>) => {
  const isFolder = node.data.type == BookmarkType.Folder;
  const iconStyle = 'ml-1';
  const itemStyle = 'node-item px-2 w-full flex flex-row items-center';
  return (
    <div ref={dragHandle} style={style} className={itemStyle}>
      {isFolder ? (
        <FaFolder className={iconStyle} size={18} />
      ) : (
        <FaGlobe className={iconStyle} size={18} />
      )}
      <p
        className="pl-2 text-base grow
        overflow-hidden overflow-ellipsis whitespace-nowrap">
        {node.data.name}
      </p>
      {/* <FaEllipsisV className="ml-2" size={18} /> */}
      <DotsVertical />
    </div>
  );
};

export default BookmarkNodeRenderer;

// selected background: #8AB4F8; text-gray-900
// hover background: bg-gray-600; text-gray-300
// style={{ ...style, padding: '4px 8px' }}
