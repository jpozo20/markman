import React from 'react'
import clsx from 'clsx';

import { hoverItemStyle } from '../styles';
import '@szhsin/react-menu/dist/core.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { Menu as MenuInner, MenuItem as MenuItemInner, SubMenu as SubMenuInner } from '@szhsin/react-menu';

export const defaultButtonStyle = clsx('inline-flex items-center font-medium mx-1', hoverItemStyle);

export const menuClassName = ({ state }) =>
    `box-border z-50 text-sm p-1.5 border rounded-md  min-w-[9rem]
     bg-gray-900 text-gray-300 border-gray-400 shadow-lg select-none focus:outline-none
     ${ clsx(state === "opening" && "animate-fadeIn") } ${ clsx(state === "closing" && "animate-fadeOut") }`;

export const menuItemClassName = ({ hover, disabled, submenu }) => 
        `rounded-md px-2 py-1 focus:outline-none
        ${ clsx(hover && "text-white bg-gray-600") } ${ clsx(disabled && "text-gray-400") }`;

export const subMenuClassName = ({ hover, open, disabled }) => 
    `rounded-md px-2 py-1 focus:outline-none
    ${ clsx(hover && "text-white bg-gray-600") } ${ clsx(disabled && "text-gray-400") } ${ clsx(hover && open && "esto-es-submenu") }`;

export const subMenuItemClassName = ({ hover, open, disabled }) => 
    `rounded-md px-2 py-1 focus:outline-none 
    max-w-[20rem] block overflow-hidden text-ellipsis whitespace-nowrap
    ${ clsx(hover && "text-white bg-gray-600") } ${ clsx(disabled && "text-gray-400") }`;

export const MenuComponent = (props) => <MenuInner {...props} menuClassName={menuClassName} align="end" direction="bottom" />;

export const MenuItemComponent = (props) => (
    <MenuItemInner {...props} className={menuItemClassName} />
);

export const SubMenuComponent = (props) => (
    <SubMenuInner
      {...props}
      shift={-7}
      className="relative"
      menuClassName={menuClassName}
      itemProps={{ className: subMenuClassName }}
    />
)

export const SubMenuItemComponent = (props) => (
    <MenuItemInner {...props} className={subMenuItemClassName} />
);