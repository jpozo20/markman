import React from 'react'
import { MenuButton } from '@szhsin/react-menu';

import * as MenuStyle from './MenuStyle';
import { MenuComponent, MenuItemComponent } from './MenuStyle';
import { MenuItem as MenuItemT } from '../../../models/MenuTypes';

import '@szhsin/react-menu/dist/core.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import { DotsVertical } from '../../../style/icons/DotsVertical';
import { DotsHorizontal } from '../../../style/icons/DotsHorizontal';


export type MenuProps = {
    items: MenuItemT[];
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
        <MenuComponent menuButton={menuButton} transition>
            {props.items && props.items.map((item)=>{
                return <MenuItemComponent title={item.label} onClick={item.onClick}>{item.label}</MenuItemComponent>
            })}
        </MenuComponent>
    );

}

export default DropdownMenu;