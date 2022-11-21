import cn from 'classnames';
import styles from './Button.module.css';
import { IButtonProps } from './types';

export const Button = ({className, title, ...rest}: IButtonProps) => {
    return <button className={cn(styles.button, className)} {...rest}>
        {title}
    </button>;
};