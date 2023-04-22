import React from 'react';
import { FaFolder } from 'react-icons/fa';
import { NodeRendererProps } from 'react-arborist';
import { BookmarkItem, BookmarkType } from '../../../../models/BookmarkTypes';

const Bookmark = ({ node, style, dragHandle }: NodeRendererProps<BookmarkItem>) => {
  if (node.data.type === BookmarkType.Folder)
    return (
      <div
        ref={dragHandle}
        className="flex flex-row px-2 text-gray-300 hover:bg-[#8AB4F8] hover:text-gray-900"
      >
        <FaFolder size={24} />{' '}
        <p style={{ paddingLeft: '10px', fontSize: '1.5em' }}>{node.data.name}</p>
      </div>
    );
  else return <div ref={dragHandle}>{node.data.name}</div>;
};

export default Bookmark;

// selected background: #8AB4F8; text-gray-900
// hover background: bg-gray-600; text-gray-300
