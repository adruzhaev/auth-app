import { useState, useCallback } from 'react';

export const useToggle = (initialValue: boolean) => {
    const [isActive, setIsActive] = useState(initialValue);

    const toggleActive = useCallback(() => {
        setIsActive(v => !v);
    }, []);

    return [isActive, toggleActive] as const;
};