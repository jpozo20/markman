import { BookmarkItem } from './BookmarkTypes';

export type OptionType = {
    [key: string]: string
}
export enum SortActions {
    SortAscending = 'SortASC',
    SortDecending = 'SortDESC',
    SortAscendingByFolder = 'SortASC_Folder',
    SortDescendingByFolder = 'SortDESC_Folder',
}

export const SortOptions: OptionType = {
    [SortActions.SortAscending]: 'Sort by Name ASC',
    [SortActions.SortDecending]: 'Sort by Name DESC',
    [SortActions.SortAscendingByFolder]: 'Sort by Folder ASC',
    [SortActions.SortDescendingByFolder]: 'Sort by Folder DESC',
}

export enum UrlActions {
    Open_CurrentWindow = 'Open_CurrentWindow',
    Open_NewWindow = 'Open_NewWindow',
    Open_ExistingWindow = 'Open_ExistingWindow',

    OpenIncognito_NewWindow = 'Open_NewIncognitoWindow',
    OpenIncognito_ExistingWindow = 'Open_ExistingIncognitoWindow',
}

export const UrlOptions: OptionType = {
    [UrlActions.Open_CurrentWindow]: 'Open in current window',
    [UrlActions.Open_NewWindow]: 'Open in new window',
    [UrlActions.Open_ExistingWindow]: 'Open in existing window',

    [UrlActions.OpenIncognito_NewWindow]: 'Open in new incognito window',
    [UrlActions.OpenIncognito_ExistingWindow]: 'Open in existing incognito window',
}

export enum ItemActions {
    EditItem = 'EditItem',
    MoveItem = 'MoveItem',
    DeleteItem = 'DeleteItem',
    UpdateItem = 'UpdateItem'
}

export const ItemOptions: OptionType = {
    [ItemActions.EditItem]: 'Edit bookmark',
    [ItemActions.MoveItem]: 'Move bookmark',
    [ItemActions.DeleteItem]: 'Delete bookmark',
    [ItemActions.UpdateItem]: 'Update bookmark',

}

export const enum BookmarkActions {
    SortActions = 'SortActions',
    ItemActions = 'ItemActions',
    UrlActions = 'UrlActions'
}

 
export type UserActions = typeof ItemActions | typeof SortActions | typeof UrlActions;

export type UserActionPayload = {
    items: BookmarkItem[],
    actionType: BookmarkActions,
    executedAction: UserActions,
    param?: number | string
}

