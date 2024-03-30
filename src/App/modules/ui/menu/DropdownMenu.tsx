import React from 'react'
import { Menu as MenuInner, MenuItem as MenuItemInner, MenuButton } from '@szhsin/react-menu';
import { MenuItemProps as InnerMenuItemProps, MenuProps as InnerMenuProps} from '@szhsin/react-menu';

import '@szhsin/react-menu/dist/core.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import { DotsHorizontal } from '../../../style/icons/DotsHorizontal';
import { DotsVertical } from '../../../style/icons/DotsVertical';

type MenuItem = {
    label: string;
    onClick: () => void;
    subItems?: MenuItem[]
}
type MenuProps = {
    items: MenuItem[];
    style?: string;
    buttonStyle?: string;
    icon?: 'horizontal' | 'vertical'
}

const defaultButtonStyle = `inline-flex items-center p-1 text-sm font-medium text-center text-gray-900 
                     text-white focus:ring-gray-50 bg-gray-800 hover:bg-gray-700 focus:ring-gray-600`;

const menuClassName = ({ state }) =>
    `box-border z-50 text-sm p-1.5 border rounded-md  min-w-[9rem]
     bg-gray-900 text-gray-300 border-gray-400 shadow-lg select-none focus:outline-none
     ${state === "opening" && "animate-fadeIn"} ${state === "closing" && "animate-fadeOut"}`;

const menuItemClassName = ({ hover, disabled, submenu }) => 
        `rounded-md px-2 py-1 focus:outline-none 
        ${hover && "text-white bg-gray-600"} ${disabled && "text-gray-400"} ${submenu && "flex items-center"}`;

const Menu = (props) => <MenuInner {...props} menuClassName={menuClassName} align="end" direction="bottom" />;

const MenuItem = (props) => (
    <MenuItemInner {...props} className={menuItemClassName} />
);

const DropdownMenu = (props: MenuProps) => {

    const passedIcon = props.icon ?? 'horizontal';
    const icon = passedIcon == 'horizontal' ? <DotsHorizontal /> : <DotsVertical />

    const actualButtonStyle = props.buttonStyle ?? defaultButtonStyle;

    const menuButton = <MenuButton className={actualButtonStyle}> {icon} </MenuButton>;
    return (
        <Menu menuButton={menuButton} transition>
            {props.items && props.items.map((item)=>{
                return <MenuItem onClick={item.onClick}>{item.label}</MenuItem>
            })}
        </Menu>
    );

}
export {Menu, MenuItem}
export default DropdownMenu;