import React, { HtmlHTMLAttributes } from 'react'
import clsx from 'clsx';

import * as styles from '../styles';

type ButtonWithIconProps = {
    icon: React.ReactNode,
    text: string,
    onClick: any
}

const ButtonWithIcon = ({ icon, text, onClick }: ButtonWithIconProps, props) => {

    const layoutStyle = `mx-1 p-1 cursor-pointer`;
    const classes = clsx(layoutStyle, styles.hoverItemStyle);
    return (
        <div className={classes}>
            <button {...props} onClick={onClick} className="flex px-1">
                {icon}
                {text}
            </button>
        </div>
    )
}
export default ButtonWithIcon;

