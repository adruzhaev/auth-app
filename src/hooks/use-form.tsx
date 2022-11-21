import { useState, ChangeEvent, FormEvent, useCallback } from 'react';

interface Validation {
    required?: {
        value: boolean,
        message: string
    },

    pattern?: {
        value: RegExp,
        message: string
    }

    custom?: {
        isValid: (value: string) => boolean,
        message: string
    }
}

type Validations<T extends Record<string, unknown>> = Partial<Record<keyof T, Validation>>
type ErrorRecord<T> = Partial<Record<keyof T, string>>

export const useForm = <T extends Record<keyof T, unknown>>(
    validations?: Validations<T>,
    onSubmit?: (evt: FormEvent<HTMLFormElement>) => void
) => {
    const [values, setValues] = useState<T>({} as T);
    const [errors, setErrors] = useState<ErrorRecord<T>>({});

    const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const newErrors: ErrorRecord<T> = {};
        let isValid = true;

        for (const key in validations) {                
            const value = values[key];
            const validation = validations[key];
            const pattern = validation?.pattern;
            const custom = validation?.custom;
            
            if (validation?.required?.value && !value) {
                isValid = false;
                newErrors[key] = validation.required.message;
            } else if (pattern?.value && !RegExp(pattern.value).test(value as string)) {                
                isValid = false;
                newErrors[key] = pattern.message;
            } else if (custom?.isValid && !custom.isValid(value as string)) {
                isValid = false;
                newErrors[key] = custom.message;
            }
        }        

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        onSubmit && onSubmit(evt);
    };

    const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        const name: Extract<keyof T, string> = evt.target.name as Extract<keyof T, string>;
        const value = evt.target.value;
    
        if (validations) {
            let isValid = true; 
            const newErrors: ErrorRecord<T> = {};
            const validation = validations[name];
            const pattern = validation?.pattern;
            const custom = validation?.custom;

            if (validation?.required?.value && !value) {
                isValid = false;
                newErrors[name] = validation?.required?.message;
            } else if (pattern?.value && !RegExp(pattern.value).test(value as string)) {   
                isValid = false;
                newErrors[name] = pattern.message;
            } else if (custom?.isValid && !custom.isValid(value as string)) {
                isValid = false;
                newErrors[name] = custom.message;
            }

            if (!isValid) {
                setErrors((prev) => ({...prev, ...newErrors}));
            } else {
                setErrors({...errors, [name]: ''});
            }
        }
        
        

        setValues({...values, [name]: value});
    }, [errors, validations, values]);

    return {
        values,
        errors,
        setErrors,
        handleChange,
        handleSubmit
    };
};