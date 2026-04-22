import * as React from 'react';
import tw from 'twin.macro';
import styled, { css } from 'styled-components/macro';

export type FlashMessageType = 'success' | 'info' | 'warning' | 'error';

interface Props {
    title?: string;
    children: string;
    type?: FlashMessageType;
}

const alertColor = (type?: FlashMessageType): string => {
    switch (type) {
        case 'error':
            return '#ef4444';
        case 'info':
            return 'var(--theme-primary-content)';
        case 'success':
            return '#22c55e';
        case 'warning':
            return '#f59e0b';
        default:
            return 'var(--theme-primary-content)';
    }
};

const Container = styled.div<{ $type?: FlashMessageType }>`
    ${tw`w-full text-sm`};
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 0.875rem;
    border-radius: 12px;
    border: 1px solid color-mix(in srgb, var(--theme-component-headers) 62%, #64748b 38%);
    border-left: 4px solid ${(props) => alertColor(props.$type)};
    color: rgb(var(--theme-neutral-100-rgb));
    background: color-mix(in srgb, ${(props) => alertColor(props.$type)} 14%, var(--theme-background) 86%);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;
Container.displayName = 'MessageBox.Container';

const Badge = styled.span<{ $type?: FlashMessageType }>`
    ${tw`uppercase text-[10px] font-bold leading-none tracking-wide px-2 py-1 rounded`};
    ${(props) => css`
        color: #fff;
        background: ${alertColor(props.$type)};
    `};
`;

const MessageBox = ({ title, children, type }: Props) => (
    <Container css={tw`lg:inline-flex`} $type={type} role={'alert'}>
        {title && (
            <Badge className={'title'} $type={type}>
                {title}
            </Badge>
        )}
        <span css={tw`text-left flex-auto`}>{children}</span>
    </Container>
);
MessageBox.displayName = 'MessageBox';

export default MessageBox;
