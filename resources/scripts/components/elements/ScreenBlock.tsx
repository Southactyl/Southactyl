import React from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components/macro';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import NotFoundSvg from '@/assets/images/not_found.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';

interface BaseProps {
    title: string;
    image?: string;
    message: string;
    fullWidth?: boolean;
    onRetry?: () => void;
    onBack?: () => void;
}

interface PropsWithRetry extends BaseProps {
    onRetry?: () => void;
    onBack?: never;
}

interface PropsWithBack extends BaseProps {
    onBack?: () => void;
    onRetry?: never;
}

export type ScreenBlockProps = PropsWithBack | PropsWithRetry;

const spin = keyframes`
    to { transform: rotate(360deg) }
`;

const ActionButton = styled(Button)`
    ${tw`rounded-full w-8 h-8 flex items-center justify-center p-0`};

    &.hover\\:spin:hover {
        animation: ${spin} 2s linear infinite;
    }
`;

const ScreenCard = ({ title, image, message, onBack, onRetry, fullWidth }: ScreenBlockProps) => (
    <div
        css={[tw`p-8 md:p-12 rounded-lg text-center relative`, fullWidth ? tw`w-full` : tw`w-full sm:w-3/4 md:w-1/2`]}
        style={{
            background: 'color-mix(in srgb, var(--theme-component-headers) 68%, transparent)',
            border: '1px solid color-mix(in srgb, var(--theme-card-border) 76%, transparent)',
            boxShadow: '0 14px 30px color-mix(in srgb, #000 28%, transparent)',
        }}
    >
        {(typeof onBack === 'function' || typeof onRetry === 'function') && (
            <div css={tw`absolute left-0 top-0 ml-4 mt-4`}>
                <ActionButton
                    onClick={() => (onRetry ? onRetry() : onBack ? onBack() : null)}
                    className={onRetry ? 'hover:spin' : undefined}
                >
                    <FontAwesomeIcon icon={onRetry ? faSyncAlt : faArrowLeft} />
                </ActionButton>
            </div>
        )}
        <img src={image || NotFoundSvg} css={tw`w-2/3 h-auto select-none mx-auto`} />
        <h2 css={tw`mt-8 font-bold text-4xl`} style={{ color: 'var(--theme-text-primary)' }}>
            {title}
        </h2>
        <p css={tw`text-sm mt-2`} style={{ color: 'var(--theme-text-muted)' }}>
            {message}
        </p>
    </div>
);

export const InlineScreenBlock = ({ title, image, message, onBack, onRetry, fullWidth }: ScreenBlockProps) => (
    <div css={fullWidth ? tw`block` : tw`flex justify-center`}>
        <ScreenCard title={title} image={image} message={message} onBack={onBack} onRetry={onRetry} fullWidth={fullWidth} />
    </div>
);

const ScreenBlock = ({ title, image, message, onBack, onRetry }: ScreenBlockProps) => (
    <PageContentBlock>
        <InlineScreenBlock title={title} image={image} message={message} onBack={onBack} onRetry={onRetry} />
    </PageContentBlock>
);

type ServerErrorProps = (Omit<PropsWithBack, 'image' | 'title'> | Omit<PropsWithRetry, 'image' | 'title'>) & {
    title?: string;
};

const ServerError = ({ title, ...props }: ServerErrorProps) => (
    <ScreenBlock title={title || 'Something went wrong'} image={ServerErrorSvg} {...props} />
);

const NotFound = ({ title, message, onBack }: Partial<Pick<ScreenBlockProps, 'title' | 'message' | 'onBack'>>) => (
    <ScreenBlock
        title={title || '404'}
        image={NotFoundSvg}
        message={message || 'The requested resource was not found.'}
        onBack={onBack}
    />
);

export { ServerError, NotFound };
export default ScreenBlock;
