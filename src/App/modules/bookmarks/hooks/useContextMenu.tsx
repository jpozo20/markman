import React, { useRef, useState } from 'react'
import ContextMenu from '../../ui/menu/ContextMenu';

const useContextMenu = (items: any[]) => {

    const contextMenuAnchorRef = useRef(null);

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [contextMenuRef, setContextMenuRef] = useState(contextMenuAnchorRef.current);
    const [contextAnchorPoint, setContextAnchorPoint] = useState<any>(undefined);

    const onContextMenu = (event: React.MouseEvent) => {
        if (typeof document.hasFocus === 'function' && !document.hasFocus()) return;

        event.preventDefault();
        setContextAnchorPoint({ x: event.clientX, y: event.clientY });
        setContextMenuRef(null);
        setMenuOpen(true);
    }

    const onItemMenuClick = (event: React.MouseEvent) => {

        //setContextAnchorPoint(undefined);
        setContextMenuRef(event.currentTarget as any);
        setContextAnchorPoint({ x: event.clientX, y: event.clientY });
        setMenuOpen(true);
    }

    const contextMenu = (
        <ContextMenu items={items}
            isOpen={isMenuOpen}
            onMenuClose={() => setMenuOpen(false)}
            anchorRef={contextMenuRef}
            anchorPoint={contextAnchorPoint}
        />
    )

    const eventHandlers = { onContextMenu, onItemMenuClick };
    return [eventHandlers, contextMenu] as const;
}
export default useContextMenu;