import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import { Form } from 'formik';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import Label from '@/components/elements/Label';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';

interface Values {
    username: string;
    password: string;
}

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);
    const registrationEnabled = useStoreState((state) => state.settings.data!.registration.enabled);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('A username or email must be provided.'),
                password: string().required('Please enter your account password.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <AuthSplitLayout
                    title={'Welcome back to Southactyl'}
                    subtitle={'Use your account credentials to continue.'}
                    bottom={
                        registrationEnabled ? (
                            <>
                                <div css={tw`mt-2`}>
                                    <Link
                                        to={'/auth/register'}
                                        css={tw`inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-neutral-500 bg-neutral-700/60 text-neutral-100 no-underline font-semibold tracking-wide shadow-sm hover:bg-neutral-600/80 hover:border-neutral-400 hover:shadow-md transition-all`}
                                    >
                                        Create an Account
                                    </Link>
                                </div>
                                <div css={tw`mt-5 flex items-center gap-3 text-neutral-500 text-xs uppercase tracking-wider`}>
                                    <span css={tw`h-px flex-1 bg-neutral-700`} />
                                    <span>Or Continue With</span>
                                    <span css={tw`h-px flex-1 bg-neutral-700`} />
                                </div>
                            </>
                        ) : null
                    }
                >
                    <Form>
                        <Field type={'text'} label={'Username or Email'} name={'username'} disabled={isSubmitting} />
                        <div css={tw`mt-5`}>
                            <div css={tw`flex items-center justify-between mb-2`}>
                                <Label>Password</Label>
                                <Link
                                    to={'/auth/password'}
                                    css={tw`text-sm text-neutral-400 no-underline hover:text-neutral-200`}
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <Field type={'password'} name={'password'} disabled={isSubmitting} />
                        </div>
                        <div css={tw`mt-6`}>
                            <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                                Sign In
                            </Button>
                        </div>
                        {recaptchaEnabled && (
                            <Reaptcha
                                ref={ref}
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
                        {!registrationEnabled && (
                            <div css={tw`mt-4 text-sm text-neutral-400`}>
                                <Link to={'/auth/password'} css={tw`no-underline hover:text-neutral-200`}>
                                    Forgot Password?
                                </Link>
                            </div>
                        )}
                    </Form>
                </AuthSplitLayout>
            )}
        </Formik>
    );
};

export default LoginContainer;
