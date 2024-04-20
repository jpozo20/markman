import React from 'react'
import clsx from 'clsx';

import * as styles from '../styles';

const ButtonWithIcon = ({icon, text}:{icon: React.ReactNode, text: string}) => {
    
    const layoutStyle = `mx-1 p-1 cursor-pointer`;
    const classes = clsx(layoutStyle, styles.hoverItemStyle);
    return (
        <div className={classes}>
            <button className="flex px-1">
                {icon}
                {text}
            </button>
        </div>
    )
}
export default ButtonWithIcon;

