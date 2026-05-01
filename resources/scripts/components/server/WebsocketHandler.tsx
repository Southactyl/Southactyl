import React, { useEffect, useState } from 'react';
import { Websocket } from '@/plugins/Websocket';
import { ServerContext } from '@/state/server';
import getWebsocketToken from '@/api/server/getWebsocketToken';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faPlug } from '@fortawesome/free-solid-svg-icons';

const reconnectErrors = ['jwt: exp claim is invalid', 'jwt: created too far in past (denylist)'];

export default () => {
    let updatingToken = false;
    const [error, setError] = useState<'connecting' | string>('');
    const isConnecting = error === 'connecting';
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const setServerStatus = ServerContext.useStoreActions((actions) => actions.status.setServerStatus);
    const { setInstance, setConnectionState } = ServerContext.useStoreActions((actions) => actions.socket);

    const updateToken = (uuid: string, socket: Websocket) => {
        if (updatingToken) return;

        updatingToken = true;
        getWebsocketToken(uuid)
            .then((data) => socket.setToken(data.token, true))
            .catch((error) => console.error(error))
            .then(() => {
                updatingToken = false;
            });
    };

    const connect = (uuid: string) => {
        const socket = new Websocket();

        socket.on('auth success', () => setConnectionState(true));
        socket.on('SOCKET_CLOSE', () => setConnectionState(false));
        socket.on('SOCKET_CONNECT_ERROR', () => {
            setError('Failed to connect to websocket instance after multiple attempts: try refreshing the page.');
        });
        socket.on('SOCKET_ERROR', () => {
            setError('connecting');
            setConnectionState(false);
        });
        socket.on('status', (status) => setServerStatus(status));

        socket.on('daemon error', (message) => {
            console.warn('Got error message from daemon socket:', message);
        });

        socket.on('token expiring', () => updateToken(uuid, socket));
        socket.on('token expired', () => updateToken(uuid, socket));
        socket.on('jwt error', (error: string) => {
            setConnectionState(false);
            console.warn('JWT validation error from wings:', error);

            if (reconnectErrors.find((v) => error.toLowerCase().indexOf(v) >= 0)) {
                updateToken(uuid, socket);
            } else {
                setError(
                    'There was an error validating the credentials provided for the websocket. Please refresh the page.'
                );
            }
        });

        socket.on('transfer status', (status: string) => {
            if (status === 'starting' || status === 'success') {
                return;
            }

            // This code forces a reconnection to the websocket which will connect us to the target node instead of the source node
            // in order to be able to receive transfer logs from the target node.
            socket.close();
            setError('connecting');
            setConnectionState(false);
            setInstance(null);
            connect(uuid);
        });

        getWebsocketToken(uuid)
            .then((data) => {
                // Connect and then set the authentication token.
                socket.setToken(data.token).connect(data.socket);

                // Once that is done, set the instance.
                setInstance(socket);
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        connected && setError('');
    }, [connected]);

    useEffect(() => {
        return () => {
            instance && instance.close();
        };
    }, [instance]);

    useEffect(() => {
        // If there is already an instance or there is no server, just exit out of this process
        // since we don't need to make a new connection.
        if (instance || !uuid) {
            return;
        }

        connect(uuid);
    }, [uuid]);

    return error ? (
        <CSSTransition timeout={150} in appear classNames={'fade'} unmountOnExit>
            <div>
                <ContentContainer css={tw`flex items-center justify-center py-6`}>
                    <div
                        css={tw`w-full max-w-4xl rounded-md px-4 py-4 flex items-center gap-3`}
                        style={{
                            background: isConnecting
                                ? 'linear-gradient(135deg, color-mix(in srgb, var(--theme-card-background) 96%, var(--theme-warning) 4%) 0%, color-mix(in srgb, var(--theme-card-background) 98%, #000 2%) 100%)'
                                : 'linear-gradient(135deg, color-mix(in srgb, var(--theme-card-background) 95%, var(--theme-danger) 5%) 0%, color-mix(in srgb, var(--theme-card-background) 98%, #000 2%) 100%)',
                            border: isConnecting
                                ? '1px solid color-mix(in srgb, var(--theme-warning) 38%, var(--theme-card-border) 62%)'
                                : '1px solid color-mix(in srgb, var(--theme-danger) 42%, var(--theme-card-border) 58%)',
                        }}
                    >
                        {isConnecting ? (
                            <>
                                <Spinner size={'small'} />
                                <FontAwesomeIcon icon={faPlug} style={{ color: 'var(--theme-warning)' }} />
                                <p css={tw`text-sm`} style={{ color: 'var(--theme-text-primary)' }}>
                                    We&apos;re having some trouble connecting to your server, please wait...
                                </p>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon
                                    icon={faExclamationTriangle}
                                    style={{ color: 'var(--theme-danger)' }}
                                />
                                <p css={tw`text-sm`} style={{ color: 'var(--theme-text-primary)' }}>
                                    {error}
                                </p>
                            </>
                        )}
                    </div>
                </ContentContainer>
            </div>
        </CSSTransition>
    ) : null;
};
