import React from 'react';
import { RowRendererProps } from 'react-arborist';
import { BookmarkItem } from '../../../../models/BookmarkTypes';

/**
 * Component that draws the div where each node will be rendered.
 * You can customize hover, focus and selection state in this component.
 */
const FolderRow = ({
  node,
  innerRef,
  attrs,
  children,
}: RowRendererProps<BookmarkItem>) => {
  const classNames = {
    NodeItem: 'node-item',
    NodeChevron: 'node-chevron',
  };

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
      // Call default click handler so the node is selected and focused
      node.handleClick.call(this, event);
    }
  };

  return (
    <div
      {...attrs}
      ref={innerRef}
      className="flex items-center w-full 
        text-gray-300 hover:bg-gray-600 
        aria-selected:bg-blue-400 
        aria-selected:text-gray-900 "
      onClick={handleNodeClick}>
      {children}
    </div>
  );
};

export default FolderRow;
//aria-selected:bg-[#8AB4F8] aria-selected:text-gray-900
