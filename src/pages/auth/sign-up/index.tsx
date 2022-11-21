import axios, { AxiosError } from 'axios';
import { AuthForm } from '../../../components/AuthForm';
import { Input } from '../../../components/Input';
import { Layout } from '../../../components/Layout';
import { useForm } from '../../../hooks/use-form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AuthError } from '../../../components/AuthError';
import { validateEmail, validateRequiredField } from '../../../helpers/validation';
import { StatusCode } from '../../../constants/status-code';
import { ApiRoutes, AppRoutes } from '../../../constants/route';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';

interface ISignUp {
    userName: string
    email: string
    password: string
    passwordConfirmation: string
}

export default function SignUp() {
    const router = useRouter();
    const [signUpError, setSignUpError] = useState('');

    const { handleChange, handleSubmit, values, errors, setErrors } = useForm<ISignUp>({
        userName: validateRequiredField('User name'),
        email: validateEmail('Email'),
        password: validateRequiredField('Password'),
        passwordConfirmation: validateRequiredField('Password confirmation'),
    }, submitUserSignUp);

    useEffect(() => {
        signUpError && setTimeout(() => {
            setSignUpError('');
        }, 5000);
    }, [signUpError]);

    async function submitUserSignUp() {
        const { userName, email, password, passwordConfirmation } = values;
        let submitResponse;

        if (password !== passwordConfirmation) {
            setErrors({...errors, password: 'Passwords don\'t match'});
            return;
        }

        try {
            submitResponse = await axios.post(ApiRoutes.SignUp, {
                name: userName,
                email,
                password
            });
        } catch(err) {
            if (err instanceof AxiosError) {
                if (err.response?.data.emailError) {
                    setErrors({...errors, email: err.response?.data.emailError});
                    return; 
                } else {
                    setSignUpError(err.response?.data.error);
                    return;
                }
            }

            setSignUpError('Unexpected error');
        }

        if (submitResponse?.status === StatusCode.OK) {
            router.push(AppRoutes.SignIn);
        }   
    }

    return <Layout authType="sign-up">
        <AuthForm
            title="Sign up for free"
            authInfo="Have an account already?"
            linkTitle="Sign in"
            href={AppRoutes.SignIn}
            onSubmit={handleSubmit}
        >
            <Input  
                label="User name" 
                id="name" 
                name="userName"
                onChange={handleChange}
                value={values.userName || ''}
                error={errors.userName || ''}
            />
            <Input 
                label="E-mail address" 
                id="email" 
                name="email"
                onChange={handleChange}
                value={values.email || ''}
                error={errors.email || ''}
            />
            <Input 
                label="Password" 
                id="password" 
                name="password"
                onChange={handleChange}
                value={values.password || ''}
                error={errors.password || ''}
                isPassword
            />
            <Input 
                label="Confirm password" 
                id="confirm-password" 
                name="passwordConfirmation"
                onChange={handleChange}
                value={values.passwordConfirmation || ''}
                error={errors.passwordConfirmation || ''}
                isPassword
            />

            {signUpError && <AuthError title={signUpError} />}
        </AuthForm>
    </Layout>;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { token } = parse(req.headers.cookie || '');

    if (token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
