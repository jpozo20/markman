//
import React, { useState } from 'react'
import { FaStar, FaFolder } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../../../store/store';

import ButtonWithIcon from '../../../ui/iconbutton/ButtonWithIcon';
import DropdownMenu from '../../../ui/menu/DropdownMenu';
import useMenuItems from '../../hooks/useMenuItems';

import { Button, Modal } from 'flowbite-react';
import { inputFieldStyle, labelStyle } from '../../../ui/styles';
import AddBookmarkModal from './AddBookmarkModal';
import AddFolderModal from './AddFolderModal';


const FolderMenu = ({ folderName }: { folderName?: string }) => {

    //const dispatch = useAppDispatch();
    
    const [showFolderModal, setOpenFolderModal] = useState(false);
    const [showBookmarkModal, setOpenBookmarkModal] = useState(false);
    
    const selectedFolder = useAppSelector(state => state.bookmarks.selectedFolder);
    const [menuItems] = useMenuItems(selectedFolder);

    const starIcon = <FaStar size={18} className='mr-1' />
    const folderIcon = <FaFolder size={18} className='mr-1' />

    return (
        <div className="folder-menu flex justify-between items-center mr-4">
            <p className='font-bold text-gray-300 text-xl'>{folderName}</p>
            <div className='flex justify-evenly items-center'>
                <ButtonWithIcon icon={starIcon} text='Add bookmark'
                    onClick={() => setOpenBookmarkModal(true)} />
                <ButtonWithIcon icon={folderIcon} text='Add folder' onClick={() => setOpenFolderModal(true)} />
                <DropdownMenu items={menuItems} icon='horizontal' />
            </div>

            <AddFolderModal isOpen={showFolderModal} onClose={() => setOpenFolderModal(false)} onSave={()=>{}} />
            <AddBookmarkModal isOpen={showBookmarkModal} onClose={() => setOpenBookmarkModal(false)} onSave={()=>{}} />
            
        </div>
    )
}

export default FolderMenu
