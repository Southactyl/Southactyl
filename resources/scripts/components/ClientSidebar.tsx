import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartBar,
    faChevronRight,
    faCog,
    faDatabase,
    faFileAlt,
    faHome,
    faKey,
    faList,
    faNetworkWired,
    faServer,
    faTerminal,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import Can from '@/components/elements/Can';
import routes from '@/routers/routes';
import Sidebar from '@/components/Sidebar';

interface DashboardProps {
    kind: 'dashboard';
}

interface ServerProps {
    kind: 'server';
    to: (value: string, url?: boolean) => string;
}

type Props = DashboardProps | ServerProps;

const serverIconMap: Record<string, IconDefinition> = {
    Console: faTerminal,
    Files: faFileAlt,
    Databases: faDatabase,
    Schedules: faList,
    Users: faUsers,
    Backups: faDatabase,
    Network: faNetworkWired,
    Startup: faChartBar,
    Settings: faCog,
    Activity: faChartBar,
};

const accountIconMap: Record<string, IconDefinition> = {
    Account: faHome,
    'API Credentials': faKey,
    'SSH Keys': faKey,
    Activity: faChartBar,
};

interface NavItemProps {
    to: string;
    exact?: boolean;
    icon: IconDefinition;
    label: string;
}

const NavItem = ({ to, exact, icon, label }: NavItemProps) => (
    <NavLink to={to} exact={exact} activeClassName={'active'} className={'client-sidebar__link'}>
        <span className={'client-sidebar__linkIcon'}>
            <FontAwesomeIcon icon={icon} />
        </span>

        <span className={'client-sidebar__linkLabel'}>{label}</span>

        <span className={'client-sidebar__linkArrow'}>
            <FontAwesomeIcon icon={faChevronRight} />
        </span>
    </NavLink>
);

const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={'client-sidebar__section'}>
        <div className={'client-sidebar__sectionTitle'}>{title}</div>
        <div className={'client-sidebar__sectionBody'}>{children}</div>
    </div>
);

export default ({ kind, ...props }: Props) => {
    const appName = useStoreState((state: ApplicationStore) => state.settings.data?.name || 'Southactyl');

    return (
        <Sidebar>
            <div className={'client-sidebar'}>
                <div className={'client-sidebar__brand'}>
                    <div className={'client-sidebar__brandIcon'}>
                        <FontAwesomeIcon icon={faServer} />
                    </div>

                    <div className={'client-sidebar__brandContent'}>
                        <strong className={'client-sidebar__brandTitle'}>{appName}</strong>
                        <span className={'client-sidebar__brandSubtitle'}>
                            {kind === 'server' ? 'Server Management' : 'Control Panel'}
                        </span>
                    </div>
                </div>

                <SidebarSection title={'Overview'}>
                    <NavItem to={'/'} exact icon={faHome} label={'Dashboard'} />
                </SidebarSection>

                {kind === 'dashboard' && (
                    <SidebarSection title={'Account'}>
                        {routes.account
                            .filter((route) => !!route.name)
                            .map((route) => (
                                <NavItem
                                    key={route.path}
                                    to={`/account/${route.path}`.replace('//', '/')}
                                    exact={route.exact}
                                    icon={accountIconMap[route.name || 'Account'] || faCog}
                                    label={route.name || 'Account'}
                                />
                            ))}
                    </SidebarSection>
                )}

                {kind === 'server' && (
                    <SidebarSection title={'Server Navigation'}>
                        {routes.server
                            .filter((route) => !!route.name)
                            .map((route) =>
                                route.permission ? (
                                    <Can key={route.path} action={route.permission} matchAny>
                                        <NavItem
                                            to={props.to(route.path, true)}
                                            exact={route.exact}
                                            icon={serverIconMap[route.name || 'Settings'] || faCog}
                                            label={route.name || 'Settings'}
                                        />
                                    </Can>
                                ) : (
                                    <NavItem
                                        key={route.path}
                                        to={props.to(route.path, true)}
                                        exact={route.exact}
                                        icon={serverIconMap[route.name || 'Console'] || faTerminal}
                                        label={route.name || 'Console'}
                                    />
                                )
                            )}
                    </SidebarSection>
                )}

                <div className={'client-sidebar__footer'}>
                    <div className={'client-sidebar__footerDot'} />
                    <span>{appName} Panel</span>
                </div>
            </div>
        </Sidebar>
    );
};