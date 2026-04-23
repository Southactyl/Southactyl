import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div
        css={tw`rounded shadow-md`}
        className={className}
        style={{
            background: 'var(--theme-card-background)',
            border: '1px solid color-mix(in srgb, var(--theme-card-border) 82%, transparent)',
        }}
    >
        <div
            css={tw`rounded-t p-3`}
            style={{
                background: 'color-mix(in srgb, var(--theme-component-headers) 82%, transparent)',
                borderBottom: '1px solid color-mix(in srgb, var(--theme-card-border) 82%, transparent)',
            }}
        >
            {typeof title === 'string' ? (
                <p css={tw`text-sm uppercase`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-neutral-300`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`p-3`}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
