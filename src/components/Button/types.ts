import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

export interface IButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    className?: string
    title: string
}