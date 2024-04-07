import React, { useEffect, useState } from 'react'
import { ControlledMenu } from "@szhsin/react-menu";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import { menuClassName } from './MenuStyle';
import { MenuItem, MenuProps } from './DropdownMenu';
import { BookmarkItem } from '../../../models/BookmarkTypes';

type ContextMenuProps = MenuProps & {
    items?: BookmarkItem[];
    isOpen?: boolean;
    anchorRef?: any;
    anchorPoint?: { x: number, y: number } | undefined
    onMenuClose?: () => void
}
const ContextMenu = (props: ContextMenuProps) => {

    const [isMenuOpen, setMenuOpen] = useState(props.isOpen);
    const opened = (isMenuOpen == true ? 'open' : 'closed');

    const [anchorRef, setAnchorRef] = useState(props.anchorRef);
    const [anchorPoint, setAnchorPoint] = useState(props.anchorPoint);

    // There is a bug when context menu is opened again with right click
    // So we need to always use the effect to ensure the menu opens again
    useEffect(() => {
        if (isMenuOpen != props.isOpen) setMenuOpen(props.isOpen);
    });

    useEffect(() => {

        if (props.anchorRef != null) {
            if (anchorRef != props.anchorRef) {
                setAnchorRef({ current: props.anchorRef });
                setAnchorPoint(undefined);
            };
        }
        if (props.anchorPoint != undefined) {
            if (anchorPoint != props.anchorPoint) {
                setAnchorPoint(props.anchorPoint);
                setAnchorRef(null);
            }
        }

    }, [props.anchorPoint, props.anchorRef]);

    const onMenuClose = () => {
        if (props.onMenuClose) props.onMenuClose();
        else setMenuOpen(false)
    }

    // If menu is open with contextMenu then align menu to start
    // else if menu was open via vartical dots, align to end
    // Context menu is anchorRef == null
    const menuAlign = props.anchorRef == null ? 'start' : 'end';

    return (
        <ControlledMenu
            menuClassName={menuClassName}
            align={menuAlign}
            direction="bottom"
            state={opened}
            onClose={onMenuClose}
            anchorPoint={anchorPoint}>

            {props.items && props.items.map((item) => {
                return <MenuItem title={item.label} onClick={item.onClick}>{item.label}</MenuItem>
            })}
            
        </ControlledMenu>
    )

}
export default ContextMenu;