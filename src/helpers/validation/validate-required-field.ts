export const validateRequiredField = (name: string) => ({
    required: {
        value: true,
        message: `${name} is required`
    },
    custom: {
        isValid: (value: string) => value.length <= 30,
        message: `${name} is required field should be less than 30 chars`
    }
});
