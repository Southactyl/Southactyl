export interface ThemeCoreColors {
    primary_content: string;
    secondary_content: string;
    background_color: string;
    component_headers: string;
    sidebar_navigation: string;
}

type RGB = [number, number, number];

const clamp = (value: number): number => Math.max(0, Math.min(255, Math.round(value)));

const hexToRgb = (hex: string): RGB => {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) {
        return [59, 130, 246];
    }

    return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
    ];
};

const mix = (a: RGB, b: RGB, ratio: number): RGB => {
    const t = Math.max(0, Math.min(1, ratio));

    return [
        clamp(a[0] * (1 - t) + b[0] * t),
        clamp(a[1] * (1 - t) + b[1] * t),
        clamp(a[2] * (1 - t) + b[2] * t),
    ];
};

const toTriplet = (rgb: RGB): string => `${rgb[0]} ${rgb[1]} ${rgb[2]}`;

const neutralScale = (theme: ThemeCoreColors): Record<string, string> => {
    const background = hexToRgb(theme.background_color);
    const component = hexToRgb(theme.component_headers);
    const secondary = hexToRgb(theme.secondary_content);
    const white: RGB = [255, 255, 255];
    const black: RGB = [0, 0, 0];

    const lightAnchor = mix(secondary, white, 0.86);
    const midAnchor = mix(component, secondary, 0.42);
    const darkAnchor = mix(background, black, 0.34);

    return {
        50: toTriplet(lightAnchor),
        100: toTriplet(mix(lightAnchor, secondary, 0.12)),
        200: toTriplet(mix(lightAnchor, midAnchor, 0.24)),
        300: toTriplet(mix(lightAnchor, midAnchor, 0.45)),
        400: toTriplet(mix(lightAnchor, midAnchor, 0.66)),
        500: toTriplet(midAnchor),
        600: toTriplet(mix(midAnchor, darkAnchor, 0.3)),
        700: toTriplet(mix(midAnchor, darkAnchor, 0.5)),
        800: toTriplet(mix(midAnchor, darkAnchor, 0.7)),
        900: toTriplet(darkAnchor),
        950: toTriplet(mix(darkAnchor, black, 0.36)),
    };
};

const primaryScale = (theme: ThemeCoreColors): Record<string, string> => {
    const primary = hexToRgb(theme.primary_content);
    const white: RGB = [255, 255, 255];
    const black: RGB = [0, 0, 0];

    return {
        50: toTriplet(mix(primary, white, 0.92)),
        100: toTriplet(mix(primary, white, 0.84)),
        200: toTriplet(mix(primary, white, 0.68)),
        300: toTriplet(mix(primary, white, 0.48)),
        400: toTriplet(mix(primary, white, 0.26)),
        500: toTriplet(primary),
        600: toTriplet(mix(primary, black, 0.12)),
        700: toTriplet(mix(primary, black, 0.22)),
        800: toTriplet(mix(primary, black, 0.34)),
        900: toTriplet(mix(primary, black, 0.5)),
        950: toTriplet(mix(primary, black, 0.64)),
    };
};

export const applyThemePaletteVariables = (theme: ThemeCoreColors): void => {
    const root = document.documentElement;
    const primary = primaryScale(theme);
    const neutral = neutralScale(theme);

    Object.entries(primary).forEach(([shade, rgb]) => {
        root.style.setProperty(`--theme-primary-${shade}-rgb`, rgb);
    });

    Object.entries(neutral).forEach(([shade, rgb]) => {
        root.style.setProperty(`--theme-neutral-${shade}-rgb`, rgb);
    });
};
