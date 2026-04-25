import React from 'react';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import Sidebar from '@/components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCogs, faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { useState } from 'react';

export default () => {
    const location = useLocation();
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error valid assignment
            window.location = '/';
        });
    };

    return (
        <>
            <Sidebar>
                <SpinnerOverlay visible={isLoggingOut} />
                <div className={'sidebar-brand-link cursor-default'} role={'banner'}>
                    <div className={'sidebar-brand-copy text-center flex items-center justify-center gap-2'}>
                        <span className={'sidebar-brand-name'}>{name}</span>
                    </div>
                </div>
                <NavLink to={'/'} exact>
                    <div className='icon'>
                        <FontAwesomeIcon icon={faHome} />
                    </div>
                    Dashboard
                </NavLink>
                {routes.account
                    .filter((route) => !!route.name)
                    .map(({ path, name, exact = false, iconProp }) => (
                        <NavLink key={path} to={`/account/${path}`.replace('//', '/')} exact={exact}>
                            <div className='icon'>
                                <FontAwesomeIcon icon={iconProp as IconProp} />
                            </div>
                            {name}
                        </NavLink>
                    ))}

                <div className={'sidebar-utilities'}>
                    <SearchContainer asSidebarLink className={'sidebar-utility-link'} />
                    {rootAdmin && (
                        <a href={'/admin'} rel={'noreferrer'}>
                            <div className='icon'>
                                <FontAwesomeIcon icon={faCogs} />
                            </div>
                            Admin
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

            <TransitionRouter>
                <React.Suspense fallback={<Spinner centered />}>
                    <Switch location={location}>
                        <Route path={'/'} exact>
                            <DashboardContainer />
                        </Route>
                        <Route path={'/account/api'} exact>
                            <Redirect to={'/account'} />
                        </Route>
                        <Route path={'/account/ssh'} exact>
                            <Redirect to={'/account'} />
                        </Route>
                        {routes.account.map(({ path, component: Component }) => (
                            <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                <Component />
                            </Route>
                        ))}
                        <Route path={'*'}>
                            <NotFound />
                        </Route>
                    </Switch>
                </React.Suspense>
            </TransitionRouter>
        </>
    );
};
