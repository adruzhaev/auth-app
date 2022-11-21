import cn from 'classnames';
import styles from './AuthError.module.css';

export const AuthError = (props: {
    className?: string
    title: string
}) => {
    return <p className={cn(styles.error, props.className)}>
        {props.title}
    </p>;
};