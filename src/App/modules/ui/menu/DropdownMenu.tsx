import React from 'react'
import { MenuButton } from '@szhsin/react-menu';

import * as MenuStyle from './MenuStyle';
import { Menu, MenuItem } from './MenuStyle';


import '@szhsin/react-menu/dist/core.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import { DotsHorizontal } from '../../../style/icons/DotsHorizontal';
import { DotsVertical } from '../../../style/icons/DotsVertical';


export type MenuItem = {
    label: string;
    onClick: () => void;
    subItems?: MenuItem[]
}
export type MenuProps = {
    items: MenuItem[];
    style?: string;
    buttonStyle?: string;
    icon?: 'horizontal' | 'vertical'
}

const DropdownMenu = (props: MenuProps) => {

    const passedIcon = props.icon ?? 'horizontal';
    const icon = passedIcon == 'horizontal' ? <DotsHorizontal /> : <DotsVertical />

    const actualButtonStyle = props.buttonStyle ?? MenuStyle.defaultButtonStyle;

    const menuButton = <MenuButton className={actualButtonStyle}> {icon} </MenuButton>;
    return (
        <Menu menuButton={menuButton} transition>
            {props.items && props.items.map((item)=>{
                return <MenuItem title={item.label} onClick={item.onClick}>{item.label}</MenuItem>
            })}
        </Menu>
    );

}
export {Menu, MenuItem}
export default DropdownMenu;