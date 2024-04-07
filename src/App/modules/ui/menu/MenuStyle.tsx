import React from 'react'
import { Menu as MenuInner, MenuItem as MenuItemInner, MenuButton } from '@szhsin/react-menu';
import { MenuItemProps as InnerMenuItemProps, MenuProps as InnerMenuProps} from '@szhsin/react-menu';

import '@szhsin/react-menu/dist/core.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

export const defaultButtonStyle = `inline-flex items-center p-1 text-sm font-medium text-center text-gray-900 
                     text-white focus:ring-gray-50 bg-gray-800 hover:bg-gray-700 focus:ring-gray-600`;

export const menuClassName = ({ state }) =>
    `box-border z-50 text-sm p-1.5 border rounded-md  min-w-[9rem]
     bg-gray-900 text-gray-300 border-gray-400 shadow-lg select-none focus:outline-none
     ${state === "opening" && "animate-fadeIn"} ${state === "closing" && "animate-fadeOut"}`;

export const menuItemClassName = ({ hover, disabled, submenu }) => 
        `rounded-md px-2 py-1 focus:outline-none 
        ${hover && "text-white bg-gray-600"} ${disabled && "text-gray-400"} ${submenu && "flex items-center"}`;

export const Menu = (props) => <MenuInner {...props} menuClassName={menuClassName} align="end" direction="bottom" />;

export const MenuItem = (props) => (
    <MenuItemInner {...props} className={menuItemClassName} />
);