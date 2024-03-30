import React from 'react'
import clsx from 'clsx'

export const DotsVertical = (props: {className?: string}) => {
    const baseStyle = "w-[32px] h-[32px] text-white";
    const finalStyle = clsx([baseStyle, props.className]);
    return (
        <svg className={finalStyle} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M12 6h.01M12 12h.01M12 18h.01" />
        </svg>
    )
}