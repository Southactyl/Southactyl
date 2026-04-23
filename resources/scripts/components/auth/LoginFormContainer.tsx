import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    subtitle?: string;
};

const Container = styled.div`
    ${tw`w-full max-w-6xl mx-auto px-4 sm:px-8`}
    ${breakpoint('xl')`
        ${tw`px-10`}
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
    <div css={tw`min-h-screen w-full relative`}>
        <div
            css={tw`absolute inset-0 pointer-events-none`}
            style={{ background: 'var(--theme-topbar-background, #040d21)' }}
        />
        <Container>
            <div css={tw`relative z-10 min-h-screen flex flex-col justify-center py-6 sm:py-8 lg:py-10`}>
                <FlashMessageRender css={tw`mb-4`} />
                <Form {...props} ref={ref}>
                    <div
                        css={tw`w-full max-w-2xl mx-auto rounded-2xl overflow-hidden backdrop-blur px-6 py-7 sm:px-8 sm:py-8 shadow-2xl`}
                        style={{
                            background: 'rgb(var(--theme-neutral-800-rgb) / 0.94)',
                            border: '1px solid color-mix(in srgb, var(--theme-card-border) 85%, transparent)',
                        }}
                    >
                        {title && <h1 css={tw`text-3xl text-white font-semibold tracking-tight`}>{title}</h1>}
                        {subtitle && <p css={tw`mt-2 text-sm text-neutral-300`}>{subtitle}</p>}
                        <div css={tw`mt-6`}>{props.children}</div>
                    </div>
                </Form>
                <p css={tw`text-center text-neutral-400 text-xs mt-6`}>
                    Southactyl{' '}
                    {(() => {
                        const currentYear = new Date().getFullYear();
                        return currentYear > 2026 ? `2026 - ${currentYear}` : '2026';
                    })()}{' '}
                    &copy;
                </p>
            </div>
        </Container>
    </div>
));
