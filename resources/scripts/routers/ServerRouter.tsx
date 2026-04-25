import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import { CSSTransition } from 'react-transition-group';
import Can from '@/components/elements/Can';
import Spinner from '@/components/elements/Spinner';
import { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import InstallListener from '@/components/server/InstallListener';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import PermissionRoute from '@/components/elements/PermissionRoute';
import routes from '@/routers/routes';
import Sidebar from '@/components/Sidebar';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import getSubdomainDomains from '@/api/server/subdomains/getSubdomainDomains';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import Avatar from '@/components/Avatar';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { faCogs, faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const appName = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const [error, setError] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [subdomainsAvailable, setSubdomainsAvailable] = useState<boolean>(false);

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error valid assignment
            window.location = '/';
        });
    };

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    useEffect(() => {
        if (!uuid) {
            setSubdomainsAvailable(false);
            return;
        }

        getSubdomainDomains(uuid)
            .then((domains) => setSubdomainsAvailable(domains.length > 0))
            .catch(() => setSubdomainsAvailable(false));
    }, [uuid]);

    const availableServerRoutes = routes.server.filter((route) => {
        if (route.path === '/subdomains') {
            return subdomainsAvailable;
        }

        return true;
    });

    return (
        <React.Fragment key={'server-router'}>
            {!uuid || !id ? (
                error ? (
                    <ServerError message={error} />
                ) : (
                    <Spinner size={'large'} centered />
                )
            ) : (
                <>
                    <CSSTransition timeout={150} classNames={'fade'} appear in>
                        <Sidebar>
                            <SpinnerOverlay visible={isLoggingOut} />
                            <div className={'sidebar-brand-link cursor-default'} role={'banner'}>
                                <div className={'sidebar-brand-copy text-center flex items-center justify-center gap-2'}>
                                    <span className={'sidebar-brand-name'}>{appName}</span>
                                </div>
                            </div>
                            <NavLink to={'/'} exact>
                                <div className='icon'>
                                    <FontAwesomeIcon icon={faHome} />
                                </div>
                                Dashboard
                            </NavLink>
                            {routes.server
                                .filter((route) => {
                                    if (route.path === '/subdomains') {
                                        return subdomainsAvailable;
                                    }

                                    return true;
                                })
                                .filter((route) => !!route.name)
                                .map((route) =>
                                    route.permission ? (
                                        <Can key={route.path} action={route.permission} matchAny>
                                            <NavLink to={to(route.path, true)} exact={route.exact}>
                                                <div className='icon'>
                                                    <FontAwesomeIcon icon={route.iconProp as IconProp} />
                                                </div>
                                                {route.name}
                                            </NavLink>
                                        </Can>
                                    ) : (
                                        <NavLink key={route.path} to={to(route.path, true)} exact={route.exact}>
                                            <div className='icon'>
                                                <FontAwesomeIcon icon={route.iconProp as IconProp} />
                                            </div>
                                            {route.name}{' '}
                                        </NavLink>
                                    )
                                )}
                            {rootAdmin && (
                                // eslint-disable-next-line react/jsx-no-target-blank
                                <a href={`/admin/servers/view/${serverId}`} target={'_blank'}>
                                    <div className='icon'>
                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                    </div>
                                    Admin
                                </a>
                            )}
                            <div className={'sidebar-utilities'}>
                                <SearchContainer asSidebarLink className={'sidebar-utility-link'} />
                                {rootAdmin && (
                                    <a href={'/admin'} rel={'noreferrer'}>
                                        <div className='icon'>
                                            <FontAwesomeIcon icon={faCogs} />
                                        </div>
                                        Admin Panel
                                    </a>
                                )}
                                <NavLink
                                    to={'#'}
                                    className={'sidebar-utility-link'}
                                    isActive={() => false}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onTriggerLogout();
                                    }}
                                >
                                    <div className='icon'>
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                    </div>
                                    Sign Out
                                </NavLink>
                            </div>
                        </Sidebar>
                    </CSSTransition>
                    <InstallListener />
                    <TransferListener />
                    <WebsocketHandler />
                    {inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                        <ConflictStateRenderer />
                    ) : (
                        <ErrorBoundary>
                            <TransitionRouter>
                                <Switch location={location}>
                                    {availableServerRoutes.map(({ path, permission, component: Component }) => (
                                        <PermissionRoute key={path} permission={permission} path={to(path)} exact>
                                            <Spinner.Suspense>
                                                <Component />
                                            </Spinner.Suspense>
                                        </PermissionRoute>
                                    ))}
                                    <Route path={'*'} component={NotFound} />
                                </Switch>
                            </TransitionRouter>
                        </ErrorBoundary>
                    )}
                </>
            )}
        </React.Fragment>
    );
};
