import React, { useEffect, useState } from 'react'

import { useAppDispatch } from '../../../store/store';
import { appThunks } from '../../../store/slices/appSlice';

import { BookmarkItem } from '../../../models/BookmarkTypes';
import { MenuAction, MenuItem, MenuItemType } from '../../../models/MenuTypes';

import { asyncBrowserThunks } from '../../../store/slices/browserSlice'
import { SortActions, UserActions, SortOptions } from '../../../models/BookmarkActions';
import { BookmarkActions, OptionType, UserActionPayload } from '../../../models/BookmarkActions';

import { composeItemContextMenu } from '../../ui/menu/MenuComposer';


const useMenuItems = (selectedFolder: BookmarkItem | BookmarkItem[] | undefined) => {
    
    const dispatch = useAppDispatch();
    const [dropDownMenu, setDropDownMenu] = useState<MenuItem[]>([]);
    const [contextMenu, setcontextMenu] = useState<MenuItem[]>([]);

    useEffect(() => {
        const configureMenus = async (folder: BookmarkItem | BookmarkItem[] | undefined) => {
            console.log('Running menuItems effect');

            const actualFolder = Array.isArray(selectedFolder) ? selectedFolder : [selectedFolder];
            const newDropDownMenu = await createDropdownMenu(actualFolder as any);
            const newContextMenu = await createContextMenu(actualFolder as any);

            setDropDownMenu(newDropDownMenu);
            setcontextMenu(newContextMenu);
            
        }
        if (selectedFolder != undefined) {
            configureMenus(selectedFolder);
        }
    }, [selectedFolder]);

    async function createMenuItems(items: BookmarkItem[], actionType: BookmarkActions, userOptions: OptionType, actions: UserActions): Promise<MenuItem[]> {
        console.log('Running createMenuItems');
        const menuItems: MenuItem[] = [];

        for (const [option, name] of Object.entries(actions)) {
            const label = userOptions[name];
            const userAction = actions[option];

            const menuItem: MenuAction = {
                label,
                type: MenuItemType.MenuAction,
                action: userAction,
                onClick: () => {
                    console.log("Clicked option " + label)
                    const payload: UserActionPayload = {
                        items,
                        actionType: actionType,
                        executedAction: userAction
                    }
                    dispatch(appThunks.executeBookmarkAction(payload));
                }
            }
            menuItems.push(menuItem);
        }
        return menuItems;
    }

    async function createDropdownMenu(selectedFolder: BookmarkItem[] | undefined): Promise<MenuItem[]> {
        console.log('Running createDropdownMenu');
        if (selectedFolder == undefined) return [];

        const actionType = BookmarkActions.SortActions;
        const items = selectedFolder ? selectedFolder : [];

        return createMenuItems(items, actionType, SortOptions, SortActions);
    }

    async function createContextMenu(selectedFolder: BookmarkItem[] | undefined): Promise<MenuItem[]> {
        if (selectedFolder == undefined) return [];

        const existingWindows = await dispatch(asyncBrowserThunks.getExistingWindows()).unwrap();
        const existingIncognito = await dispatch(asyncBrowserThunks.getExistingIncognitoWindows()).unwrap();

        const composedMenu = composeItemContextMenu(existingWindows, existingIncognito);
        for (const menuItem of composedMenu) {
            if (menuItem.type != MenuItemType.MenuAction) continue;

            const action = menuItem as MenuAction;
            action.onClick = () => {
                console.log("Clicked option " + menuItem.label);
                const payload: UserActionPayload = {
                    items: selectedFolder,
                    actionType: BookmarkActions.UrlActions,
                    executedAction: action.action as any
                }
                dispatch(appThunks.executeBookmarkAction(payload));
            }
        }
        return composedMenu;

        // const actionType = BookmarkActions.UrlActions;
        // const items = selectedFolder ? selectedFolder : [];

        // return createMenuItems(items, actionType, UrlOptions, UrlActions);
    }

    return [dropDownMenu, contextMenu] as const;
}

export default useMenuItems;