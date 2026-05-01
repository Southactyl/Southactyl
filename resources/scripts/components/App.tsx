import React, { lazy } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Router, Switch } from 'react-router-dom';
import { StoreProvider } from 'easy-peasy';
import { store } from '@/state';
import { SiteSettings } from '@/state/settings';
import ProgressBar from '@/components/elements/ProgressBar';
import { NotFound } from '@/components/elements/ScreenBlock';
import tw from 'twin.macro';
import GlobalStylesheet from '@/assets/css/GlobalStylesheet';
import { history } from '@/components/history';
import { setupInterceptors } from '@/api/interceptors';
import AuthenticatedRoute from '@/components/elements/AuthenticatedRoute';
import { ServerContext } from '@/state/server';
import { applyThemePaletteVariables } from '@/lib/themeColors';
import '@/assets/tailwind.css';
import Spinner from '@/components/elements/Spinner';

const DashboardRouter = lazy(() => import(/* webpackChunkName: "dashboard" */ '@/routers/DashboardRouter'));
const ServerRouter = lazy(() => import(/* webpackChunkName: "server" */ '@/routers/ServerRouter'));
const AuthenticationRouter = lazy(() => import(/* webpackChunkName: "auth" */ '@/routers/AuthenticationRouter'));

interface ExtendedWindow extends Window {
    SiteConfiguration?: SiteSettings;
    PterodactylUser?: {
        uuid: string;
        username: string;
        email: string;
        /* eslint-disable camelcase */
        root_admin: boolean;
        use_totp: boolean;
        language: string;
        updated_at: string;
        created_at: string;
        /* eslint-enable camelcase */
    };
}

setupInterceptors(history);

const App = () => {
    const { PterodactylUser, SiteConfiguration } = window as ExtendedWindow;
    if (PterodactylUser && !store.getState().user.data) {
        store.getActions().user.setUserData({
            uuid: PterodactylUser.uuid,
            username: PterodactylUser.username,
            email: PterodactylUser.email,
            language: PterodactylUser.language,
            rootAdmin: PterodactylUser.root_admin,
            useTotp: PterodactylUser.use_totp,
            createdAt: new Date(PterodactylUser.created_at),
            updatedAt: new Date(PterodactylUser.updated_at),
        });
    }

    if (!store.getState().settings.data) {
        store.getActions().settings.setSettings(SiteConfiguration!);
    }

    const theme = SiteConfiguration?.theme;
    if (theme) {
        const root = document.documentElement;
        const body = document.body;
        root.style.setProperty('--theme-primary-content', theme.primary_content);
        root.style.setProperty('--theme-secondary-content', theme.secondary_content);
        root.style.setProperty('--theme-background', theme.background_color);
        root.style.setProperty('--theme-component-headers', theme.component_headers);
        root.style.setProperty('--theme-sidebar', theme.sidebar_navigation);
        body.style.setProperty('--theme-primary-content', theme.primary_content);
        body.style.setProperty('--theme-secondary-content', theme.secondary_content);
        body.style.setProperty('--theme-background', theme.background_color);
        body.style.setProperty('--theme-component-headers', theme.component_headers);
        body.style.setProperty('--theme-sidebar', theme.sidebar_navigation);

        const extraMap: Record<string, string> = {
            success_color: '--theme-success',
            warning_color: '--theme-warning',
            danger_color: '--theme-danger',
            info_color: '--theme-info',
            text_primary: '--theme-text-primary',
            text_muted: '--theme-text-muted',
            link_color: '--theme-link',
            link_hover_color: '--theme-link-hover',
            card_background: '--theme-card-background',
            card_border: '--theme-card-border',
            input_background: '--theme-input-background',
            input_border: '--theme-input-border',
            topbar_background: '--theme-topbar-background',
            topbar_text: '--theme-topbar-text',
            footer_background: '--theme-footer-background',
            footer_text: '--theme-footer-text',
            dashboard_panel_background: '--theme-dashboard-panel-background',
            dashboard_panel_border: '--theme-dashboard-panel-border',
            dashboard_stat_background: '--theme-dashboard-stat-background',
            dashboard_stat_border: '--theme-dashboard-stat-border',
            dashboard_search_background: '--theme-dashboard-search-background',
            dashboard_search_border: '--theme-dashboard-search-border',
            dashboard_online_text: '--theme-dashboard-online-text',
            dashboard_offline_text: '--theme-dashboard-offline-text',
            sidebar_text: '--theme-sidebar-text',
            sidebar_text_active: '--theme-sidebar-text-active',
            sidebar_section_text: '--theme-sidebar-section-text',
            sidebar_footer_text: '--theme-sidebar-footer-text',
            sidebar_active_background: '--theme-sidebar-active-background',
            sidebar_icon_background: '--theme-sidebar-icon-background',
            sidebar_hover_background: '--theme-sidebar-hover-background',
        };

        Object.keys(extraMap).forEach((key) => {
            const value = (theme as unknown as Record<string, string | undefined>)[key];
            if (!value) return;
            root.style.setProperty(extraMap[key], value);
            body.style.setProperty(extraMap[key], value);
        });

        applyThemePaletteVariables(theme);
    }

    return (
        <>
            <GlobalStylesheet />
            <StoreProvider store={store}>
                <ProgressBar />
                <div css={tw`mx-auto w-auto`} className='dashboard-container'>
                    <Router history={history}>
                        <Switch>
                            <Route path={'/auth'}>
                                <Spinner.Suspense>
                                    <AuthenticationRouter />
                                </Spinner.Suspense>
                            </Route>
                            <AuthenticatedRoute path={'/server/:id'}>
                                <Spinner.Suspense>
                                    <ServerContext.Provider>
                                        <ServerRouter />
                                    </ServerContext.Provider>
                                </Spinner.Suspense>
                            </AuthenticatedRoute>
                            <AuthenticatedRoute path={'/'}>
                                <Spinner.Suspense>
                                    <DashboardRouter />
                                </Spinner.Suspense>
                            </AuthenticatedRoute>
                            <Route path={'*'}>
                                <NotFound />
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </StoreProvider>
        </>
    );
};

export default hot(App);
