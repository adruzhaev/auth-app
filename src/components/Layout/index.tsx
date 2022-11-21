import cn from 'classnames';
import { ReactNode, useEffect } from 'react';
import styles from './Layout.module.css';

type authType = 'sign-in' | 'sign-up'

export const Layout = (props: {
    children: ReactNode
    authType: authType
}) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return <div className={cn(
        styles.layout,
        props.authType === 'sign-in' && styles['sign-in'],
        props.authType === 'sign-up' && styles['sign-up']
    )}>
        {props.children}
    </div>;
};