import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import font from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export default createGlobalStyle`
    :root {
        --theme-primary-content: #3d8bff;
        --theme-secondary-content: #9bb0d0;
        --theme-background: #050b1a;
        --theme-component-headers: #0b162b;
        --theme-sidebar: #030b1f;
        --theme-success: #22c55e;
        --theme-warning: #f59e0b;
        --theme-danger: #ef4444;
        --theme-info: #38bdf8;
        --theme-text-primary: #eaf2ff;
        --theme-text-muted: #9bb0d0;
        --theme-link: #6aa8ff;
        --theme-link-hover: #9ec5ff;
        --theme-card-background: #0d1a31;
        --theme-card-border: #223a63;
        --theme-card-radius: 12px;
        --theme-input-background: #0a1730;
        --theme-input-border: #2b4878;
        --theme-topbar-background: #040d21;
        --theme-topbar-text: #c9daf6;
        --theme-footer-background: #040d21;
        --theme-footer-text: #b8cae8;
        --theme-dashboard-panel-background: #0a1427;
        --theme-dashboard-panel-border: #1f3357;
        --theme-dashboard-stat-background: #101c35;
        --theme-dashboard-stat-border: #243d65;
        --theme-dashboard-search-background: #0b1730;
        --theme-dashboard-search-border: #2f4c7e;
        --theme-dashboard-online-text: #27d17f;
        --theme-dashboard-offline-text: #fb5f71;
        --theme-sidebar-text: #9bb0d0;
        --theme-sidebar-text-active: #eaf2ff;
        --theme-sidebar-section-text: #6f86aa;
        --theme-sidebar-footer-text: #6f86aa;
        --theme-sidebar-active-background: #12284d;
        --theme-sidebar-icon-background: #0b1730;
        --theme-sidebar-hover-background: #0f2345;
        --theme-primary-50-rgb: 239 246 255;
        --theme-primary-100-rgb: 219 234 254;
        --theme-primary-200-rgb: 191 219 254;
        --theme-primary-300-rgb: 147 197 253;
        --theme-primary-400-rgb: 96 165 250;
        --theme-primary-500-rgb: 59 130 246;
        --theme-primary-600-rgb: 37 99 235;
        --theme-primary-700-rgb: 29 78 216;
        --theme-primary-800-rgb: 30 64 175;
        --theme-primary-900-rgb: 30 58 138;
        --theme-primary-950-rgb: 23 37 84;
        --theme-neutral-50-rgb: 247 249 251;
        --theme-neutral-100-rgb: 231 235 240;
        --theme-neutral-200-rgb: 209 217 226;
        --theme-neutral-300-rgb: 164 173 188;
        --theme-neutral-400-rgb: 132 141 157;
        --theme-neutral-500-rgb: 96 107 123;
        --theme-neutral-600-rgb: 76 87 100;
        --theme-neutral-700-rgb: 62 72 86;
        --theme-neutral-800-rgb: 48 59 74;
        --theme-neutral-900-rgb: 32 41 56;
        --theme-neutral-950-rgb: 20 27 39;
    }

    @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 100 700;
        src: url(${font}) format('woff2-variations');
        unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
    }

    body {
        ${tw`font-sans text-neutral-200`};
        background: var(--theme-background);
        color: var(--theme-text-primary);
        letter-spacing: 0.015em;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
    }

    p {
        ${tw`leading-snug font-sans`};
        color: var(--theme-text-muted);
    }

    a {
        color: var(--theme-link);
    }

    a:hover,
    a:focus {
        color: var(--theme-link-hover);
    }

    button,
    [role='button'] {
        accent-color: var(--theme-primary-content);
    }

    table thead th {
        background: color-mix(in srgb, var(--theme-component-headers) 70%, transparent);
    }

    input,
    select,
    textarea {
        background: var(--theme-input-background);
        border-color: var(--theme-input-border);
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Global themed scrollbar */
    * {
        scrollbar-width: thin;
        scrollbar-color: color-mix(in srgb, var(--theme-input-border) 85%, #000 15%)
            color-mix(in srgb, var(--theme-background) 85%, #000 15%);
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: color-mix(in srgb, var(--theme-background) 85%, #000 15%);
    }

    ::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--theme-input-border) 85%, #000 15%);
        border-radius: 999px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--theme-primary-content);
    }

    ::-webkit-scrollbar-corner {
        background: color-mix(in srgb, var(--theme-background) 85%, #000 15%);
    }

    /* SweetAlert v1 theming */
    .sweet-overlay {
        background-color: color-mix(in srgb, var(--theme-background) 72%, #000000 28%) !important;
    }

    .sweet-alert {
        background: var(--theme-card-background) !important;
        border: 1px solid var(--theme-card-border) !important;
        border-radius: 14px !important;
        box-shadow: 0 18px 36px rgba(0, 0, 0, 0.42) !important;
    }

    .sweet-alert h2 {
        color: var(--theme-text-primary) !important;
    }

    .sweet-alert p {
        color: var(--theme-text-muted) !important;
    }

    .sweet-alert input {
        background: var(--theme-input-background) !important;
        border-color: var(--theme-input-border) !important;
        color: var(--theme-text-primary) !important;
        border-radius: 10px !important;
        box-shadow: none !important;
    }

    .sweet-alert input:focus {
        border-color: var(--theme-primary-content) !important;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-primary-content) 32%, transparent) !important;
    }

    .sweet-alert .sa-error-container {
        background: color-mix(in srgb, var(--theme-danger) 12%, var(--theme-background) 88%) !important;
    }

    .sweet-alert button {
        border-radius: 10px !important;
        border: 1px solid transparent !important;
        font-weight: 600 !important;
    }

    .sweet-alert button.confirm {
        background: var(--theme-primary-content) !important;
        border-color: color-mix(in srgb, var(--theme-primary-content) 82%, #000 18%) !important;
        color: #fff !important;
    }

    .sweet-alert button.confirm:hover {
        background: color-mix(in srgb, var(--theme-primary-content) 88%, #000 12%) !important;
    }

    .sweet-alert button.cancel {
        background: color-mix(in srgb, var(--theme-component-headers) 78%, #ffffff 22%) !important;
        border-color: color-mix(in srgb, var(--theme-card-border) 82%, transparent) !important;
        color: var(--theme-text-primary) !important;
    }

    .sweet-alert button.cancel:hover {
        background: color-mix(in srgb, var(--theme-component-headers) 64%, #ffffff 36%) !important;
    }
`;
