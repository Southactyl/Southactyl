import React, { Suspense } from 'react';
import styled, { css, keyframes } from 'styled-components/macro';
import tw from 'twin.macro';
import ErrorBoundary from '@/components/elements/ErrorBoundary';

export type SpinnerSize = 'small' | 'base' | 'large';

interface Props {
    size?: SpinnerSize;
    centered?: boolean;
    isBlue?: boolean;
}

interface Spinner extends React.FC<Props> {
    Size: Record<'SMALL' | 'BASE' | 'LARGE', SpinnerSize>;
    Suspense: React.FC<Props>;
}

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

// noinspection CssOverwrittenProperties
const SpinnerComponent = styled.div<Props>`
    ${tw`w-8 h-8`};
    position: relative;
    border-width: 3px;
    border-radius: 50%;
    animation: ${spin} 0.9s linear infinite;

    ${(props) =>
        props.size === 'small'
            ? tw`w-4 h-4 border-2`
            : props.size === 'large'
            ? css`
                  ${tw`w-16 h-16`};
                  border-width: 6px;
              `
            : null};

    border-color: ${(props) =>
        !props.isBlue
            ? 'color-mix(in srgb, var(--theme-card-border, #223a63) 72%, transparent)'
            : 'hsla(212, 92%, 43%, 0.2)'};
    border-top-color: ${(props) => (!props.isBlue ? 'var(--theme-primary-content, #6b5bff)' : 'hsl(212, 92%, 43%)')};
    border-right-color: ${(props) =>
        !props.isBlue
            ? 'color-mix(in srgb, var(--theme-primary-content, #6b5bff) 30%, transparent)'
            : 'hsla(212, 92%, 43%, 0.35)'};
    box-shadow:
        0 0 0 1px color-mix(in srgb, var(--theme-card-border, #223a63) 35%, transparent),
        0 0 14px
            ${(props) =>
                !props.isBlue
                    ? 'color-mix(in srgb, var(--theme-primary-content, #6b5bff) 34%, transparent)'
                    : 'hsla(212, 92%, 43%, 0.34)'};
`;

const Spinner: Spinner = ({ centered, ...props }) =>
    centered ? (
        <div css={[tw`flex justify-center items-center`, props.size === 'large' ? tw`m-20` : tw`m-6`]}>
            <SpinnerComponent {...props} />
        </div>
    ) : (
        <SpinnerComponent {...props} />
    );
Spinner.displayName = 'Spinner';

Spinner.Size = {
    SMALL: 'small',
    BASE: 'base',
    LARGE: 'large',
};

Spinner.Suspense = ({ children, centered = true, size = Spinner.Size.LARGE, ...props }) => (
    <Suspense fallback={<Spinner centered={centered} size={size} {...props} />}>
        <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
);
Spinner.Suspense.displayName = 'Spinner.Suspense';

export default Spinner;
