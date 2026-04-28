import React, { useEffect, useState } from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import CreateApiKeyForm from '@/components/dashboard/forms/CreateApiKeyForm';
import getApiKeys, { ApiKey } from '@/api/account/getApiKeys';
import deleteApiKey from '@/api/account/deleteApiKey';
import FlashMessageRender from '@/components/FlashMessageRender';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { Dialog } from '@/components/elements/dialog';
import { useFlashKey } from '@/plugins/useFlash';
import Code from '@/components/elements/Code';
import { useSSHKeys } from '@/api/account/ssh-keys';
import CreateSSHKeyForm from '@/components/dashboard/ssh/CreateSSHKeyForm';
import DeleteSSHKeyButton from '@/components/dashboard/ssh/DeleteSSHKeyButton';

const SectionShell: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({
    title,
    description,
    children,
}) => (
    <section
        css={tw`rounded-md p-4 md:p-5`}
        style={{
            background: 'color-mix(in srgb, var(--theme-component-headers) 68%, transparent)',
            border: '1px solid color-mix(in srgb, var(--theme-card-border) 78%, transparent)',
        }}
    >
        <div
            css={tw`mb-4 pb-3`}
            style={{ borderBottom: '1px solid color-mix(in srgb, var(--theme-card-border) 72%, transparent)' }}
        >
            <h2 css={tw`text-lg font-semibold`} style={{ color: 'var(--theme-text-primary)' }}>
                {title}
            </h2>
            <p css={tw`text-sm`} style={{ color: 'var(--theme-text-muted)' }}>
                {description}
            </p>
        </div>
        {children}
    </section>
);

