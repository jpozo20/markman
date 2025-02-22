import React, { useEffect, useState } from 'react'
import { ControlledMenu, MenuDivider } from "@szhsin/react-menu";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import { MenuProps } from './DropdownMenu';
import { BookmarkItem } from '../../../models/BookmarkTypes';
import { MenuAction, MenuGroup, MenuItem, MenuItemType } from '../../../models/MenuTypes';
import { menuClassName, MenuItemComponent, SubMenuComponent, SubMenuItemComponent } from './MenuStyle';

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

    const mapMenuItems = (menuItem: MenuItem, isSubmenuItem = false) => {
        if (menuItem.type == MenuItemType.MenuDivider) return <MenuDivider className="bg-gray-700 h-0.5" />

        if (menuItem.type == MenuItemType.MenuGroup) {
            const menuGroup = menuItem as MenuGroup;
            const isDisabled = menuGroup.items.length == 0;

            const group = <SubMenuComponent disabled={isDisabled} label={menuGroup.label}>
                            {menuGroup.items.map((item)=>mapMenuItems(item, true))}
                          </SubMenuComponent>;
            return group;
        }

        const action = menuItem as MenuAction;
        if(isSubmenuItem) return <SubMenuItemComponent title={action.label} onClick={action.onClick}>{action.label}</SubMenuItemComponent>
        return <MenuItemComponent title={action.label} onClick={action.onClick}>{menuItem.label}</MenuItemComponent>
    }

    return (
        <ControlledMenu
            menuClassName={menuClassName}
            align={menuAlign}
            direction="bottom"
            state={opened}
            onClose={onMenuClose}
            anchorPoint={anchorPoint}>

            {props.items && props.items.map((item)=>mapMenuItems(item))}

        </ControlledMenu>
    )

}
export default ContextMenu;