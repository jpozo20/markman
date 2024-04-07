import React from 'react'

import { useAppDispatch } from '../../../store/store';
import { appThunks } from '../../../store/slices/appSlice';

import { MenuItem } from '../../ui/menu/DropdownMenu';
import { BookmarkItem } from '../../../models/BookmarkTypes';

import { SortActions, UserActions, SortOptions, UrlOptions } from '../../../models/BookmarkActions';
import { BookmarkActions, UrlActions, OptionType, UserActionPayload } from '../../../models/BookmarkActions';


const createMenuItems = (items: BookmarkItem[], actionType: BookmarkActions, userOptions: OptionType, actions: UserActions): MenuItem[] => {

    const dispatch = useAppDispatch();
    const menuItems: MenuItem[] = [];

    for (const [option, name] of Object.entries(actions)) {

        const label = userOptions[name];
        const menuItem: MenuItem = {
            label,
            onClick: () => {
                console.log("Clicked option " + label)
                const payload: UserActionPayload = {
                    items,
                    actionType: actionType,
                    executedAction: actions[option]
                }
                dispatch(appThunks.executeBookmarkAction(payload));
            }
        }
        menuItems.push(menuItem);
    }
    return menuItems;
}

const createDropdownMenu = (selectedFolder: BookmarkItem[] | undefined): MenuItem[] => {
    if (selectedFolder == undefined) return [];

    const actionType = BookmarkActions.SortActions;
    const items = selectedFolder ? selectedFolder : [];

    return createMenuItems(items, actionType, SortOptions, SortActions);
}

const createContextMenu = (selectedFolder: BookmarkItem[] | undefined): MenuItem[] => {

    if (selectedFolder == undefined) return [];

    const actionType = BookmarkActions.UrlActions;
    const items = selectedFolder ? selectedFolder : [];

    return createMenuItems(items, actionType, UrlOptions, UrlActions);
}

const useMenuItems = (selectedFolder: BookmarkItem | BookmarkItem[] | undefined) => {
    if (selectedFolder == undefined) selectedFolder = []

    const folder = Array.isArray(selectedFolder) ? selectedFolder : [selectedFolder];
    const dropDownMenu = React.useMemo(() => createDropdownMenu(folder), [selectedFolder]);
    const contextMenu = React.useMemo(() => createContextMenu(folder), [selectedFolder]);
    return [dropDownMenu, contextMenu];
}
export default useMenuItems;