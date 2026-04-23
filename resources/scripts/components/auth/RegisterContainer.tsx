import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import register from '@/api/auth/register';
import { httpErrorToHuman } from '@/api/http';
import { Form } from 'formik';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import Field from '@/components/elements/Field';
import { Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';

interface Values {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirmation: string;
}

const RegisterContainer = ({ history }: RouteComponentProps) => {
    const refCaptcha = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);
    const registrationEnabled = useStoreState((state) => state.settings.data!.registration.enabled);

    useEffect(() => {
        clearFlashes();

        if (!registrationEnabled) {
            addFlash({ type: 'error', title: 'Error', message: 'Registration is currently disabled.' });
            history.replace('/auth/login');
        }
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            refCaptcha.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });

            return;
        }

        register({
            email: values.email,
            username: values.username,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password,
            passwordConfirmation: values.passwordConfirmation,
            recaptchaData: token,
        })
            .then(() => {
                addFlash({
                    type: 'success',
                    title: 'Success',
                    message: 'Account created. You can now log in.',
                });
                history.push('/auth/login');
            })
            .catch((error) => {
                console.error(error);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            })
            .then(() => {
                setToken('');
                if (refCaptcha.current) refCaptcha.current.reset();
                setSubmitting(false);
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{
                email: '',
                username: '',
                firstName: '',
                lastName: '',
                password: '',
                passwordConfirmation: '',
            }}
            validationSchema={object().shape({
                email: string().email('A valid email address must be provided.').required('Email is required.'),
                username: string().required('Username is required.'),
                firstName: string().required('First name is required.'),
                lastName: string().required('Last name is required.'),
                password: string().min(8, 'Password must be at least 8 characters.').required('Password is required.'),
                passwordConfirmation: string()
                    .oneOf([ref('password')], 'Passwords must match.')
                    .required('Password confirmation is required.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'Create Account'}
                    subtitle={'Set up your Southactyl account to access the panel.'}
                >
                    <Form>
                        <Field type={'text'} label={'Email'} name={'email'} disabled={isSubmitting} />
                        <div css={tw`mt-4`}>
                            <Field type={'text'} label={'Username'} name={'username'} disabled={isSubmitting} />
                        </div>
                        <div css={tw`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4`}>
                            <Field type={'text'} label={'First Name'} name={'firstName'} disabled={isSubmitting} />
                            <Field type={'text'} label={'Last Name'} name={'lastName'} disabled={isSubmitting} />
                        </div>
                        <div css={tw`mt-4`}>
                            <Field type={'password'} label={'Password'} name={'password'} disabled={isSubmitting} />
                        </div>
                        <div css={tw`mt-4`}>
                            <Field
                                type={'password'}
                                label={'Confirm Password'}
                                name={'passwordConfirmation'}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div css={tw`mt-6`}>
                            <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                                Create Account
                            </Button>
                        </div>
                        <div css={tw`mt-4 text-sm text-neutral-300`}>
                            Already have an account?{' '}
                            <Link to={'/auth/login'} css={tw`text-neutral-100 no-underline hover:text-white`}>
                                Return to Login
                            </Link>
                        </div>
                        {recaptchaEnabled && (
                            <Reaptcha
                                ref={refCaptcha}
                                size={'invisible'}
                                sitekey={siteKey || '_invalid_key'}
                                onVerify={(response) => {
                                    setToken(response);
                                    submitForm();
                                }}
                                onExpire={() => {
                                    setSubmitting(false);
                                    setToken('');
                                }}
                            />
                        )}
                    </Form>
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default RegisterContainer;