export default () => {
    const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();
    const { clearAndAddHttpError } = useFlashKey('account');
    const [deleteIdentifier, setDeleteIdentifier] = useState('');
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const {
        data: sshKeys,
        isValidating: isSSHLoading,
        error: sshError,
    } = useSSHKeys({
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        getApiKeys()
            .then((apiKeys) => setKeys(apiKeys))
            .then(() => setLoading(false))
            .catch((error) => clearAndAddHttpError(error));
    }, []);

    useEffect(() => {
        clearAndAddHttpError(sshError);
    }, [sshError]);

    const doDeletion = (identifier: string) => {
        setLoading(true);
        clearAndAddHttpError();

        deleteApiKey(identifier)
            .then(() => setKeys((s) => [...(s || []).filter((key) => key.identifier !== identifier)]))
            .catch((error) => clearAndAddHttpError(error))
            .then(() => {
                setLoading(false);
                setDeleteIdentifier('');
            });
    };

    return (
        <PageContentBlock title={'Account'}>
            <FlashMessageRender byKey={'account'} />
            {state?.twoFactorRedirect && (
                <MessageBox title={'2-Factor Required'} type={'error'}>
                    Your account must have two-factor authentication enabled in order to continue.
                </MessageBox>
            )}

            <div css={[tw`space-y-10`, state?.twoFactorRedirect ? tw`mt-4` : tw`mt-8`]}>
                <div
                    css={tw`grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-md`}
                    style={{
                        background: 'color-mix(in srgb, var(--theme-component-headers) 72%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--theme-card-border) 76%, transparent)',
                    }}
                >
                    <div
                        css={tw`p-3 rounded`}
                        style={{ background: 'color-mix(in srgb, var(--theme-background) 82%, transparent)' }}
                    >
                        <p css={tw`text-xs uppercase tracking-wide`} style={{ color: 'var(--theme-text-muted)' }}>
                            API Keys
                        </p>
                        <p css={tw`text-2xl font-semibold`} style={{ color: 'var(--theme-text-primary)' }}>
                            {keys.length}
                        </p>
                    </div>
                    <div
                        css={tw`p-3 rounded`}
                        style={{ background: 'color-mix(in srgb, var(--theme-background) 82%, transparent)' }}
                    >
                        <p css={tw`text-xs uppercase tracking-wide`} style={{ color: 'var(--theme-text-muted)' }}>
                            SSH Keys
                        </p>
                        <p css={tw`text-2xl font-semibold`} style={{ color: 'var(--theme-text-primary)' }}>
                            {sshKeys?.length ?? 0}
                        </p>
                    </div>
                    <div
                        css={tw`p-3 rounded`}
                        style={{ background: 'color-mix(in srgb, var(--theme-background) 82%, transparent)' }}
                    >
                        <p css={tw`text-xs uppercase tracking-wide`} style={{ color: 'var(--theme-text-muted)' }}>
                            Security
                        </p>
                        <p css={tw`text-2xl font-semibold`} style={{ color: 'var(--theme-text-primary)' }}>
                            {state?.twoFactorRedirect ? 'Action Required' : 'Configured'}
                        </p>
                    </div>
                </div>

                <SectionShell
                    title={'Profile & Security'}
                    description={'Manage your account credentials and protection settings.'}
                >
                    <div css={tw`grid grid-cols-1 xl:grid-cols-3 gap-6`}>
                        <ContentBox title={'Update Password'} showFlashes={'account:password'}>
                            <UpdatePasswordForm />
                        </ContentBox>
                        <ContentBox title={'Update Email Address'} showFlashes={'account:email'}>
                            <UpdateEmailAddressForm />
                        </ContentBox>
                        <ContentBox title={'Two-Step Verification'}>
                            <ConfigureTwoFactorForm />
                        </ContentBox>
                    </div>
                </SectionShell>

                <SectionShell
                    title={'API Access'}
                    description={'Create and manage credentials for external integrations.'}
                >
                    <div css={tw`grid grid-cols-1 xl:grid-cols-5 gap-6`}>
                        <ContentBox title={'Create API Key'} css={tw`xl:col-span-2`}>
                            <CreateApiKeyForm onKeyCreated={(key) => setKeys((s) => [...s!, key])} />
                        </ContentBox>
                        <ContentBox title={'API Keys'} css={tw`xl:col-span-3 overflow-hidden`}>
                            <SpinnerOverlay visible={loading} />
                            <Dialog.Confirm
                                title={'Delete API Key'}
                                confirm={'Delete Key'}
                                open={!!deleteIdentifier}
                                onClose={() => setDeleteIdentifier('')}
                                onConfirmed={() => doDeletion(deleteIdentifier)}
                            >
                                All requests using the <Code>{deleteIdentifier}</Code> key will be invalidated.
                            </Dialog.Confirm>
                            {keys.length === 0 ? (
                                <p css={tw`text-center text-sm`}>
                                    {loading ? 'Loading...' : 'No API keys exist for this account.'}
                                </p>
                            ) : (
                                keys.map((key, index) => (
                                    <GreyRowBox
                                        key={key.identifier}
                                        css={[tw`flex items-center`, index > 0 && tw`mt-2`]}
                                    >
                                        <FontAwesomeIcon icon={faKey} css={tw`text-neutral-300`} />
                                        <div css={tw`ml-4 flex-1 overflow-hidden`}>
                                            <p css={tw`text-sm break-words`}>{key.description}</p>
                                            <p css={tw`text-2xs text-neutral-300 uppercase`}>
                                                Last used:&nbsp;
                                                {key.lastUsedAt
                                                    ? format(key.lastUsedAt, 'MMM do, yyyy HH:mm')
                                                    : 'Never'}
                                            </p>
                                        </div>
                                        <p css={tw`text-sm ml-4 hidden md:block`}>
                                            <code
                                                css={tw`font-mono py-1 px-2 rounded`}
                                                style={{
                                                    background:
                                                        'color-mix(in srgb, var(--theme-input-background) 92%, #000 8%)',
                                                    border: '1px solid color-mix(in srgb, var(--theme-card-border) 78%, transparent)',
                                                }}
                                            >
                                                {key.identifier}
                                            </code>
                                        </p>
                                        <button
                                            css={tw`ml-4 p-2 text-sm`}
                                            onClick={() => setDeleteIdentifier(key.identifier)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrashAlt}
                                                css={tw`text-neutral-400 hover:text-red-400 transition-colors duration-150`}
                                            />
                                        </button>
                                    </GreyRowBox>
                                ))
                            )}
                        </ContentBox>
                    </div>
                </SectionShell>

                <SectionShell
                    title={'SSH Access'}
                    description={'Register and rotate SSH keys used for secure server access.'}
                >
                    <div css={tw`grid grid-cols-1 xl:grid-cols-5 gap-6`}>
                        <ContentBox title={'Add SSH Key'} css={tw`xl:col-span-2`}>
                            <CreateSSHKeyForm />
                        </ContentBox>
                        <ContentBox title={'SSH Keys'} css={tw`xl:col-span-3 overflow-hidden`}>
                            <SpinnerOverlay visible={!sshKeys && isSSHLoading} />
                            {!sshKeys || !sshKeys.length ? (
                                <p css={tw`text-center text-sm`}>
                                    {!sshKeys ? 'Loading...' : 'No SSH Keys exist for this account.'}
                                </p>
                            ) : (
                                sshKeys.map((key, index) => (
                                    <GreyRowBox
                                        key={key.fingerprint}
                                        css={[tw`flex space-x-4 items-center`, index > 0 && tw`mt-2`]}
                                    >
                                        <FontAwesomeIcon icon={faKey} css={tw`text-neutral-300`} />
                                        <div css={tw`flex-1`}>
                                            <p css={tw`text-sm break-words font-medium`}>{key.name}</p>
                                            <p css={tw`text-xs mt-1 font-mono truncate`}>SHA256:{key.fingerprint}</p>
                                            <p css={tw`text-xs mt-1 text-neutral-300 uppercase`}>
                                                Added on:&nbsp;
                                                {format(key.createdAt, 'MMM do, yyyy HH:mm')}
                                            </p>
                                        </div>
                                        <DeleteSSHKeyButton name={key.name} fingerprint={key.fingerprint} />
                                    </GreyRowBox>
                                ))
                            )}
                        </ContentBox>
                    </div>
                </SectionShell>
            </div>
        </PageContentBlock>
    );
};
