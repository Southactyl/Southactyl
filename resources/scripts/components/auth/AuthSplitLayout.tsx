import React from 'react';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

interface Props {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    bottom?: React.ReactNode;
}

const AuthSplitLayout = ({ title, subtitle, children, bottom }: Props) => {
    return (
        <div css={tw`min-h-screen bg-black text-white`}>
            <div css={tw`max-w-6xl mx-auto min-h-screen flex items-center px-4 sm:px-8 py-8`}>
                <div css={tw`w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
                    <aside css={tw`hidden lg:block`}>
                        <div css={tw`flex items-center gap-3`}>
                            <div css={tw`w-11 h-11 rounded-md bg-primary-500 flex items-center justify-center font-bold text-lg`}>S</div>
                            <div>
                                <p css={tw`text-xs uppercase tracking-[0.18em] text-neutral-400`}>Panel</p>
                                <p css={tw`text-4xl font-semibold tracking-tight`}>Southactyl</p>
                            </div>
                        </div>
                    </aside>

                    <section
                        css={tw`w-full max-w-xl mx-auto bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-6 sm:p-8 shadow-2xl`}
                    >
                        <FlashMessageRender css={tw`mb-4`} />
                        <h1 css={tw`text-3xl sm:text-4xl font-semibold tracking-tight`}>{title}</h1>
                        <p css={tw`mt-3 text-neutral-300 text-lg leading-relaxed`}>{subtitle}</p>
                        <div css={tw`mt-8`}>{children}</div>
                        {bottom && <div css={tw`mt-6`}>{bottom}</div>}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AuthSplitLayout;
