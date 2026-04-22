const colors = require('tailwindcss/colors');

const withOpacity = (cssVariable) => `rgb(var(${cssVariable}) / <alpha-value>)`;

const dynamicScale = (prefix) => ({
    50: withOpacity(`--theme-${prefix}-50-rgb`),
    100: withOpacity(`--theme-${prefix}-100-rgb`),
    200: withOpacity(`--theme-${prefix}-200-rgb`),
    300: withOpacity(`--theme-${prefix}-300-rgb`),
    400: withOpacity(`--theme-${prefix}-400-rgb`),
    500: withOpacity(`--theme-${prefix}-500-rgb`),
    600: withOpacity(`--theme-${prefix}-600-rgb`),
    700: withOpacity(`--theme-${prefix}-700-rgb`),
    800: withOpacity(`--theme-${prefix}-800-rgb`),
    900: withOpacity(`--theme-${prefix}-900-rgb`),
    950: withOpacity(`--theme-${prefix}-950-rgb`),
});

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#131a20',
                primary: dynamicScale('primary'),
                blue: dynamicScale('primary'),
                gray: dynamicScale('neutral'),
                neutral: dynamicScale('neutral'),
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
