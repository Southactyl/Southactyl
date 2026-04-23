import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded no-underline text-neutral-200 items-center p-4 border transition-colors duration-150 overflow-hidden`};
    background: var(--theme-card-background);
    border-color: color-mix(in srgb, var(--theme-card-border) 82%, transparent);

    ${(props) =>
        props.$hoverable !== false &&
        `
        &:hover {
            border-color: color-mix(in srgb, var(--theme-primary-content) 38%, var(--theme-card-border) 62%);
            background: color-mix(in srgb, var(--theme-primary-content) 6%, var(--theme-card-background) 94%);
        }
    `};

    & .icon {
        ${tw`rounded-full w-16 flex items-center justify-center p-3`};
        background: color-mix(in srgb, var(--theme-background) 72%, #000 28%);
        border: 1px solid color-mix(in srgb, var(--theme-card-border) 72%, transparent);
    }
`;
