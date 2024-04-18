import { ItemActions, SortActions, UrlActions } from "./BookmarkActions";

export const enum MenuItemType {
    MenuGroup = 'MenuGroup',
    MenuAction = 'MenuAction',
    MenuDivider = 'MenuDivider'

}

export interface MenuItem {
    label?: string;
    type: MenuItemType;
}

export interface MenuGroup extends MenuItem {
    type: MenuItemType.MenuGroup,
    items: MenuItem[]
}

export interface MenuAction extends MenuItem {
    type: MenuItemType.MenuAction,
    action: ItemActions | SortActions | UrlActions
    param?: number | string
    onClick?: () => void
}

export interface MenuDivider extends MenuItem {
    type: MenuItemType.MenuDivider,
}