import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface IInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    className?: string
    label: string    
    error: string
    isPassword?: boolean
}
