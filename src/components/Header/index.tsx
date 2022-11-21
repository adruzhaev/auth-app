import { ReactNode } from 'react';
import LogoutIcon from '../../assets/logout.svg';
import styles from './Header.module.css';

export const Header = (props: {
    className?: string
    children?: ReactNode
    onLogoutButtonClick: () => void
}) => {
    return <header className={styles.container}>
        {props.children}
        <button className={styles['logout-button']} onClick={props.onLogoutButtonClick}>
            <LogoutIcon />
        </button>
    </header>;
};