import React, { useEffect, useState } from 'react'

import { useAppDispatch } from '../../../store/store';
import { appThunks } from '../../../store/slices/appSlice';

import { BookmarkItem } from '../../../models/BookmarkTypes';
import { MenuAction, MenuGroup, MenuItem, MenuItemType } from '../../../models/MenuTypes';

import { asyncBrowserThunks } from '../../../store/slices/browserSlice'
import { SortActions, UserActions, SortOptions } from '../../../models/BookmarkActions';
import { BookmarkActions, OptionType, UserActionPayload } from '../../../models/BookmarkActions';

import { composeItemContextMenu } from '../../ui/menu/MenuComposer';


const useMenuItems = (selectedItems: BookmarkItem | BookmarkItem[] | undefined) => {

    const dispatch = useAppDispatch();
    const [dropDownMenu, setDropDownMenu] = useState<MenuItem[]>([]);
    const [contextMenu, setcontextMenu] = useState<MenuItem[]>([]);

    useEffect(() => {
        const configureMenus = async () => {

            const actualFolder = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
            const newDropDownMenu = await createDropdownMenu(actualFolder as any);
            const newContextMenu = await createContextMenu(actualFolder as any);

            setDropDownMenu(newDropDownMenu);
            setcontextMenu(newContextMenu);

        }
        if (selectedItems != undefined) {
            configureMenus();
        }
    }, [selectedItems]);

    async function createMenuItems(items: BookmarkItem[], actionType: BookmarkActions, userOptions: OptionType, actions: UserActions): Promise<MenuItem[]> {
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

    async function createDropdownMenu(selectedItems: BookmarkItem[] | undefined): Promise<MenuItem[]> {
        if (selectedItems == undefined) return [];

        const actionType = BookmarkActions.SortActions;
        const items = selectedItems ? selectedItems : [];

        return createMenuItems(items, actionType, SortOptions, SortActions);
    }

    async function createContextMenu(selectedItems: BookmarkItem[] | undefined): Promise<MenuItem[]> {
        if (selectedItems == undefined) return [];

        function configureAction(menuItem: MenuItem) {
            if (menuItem.type != MenuItemType.MenuAction) return;

            const action = menuItem as MenuAction;
            action.onClick = () => {
                console.log("Clicked option " + menuItem.label);
                const payload: UserActionPayload = {
                    items: selectedItems!,
                    actionType: BookmarkActions.UrlActions,
                    executedAction: action.action as any,
                    param: action.param
                }
                dispatch(appThunks.executeBookmarkAction(payload));
            }
        }

        const existingWindows = await dispatch(asyncBrowserThunks.getExistingWindows()).unwrap();
        const existingIncognito = await dispatch(asyncBrowserThunks.getExistingIncognitoWindows()).unwrap();

        const composedMenu = composeItemContextMenu(existingWindows, existingIncognito);
        for (const menuItem of composedMenu) {

            if (menuItem.type == MenuItemType.MenuAction) configureAction(menuItem);
            if (menuItem.type == MenuItemType.MenuGroup) (menuItem as MenuGroup).items.forEach(configureAction)
        }
        return composedMenu;
    }

    return [dropDownMenu, contextMenu] as const;
}

export default useMenuItems;