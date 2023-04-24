import React, { HTMLProps } from 'react';
import { NodeRendererProps } from 'react-arborist';
import { FaFolder, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { BookmarkItem, BookmarkType } from '../../../../models/BookmarkTypes';

const classNames = {
  NodeItem: 'node-item',
  NodeChevron: 'node-chevron',
};

/**
 * Chevron icon on the left of a folder
 * @param props isOpen: Whether the folder is open or closed
 */
const Chevron = (props: HTMLProps<Element> & { isOpen: boolean }) => {
  const chevronStyle = 'node-chevron mt-1 mr-1 hover:bg-gray-500';
  const chevron = props.isOpen ? (
    <FaChevronDown size={18} className={chevronStyle} onClick={props.onClick} />
  ) : (
    <FaChevronRight size={18} className={chevronStyle} onClick={props.onClick} />
  );
  return chevron;
};

const Bookmark = ({ node, style, dragHandle }: NodeRendererProps<BookmarkItem>) => {
  const toggleNode = () => node.isInternal && node.toggle();

  const handleNodeClick = (event) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    const classList = target.classList;
    const parent = target.parentElement!;
    const tagName = target.tagName.toLowerCase();

    // Select the clicked node only if the target is not the Chevron
    let isChevron =
      tagName === 'path' && parent.classList.contains(classNames.NodeChevron);
    if (!isChevron) isChevron = classList.contains(classNames.NodeChevron);

    if (isChevron) {
      event.stopPropagation();
    } else {
      console.log('nodeItem');
    }
  };

  const hasFolderChildren = node.children?.some((child) => child.isInternal);
  const chevron =
    node.isInternal && hasFolderChildren ? (
      <Chevron isOpen={node.isOpen} onClick={toggleNode} />
    ) : (
      <div className="w-[18px] mt-1 mr-1"></div>
    );
  if (node.data.type === BookmarkType.Folder && node.isInternal)
    return (
      <div
        ref={dragHandle}
        style={style}
        onClick={handleNodeClick}
        className="node-item flex flex-row px-2 
        text-gray-300 hover:bg-[#8AB4F8] hover:text-gray-900">
        {chevron} <FaFolder size={24} />
        <p style={{ paddingLeft: '10px', fontSize: '1.5em' }}>{node.data.name}</p>
      </div>
    );

  return null;
};

export default Bookmark;

// selected background: #8AB4F8; text-gray-900
// hover background: bg-gray-600; text-gray-300
// style={{ ...style, padding: '4px 8px' }}
