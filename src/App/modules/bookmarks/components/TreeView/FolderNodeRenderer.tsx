import React, { HTMLProps } from 'react';
import { NodeRendererProps } from 'react-arborist';
import { FaFolder, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { BookmarkItem, BookmarkType } from '../../../../models/BookmarkTypes';

/**
 * Chevron icon on the left of a folder
 * @param props isOpen: Whether the folder is open or closed
 */
const Chevron = (props: HTMLProps<Element> & { isOpen: boolean }) => {
  const chevronStyle = 'node-chevron mt-1 mr-1';
  const chevron = props.isOpen ? (
    <FaChevronDown size={18} className={chevronStyle} onClick={props.onClick} />
  ) : (
    <FaChevronRight size={18} className={chevronStyle} onClick={props.onClick} />
  );
  return chevron;
};

/**
 * Component that renders the Chevron and Folder icons and the folder name
 */
const FolderNodeRenderer = ({
  node,
  style,
  dragHandle,
}: NodeRendererProps<BookmarkItem>) => {
  const toggleNode = () => node.isInternal && node.toggle();

  const folderStyle = 'node-item px-2 w-full flex flex-row';
  const folderWithNoChildren = 'w-[18px] mt-1 mr-1';

  const hasFolderChildren = node.children?.some((child) => child.isInternal);
  const chevron =
    node.isInternal && hasFolderChildren ? (
      <Chevron isOpen={node.isOpen} onClick={toggleNode} />
    ) : (
      <div className={folderWithNoChildren}></div>
    );
  
  // node.isInternal won't show folders with empty empty children
  if (node.data.type === BookmarkType.Folder)
    return (
      <div ref={dragHandle} style={style} className={folderStyle}>
        {chevron} <FaFolder size={24} />
        <p style={{ paddingLeft: '10px', fontSize: '1.5em' }}>{node.data.name}</p>
      </div>
    );

  return null;
};

export default FolderNodeRenderer;

// selected background: #8AB4F8; text-gray-900
// hover background: bg-gray-600; text-gray-300
// style={{ ...style, padding: '4px 8px' }}
