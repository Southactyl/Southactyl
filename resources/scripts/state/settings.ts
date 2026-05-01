import { action, Action } from 'easy-peasy';

export interface SiteSettings {
    name: string;
    locale: string;
    recaptcha: {
        enabled: boolean;
        siteKey: string;
    };
    registration: {
        enabled: boolean;
    };
    theme: {
        primary_content: string;
        secondary_content: string;
        background_color: string;
        component_headers: string;
        sidebar_navigation: string;
        success_color?: string;
        warning_color?: string;
        danger_color?: string;
        info_color?: string;
        text_primary?: string;
        text_muted?: string;
        link_color?: string;
        link_hover_color?: string;
        card_background?: string;
        card_border?: string;
        input_background?: string;
        input_border?: string;
        topbar_background?: string;
        topbar_text?: string;
        footer_background?: string;
        footer_text?: string;
        dashboard_panel_background?: string;
        dashboard_panel_border?: string;
        dashboard_stat_background?: string;
        dashboard_stat_border?: string;
        dashboard_search_background?: string;
        dashboard_search_border?: string;
        dashboard_online_text?: string;
        dashboard_offline_text?: string;
        sidebar_text?: string;
        sidebar_text_active?: string;
        sidebar_section_text?: string;
        sidebar_footer_text?: string;
        sidebar_active_background?: string;
        sidebar_icon_background?: string;
        sidebar_hover_background?: string;
    };
}

export interface SettingsStore {
    data?: SiteSettings;
    setSettings: Action<SettingsStore, SiteSettings>;
}

const settings: SettingsStore = {
    data: undefined,

    setSettings: action((state, payload) => {
        state.data = payload;
    }),
};

export default settings;
