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
    <div css={tw`min-h-screen w-full bg-neutral-900 relative overflow-hidden`}>
        <div css={tw`absolute inset-0 opacity-40 pointer-events-none`}>
            <div css={tw`absolute top-0 -left-16 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-cyan-700 rounded-full blur-3xl`} />
            <div css={tw`absolute top-[45%] -right-24 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-700 rounded-full blur-3xl`} />
            <div css={tw`absolute -bottom-28 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-green-700 rounded-full blur-3xl`} />
        </div>
        <Container>
            <div css={tw`relative z-10 min-h-screen flex flex-col justify-center py-6 sm:py-8 lg:py-10`}>
                <FlashMessageRender css={tw`mb-4 px-1`} />
                <Form {...props} ref={ref}>
                    <div css={tw`grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl`}>
                        <div css={tw`bg-neutral-800/80 backdrop-blur px-6 py-10 sm:px-10 lg:px-12 flex flex-col justify-between`}>
                            <div>
                                <p css={tw`uppercase tracking-[0.18em] text-xs text-cyan-400 font-semibold`}>Southactyl Panel</p>
                                <h2 css={tw`mt-4 text-3xl sm:text-4xl leading-tight text-white font-semibold`}>
                                    Control your infrastructure with precision.
                                </h2>
                                <p css={tw`mt-5 text-sm text-neutral-300 leading-relaxed`}>
                                    One dashboard for servers, users, nodes, and deployments. Built for fast operations and
                                    clear visibility.
                                </p>
                            </div>
                            <div css={tw`mt-8`}>
                                <img src={'/assets/svgs/pterodactyl.svg'} css={tw`block w-32 opacity-90`} />
                            </div>
                        </div>
                        <div css={tw`bg-white/95 px-6 py-8 sm:px-10 sm:py-10`}>
                            {title && <h1 css={tw`text-3xl text-neutral-900 font-semibold tracking-tight`}>{title}</h1>}
                            {subtitle && <p css={tw`mt-2 text-sm text-neutral-600`}>{subtitle}</p>}
                            <div css={tw`mt-6`}>{props.children}</div>
                        </div>
                    </div>
                </Form>
                <p css={tw`text-center text-neutral-400 text-xs mt-6`}>
                    {(() => {
                        const currentYear = new Date().getFullYear();
                        return currentYear > 2026 ? `2026 - ${currentYear}` : '2026';
                    })()}{' '}
                    &copy; Southactyl Panel&reg;
                </p>
            </div>
        </Container>
    </div>
));
