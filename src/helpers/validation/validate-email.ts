import { RegExpPattern } from '../../constants/reg-exp-pattern';

export const validateEmail = (name: string) => ({
    required: {
        value: true,
        message: `${name} is required`
    },
    pattern: {
        value: RegExpPattern.EMAIL,
        message: `${name} should be typed correctly`
    }
});
