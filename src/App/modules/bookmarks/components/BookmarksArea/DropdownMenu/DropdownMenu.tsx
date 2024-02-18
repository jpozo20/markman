import React from 'react'

import {Dropdown} from 'flowbite-react'
import type { CustomFlowbiteTheme } from 'flowbite-react';

type MenuItem = {
    label: string;
    onClick: ()=>void;
}
type MenuProps = {
    items: MenuItem[];
    style?: string;
}
const DropdownMenu = ()=>{

}
export default DropdownMenu;
export {MenuItem, MenuProps};