//
import React from 'react'
import { FaStar, FaFolder } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../../../store/store';

import ButtonWithIcon from '../../../ui/iconbutton/ButtonWithIcon';
import DropdownMenu from '../../../ui/menu/DropdownMenu';
import useMenuItems from '../../hooks/useMenuItems';


const FolderMenu = ({ folderName }: { folderName?: string }) => {

    const dispatch = useAppDispatch();
    const selectedFolder = useAppSelector(state => state.bookmarks.selectedFolder);

    const [menuItems] = useMenuItems(selectedFolder);

    const starIcon = <FaStar size={18} className='mr-1' />
    const folderIcon = <FaFolder size={18} className='mr-1' />

    return (
        <div className="folder-menu flex justify-between items-center mr-4">
            <p className='font-bold text-gray-300 text-xl'>{folderName}</p>
            <div className='flex justify-evenly items-center'>
                <ButtonWithIcon icon={starIcon} text='Add bookmark' />
                <ButtonWithIcon icon={folderIcon} text='Add folder' />
                <DropdownMenu items={menuItems} icon='horizontal' />
            </div>
        </div>
    )
}

export default FolderMenu
