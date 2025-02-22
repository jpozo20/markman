import clsx from "clsx";

export const labelStyle = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
export const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ' 
                             + 'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'

export const hoverItemStyle = 'text-sm text-center text-gray-300 focus:ring-gray-50 bg-gray-800 '
                            + 'hover:text-gray-100 hover:bg-gray-700 focus:ring-gray-600 active:bg-gray-600';

const modalButtonLayout = 'flex items-center justify-center py-2.5 px-5 ms-3 p-0.5 rounded-md '
                        + 'text-center text-gray-300 hover:text-white text-sm font-medium relative focus:z-10 ';

export const modalCancelButtonStyle = clsx(modalButtonLayout, 'bg-gray-600 hover:bg-gray-500')
export const modalSaveButtonStyle = clsx(modalButtonLayout, 'bg-blue-700 hover:bg-blue-600 focus:ring-blue-800')

