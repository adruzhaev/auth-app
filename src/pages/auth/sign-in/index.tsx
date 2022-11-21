import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { AuthForm } from '../../../components/AuthForm';
import { Input } from '../../../components/Input';
import { Layout } from '../../../components/Layout';
import { validateRequiredField } from '../../../helpers/validation/validate-required-field';
import { useForm } from '../../../hooks/use-form';
import { useRouter } from 'next/router';
import { validateEmail } from '../../../helpers/validation';
import { ApiRoutes, AppRoutes } from '../../../constants/route';
import { StatusCode } from '../../../constants/status-code';
import { AuthError } from '../../../components/AuthError';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';

interface ISignIn {
    email: string
    password: string
}

export default function SignIn() {
    const router = useRouter();
    const [signInError, setSignInError] = useState('');

    const { handleChange, handleSubmit, values, errors, setErrors } = useForm<ISignIn>({
        email: validateEmail('Email'),
        password: validateRequiredField('Password'),
    }, submitSignIn);

    async function submitSignIn() {
        const { email, password } = values;
        let signInResponse; 

        try {
            signInResponse = await axios.post(ApiRoutes.SignIn, {
                email,
                password
            });
        } catch(err) {
            if (err instanceof AxiosError) {
                if (err.response?.data.passwordError) {                    
                    setErrors({...errors, password: err.response?.data.passwordError});
                    return; 
                } else if (err.response?.data.emailError) {
                    setErrors({...errors, email: err.response?.data.emailError});
                    return; 
                } else {
                    setSignInError(err.response?.data.error);
                    return;
                }
            }

            setSignInError('Unexpected error');
        }

        if (signInResponse?.status === StatusCode.OK) {
            router.push('/');
        }
    }

    return <Layout authType="sign-in">
        <AuthForm
            title="Sign in"
            authInfo="New to the service?"
            linkTitle="Sign up for free"
            href={AppRoutes.SignUp}
            onSubmit={handleSubmit}
        >
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

            {signInError && <AuthError title={signInError} />}
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
