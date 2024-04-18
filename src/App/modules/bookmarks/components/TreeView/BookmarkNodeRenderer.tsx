import React from 'react';
import { NodeRendererProps } from 'react-arborist';

import { FaFolder, FaGlobe } from 'react-icons/fa';
import { DotsVertical } from '../../../../style/icons/DotsVertical';
import { BookmarkItem, BookmarkType } from '../../../../models/BookmarkTypes';


/**
 * Component that renders the Chevron and Folder icons and the folder name
 */
const BookmarkNodeRenderer = ({
  node,
  style,
  dragHandle,
}: NodeRendererProps<BookmarkItem>,
  onItemMenuClick: (event: React.MouseEvent) => void) => {
  const isFolder = node.data.type == BookmarkType.Folder;
  const iconStyle = 'ml-1';
  const itemStyle = 'node-item px-2 w-full flex flex-row items-center';

  const onCurrentItemMenuClicked = (event) => { 

    if(!node.isSelected){
      node.select();
    } 
    
    onItemMenuClick(event);
    
  }

  const onCurrentItemContext = (event: React.MouseEvent) => {
    if(!node.isSelected){
      node.select();
    } 
  }

  return (
    <div ref={dragHandle} style={style} className={itemStyle} onContextMenu={onCurrentItemContext}>
      {isFolder ? (
        <FaFolder className={iconStyle} size={18} />
      ) : (
        <FaGlobe className={iconStyle} size={18} />
      )}
      <p
        className="node-title pl-2 text-base grow
        overflow-hidden overflow-ellipsis whitespace-nowrap">
        {node.data.name}
      </p>
      {/* <FaEllipsisV className="ml-2" size={18} /> */}
      <div className='cursor-pointer hover:bg-gray-700 rounded-full node-menu' onClick={onCurrentItemMenuClicked}>
        <DotsVertical className='node-menu' />
      </div>

    </div>
  );
};

export default BookmarkNodeRenderer;

// selected background: #8AB4F8; text-gray-900
// hover background: bg-gray-600; text-gray-300
// style={{ ...style, padding: '4px 8px' }}
