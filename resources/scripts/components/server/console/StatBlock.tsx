import React from 'react';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './style.module.css';
import useFitText from 'use-fit-text';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

const tintMap: Record<string, { background: string; bar: string }> = {
    'bg-green-500': {
        background: 'color-mix(in srgb, var(--theme-success) 12%, var(--theme-card-background) 88%)',
        bar: 'var(--theme-success)',
    },
    'bg-yellow-500': {
        background: 'color-mix(in srgb, var(--theme-warning) 12%, var(--theme-card-background) 88%)',
        bar: 'var(--theme-warning)',
    },
    'bg-red-500': {
        background: 'color-mix(in srgb, var(--theme-danger) 12%, var(--theme-card-background) 88%)',
        bar: 'var(--theme-danger)',
    },
};

export default ({ title, copyOnClick, icon, color, className, children }: StatBlockProps) => {
    const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 500 });
    const tint = color ? tintMap[color] : undefined;

    return (
        <CopyOnClick text={copyOnClick}>
            <div className={classNames(styles.stat_block, className)} style={tint ? { background: tint.background } : undefined}>
                <div className={styles.status_bar} style={tint ? { background: tint.bar } : undefined} />
                <div className={styles.icon}>
                    <Icon
                        icon={icon}
                        className={classNames({
                            'text-gray-100': !color || color === 'bg-gray-700',
                            'text-gray-50': color && color !== 'bg-gray-700',
                        })}
                    />
                </div>
                <div className={'flex flex-col justify-center overflow-hidden w-full'}>
                    <p className={'font-header font-medium leading-tight text-xs md:text-sm text-gray-200'}>{title}</p>
                    <div
                        ref={ref}
                        className={'h-[1.75rem] w-full font-semibold text-gray-50 truncate'}
                        style={{ fontSize }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </CopyOnClick>
    );
};
