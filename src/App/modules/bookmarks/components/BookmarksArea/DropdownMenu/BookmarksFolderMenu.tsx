import React from 'react'
import { MenuProps } from './DropdownMenu';
import { CustomFlowbiteTheme, Dropdown } from 'flowbite-react';
//import EllipsisIcon from './EllipsisIcon';

const menuTheme: CustomFlowbiteTheme['dropdown'] = {
    "floating": {
        "item": {
            "base": "flex items-center justify-start py-2 px-4 cursor-pointer w-full text-sm text-gray-300 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none",
        },
        "style": {
            "auto": "border border-gray-400 bg-gray-900 text-gray-300"
        }
    }
};

const BookmarksFolderMenu = (props: MenuProps) => {
    function renderDropdown() {
        return <p className='text-2xl pb-2.5 font-white font-bold cursor-pointer hover:text-white focus:font-white'>...</p>;
        // return <EllipsisIcon style=''/>
    };

    return (
        <Dropdown label="" renderTrigger={renderDropdown} placement='bottom-end' theme={menuTheme}>
            {props.items?.map((item) => <Dropdown.Item onClick={item.onClick}>{item.label}</Dropdown.Item>)}
        </Dropdown>
    );

}
export default BookmarksFolderMenu;