import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey';
    isSecondary?: boolean;
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-block rounded p-2 uppercase tracking-wide text-sm transition-all duration-150 border`};
    background: var(--btn-bg, var(--theme-primary-content));
    border-color: var(--btn-border, color-mix(in srgb, var(--theme-primary-content) 84%, #000000 16%));
    color: var(--btn-text, #f8fbff);

    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            --btn-bg: var(--theme-primary-content);
            --btn-border: color-mix(in srgb, var(--theme-primary-content) 84%, #000000 16%);
            --btn-text: #f8fbff;

            &:hover:not(:disabled) {
                --btn-bg: color-mix(in srgb, var(--theme-primary-content) 88%, #000000 12%);
                --btn-border: color-mix(in srgb, var(--theme-primary-content) 72%, #000000 28%);
            }
        `};

    ${(props) =>
        props.color === 'grey' &&
        css`
            --btn-bg: color-mix(in srgb, var(--theme-component-headers) 76%, #ffffff 24%);
            --btn-border: color-mix(in srgb, var(--theme-card-border) 82%, #ffffff 18%);
            --btn-text: var(--theme-text-primary);

            &:hover:not(:disabled) {
                --btn-bg: color-mix(in srgb, var(--theme-component-headers) 88%, #ffffff 12%);
                --btn-border: color-mix(in srgb, var(--theme-card-border) 70%, #ffffff 30%);
            }
        `};

    ${(props) =>
        props.color === 'green' &&
        css<Props>`
            --btn-bg: var(--theme-success);
            --btn-border: color-mix(in srgb, var(--theme-success) 82%, #000000 18%);
            --btn-text: #ecfff3;

            &:hover:not(:disabled) {
                --btn-bg: color-mix(in srgb, var(--theme-success) 86%, #000000 14%);
                --btn-border: color-mix(in srgb, var(--theme-success) 68%, #000000 32%);
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        --btn-bg: color-mix(in srgb, var(--theme-success) 86%, #000000 14%);
                        --btn-border: color-mix(in srgb, var(--theme-success) 68%, #000000 32%);
                    }
                `};
        `};

    ${(props) =>
        props.color === 'red' &&
        css<Props>`
            --btn-bg: var(--theme-danger);
            --btn-border: color-mix(in srgb, var(--theme-danger) 82%, #000000 18%);
            --btn-text: #fff0f0;

            &:hover:not(:disabled) {
                --btn-bg: color-mix(in srgb, var(--theme-danger) 86%, #000000 14%);
                --btn-border: color-mix(in srgb, var(--theme-danger) 68%, #000000 32%);
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        --btn-bg: color-mix(in srgb, var(--theme-danger) 86%, #000000 14%);
                        --btn-border: color-mix(in srgb, var(--theme-danger) 68%, #000000 32%);
                    }
                `};
        `};

    ${(props) => props.size === 'xsmall' && tw`px-2 py-1 text-xs`};
    ${(props) => (!props.size || props.size === 'small') && tw`px-4 py-2`};
    ${(props) => props.size === 'large' && tw`p-4 text-sm`};
    ${(props) => props.size === 'xlarge' && tw`p-4 w-full`};

    ${(props) =>
        props.isSecondary &&
        css<Props>`
            --btn-bg: transparent;
            --btn-border: color-mix(in srgb, var(--theme-input-border) 86%, #ffffff 14%);
            --btn-text: var(--theme-text-primary);

            &:hover:not(:disabled) {
                --btn-bg: color-mix(in srgb, var(--theme-component-headers) 64%, transparent);
                --btn-border: color-mix(in srgb, var(--theme-input-border) 72%, #ffffff 28%);
                --btn-text: #f8fbff;
                ${(props) => props.color === 'red' && css`--btn-bg: var(--theme-danger); --btn-border: color-mix(in srgb, var(--theme-danger) 82%, #000000 18%); --btn-text: #fff0f0;`};
                ${(props) => props.color === 'primary' && css`--btn-bg: var(--theme-primary-content); --btn-border: color-mix(in srgb, var(--theme-primary-content) 84%, #000000 16%); --btn-text: #f8fbff;`};
                ${(props) => props.color === 'green' && css`--btn-bg: var(--theme-success); --btn-border: color-mix(in srgb, var(--theme-success) 82%, #000000 18%); --btn-text: #ecfff3;`};
            }
        `};

    &:disabled {
        opacity: 0.55;
        cursor: default;
    }
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading && (
            <div css={tw`flex absolute justify-center items-center w-full h-full left-0 top-0`}>
                <Spinner size={'small'} />
            </div>
        )}
        <span css={isLoading ? tw`text-transparent` : undefined}>{children}</span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = (props) => <ButtonStyle as={'a'} {...props} />;

export { LinkButton, ButtonStyle };
export default Button;
