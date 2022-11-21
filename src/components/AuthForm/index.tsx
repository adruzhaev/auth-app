import { ReactNode, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '../Button';
import styles from './AuthForm.module.css';

export const AuthForm = (props: {
    className?: string
    children: ReactNode
    title: string
    authInfo: string
    linkTitle: string
    href: string
    onSubmit: (evt: FormEvent<HTMLFormElement>) => void
}) => {
    return <div className={styles.container}>
        <div>
            <h1 className={styles.title}>
                {props.title}
            </h1>

            <p className={styles['auth-info']}>
                {props.authInfo}
                {' '}
                <Link className={styles['sign-link']} href={props.href}>
                    {props.linkTitle}
                </Link>
            </p>
        </div>

        <form className={styles.form} onSubmit={props.onSubmit}>
            {props.children}

            <Button 
                className={styles.button}
                title={props.title}
                type="submit"
            />
        </form>
    </div>;
};