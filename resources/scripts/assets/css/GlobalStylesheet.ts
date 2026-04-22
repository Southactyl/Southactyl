import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import font from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export default createGlobalStyle`
    :root {
        --theme-primary-content: #3b82f6;
        --theme-secondary-content: #94a3b8;
        --theme-background: #070b13;
        --theme-component-headers: #0f1622;
        --theme-sidebar: #05080f;
        --theme-success: #22c55e;
        --theme-warning: #f59e0b;
        --theme-danger: #ef4444;
        --theme-info: #0ea5e9;
        --theme-text-primary: #f8fafc;
        --theme-text-muted: #94a3b8;
        --theme-link: #60a5fa;
        --theme-link-hover: #93c5fd;
        --theme-card-background: #162130;
        --theme-card-border: #334155;
        --theme-input-background: #1a2636;
        --theme-input-border: #475569;
        --theme-topbar-background: #05080f;
        --theme-topbar-text: #cbd5e1;
        --theme-footer-background: #05080f;
        --theme-footer-text: #cbd5e1;
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

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: none;
        width: 16px;
        height: 16px;
    }

    ::-webkit-scrollbar-thumb {
        border: solid 0 rgb(0 0 0 / 0%);
        border-right-width: 4px;
        border-left-width: 4px;
        -webkit-border-radius: 9px 4px;
        -webkit-box-shadow: inset 0 0 0 1px hsl(211, 10%, 53%), inset 0 0 0 4px hsl(209deg 18% 30%);
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        border-right-width: 0;
        border-left-width: 0;
        border-top-width: 4px;
        border-bottom-width: 4px;
        -webkit-border-radius: 4px 9px;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
