import cn from 'classnames';
import styles from './MockContent.module.css';

export const MockContent = (props: {
    className?: string
}) => {
    return <div className={cn(styles.mock, props.className)}>
        <div className={styles['content__circle']} />  
        <div className={styles['line-top']} />
        <div className={styles['line-bottom']} />
    </div>;
};