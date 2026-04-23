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
