import Browser from "webextension-polyfill";
import { UrlActions, UrlOptions } from "../../../models/BookmarkActions";
import { MenuAction, MenuDivider, MenuGroup, MenuItem, MenuItemType } from "../../../models/MenuTypes";

const divider: MenuDivider = {
    type: MenuItemType.MenuDivider
}

const openNewTab: MenuAction = {
    label: UrlOptions[UrlActions.Open_CurrentWindow],
    action: UrlActions.Open_CurrentWindow,
    type: MenuItemType.MenuAction
};

const openNewWindow: MenuAction = {
    label: UrlOptions[UrlActions.Open_NewWindow],
    action: UrlActions.Open_NewWindow,
    type: MenuItemType.MenuAction
}

const openExistingWindow: MenuGroup = {
    label: UrlOptions[UrlActions.Open_ExistingWindow],
    type: MenuItemType.MenuGroup,
    items: []
}

const openNewIncognito = {
    label: UrlOptions[UrlActions.OpenIncognito_NewWindow],
    action: UrlActions.OpenIncognito_NewWindow,
    type: MenuItemType.MenuAction
}
const openExistingIncognito: MenuGroup = {
    label: UrlOptions[UrlActions.OpenIncognito_ExistingWindow],
    type: MenuItemType.MenuGroup,
    items: []
}

const composeItemContextMenu = (existingWindows: Browser.Windows.Window[], incognitoWindows: Browser.Windows.Window[]): MenuItem[] => {
    const existingWindowActions: MenuAction[] = existingWindows.map(window => {
        const activeTab = window.tabs?.find((tab => tab.active));
        const label = activeTab?.title || 'N/A';

        return {
            label,
            action: UrlActions.Open_ExistingWindow,
            type: MenuItemType.MenuAction,
            param: window.id
        }
    });
    const incognitoWindowActions: MenuAction[] = incognitoWindows.map(incognitoWindow => {
        const activeTab = incognitoWindow.tabs?.find((tab => tab.active));
        const label = activeTab?.title || 'N/A';

        return {
            label,
            action: UrlActions.Open_ExistingWindow,
            type: MenuItemType.MenuAction,
            param: incognitoWindow.id
        }
    });

    openExistingWindow.items = existingWindowActions;
    openExistingIncognito.items = incognitoWindowActions;

    return [
        openNewTab,
        openNewWindow,
        openExistingWindow,
        divider,
        openNewIncognito,
        openExistingIncognito
    ];
}

export {composeItemContextMenu}