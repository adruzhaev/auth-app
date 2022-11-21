import cn from 'classnames';
import { IInputProps } from './types';
import EyeClosed from '../../assets/eye-closed.svg';
import EyeOpened from '../../assets/eye-opened.svg';
import styles from './Input.module.css';
import { useToggle } from '../../hooks/useToggle';

export const Input = ({ className, label, error, isPassword, ...rest }: IInputProps) => {
    const [isActive, setIsActive] = useToggle(false);

    return <div className={styles.container}>
        <input 
            className={
                cn(
                    styles.input,
                    error && styles['input-error']
                )
            } 

            {...rest} 

            type={`${isPassword && !isActive ? 'password' : 'text'}`}
        />

        <label className={rest.value !== '' ? styles['placeholder-with-value'] : styles.placeholder} htmlFor={rest.id}>
            {label}
        </label>

        {isPassword && !isActive && <button className={cn(styles['password-eye'], styles['password-eye__opened'])} onClick={setIsActive}>
                <EyeOpened />
            </button>
        }

        {isPassword && isActive && <button className={cn(styles['password-eye'], styles['password-eye__closed'])} onClick={setIsActive}>
                <EyeClosed />
            </button>
        }

        {error && <p className={styles['error-message']}>{error}</p>}
    </div>;
};
