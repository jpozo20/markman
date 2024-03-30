import React from 'react'
import clsx from 'clsx'

export const DotsHorizontal = (props:{className?: string}) => {
    const baseStyle = "w-[28px] h-[28px] text-white";
    const finalStyle = clsx([baseStyle, props.className]);
    return (
        <svg className={finalStyle} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M6 12h.01m6 0h.01m5.99 0h.01" />
        </svg>

    )
}