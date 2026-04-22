import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { randomInt } from '@/helpers';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';

const BarTrack = styled.div`
    ${tw`w-full fixed top-0 left-0 overflow-hidden pointer-events-none`};
    height: 3px;
    z-index: 9998;
    background: color-mix(in srgb, var(--theme-component-headers) 72%, transparent);
`;

const BarFill = styled.div`
    ${tw`h-full`};
    transition: 250ms ease-in-out;
    background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--theme-primary-content) 72%, #ffffff 28%) 0%,
        var(--theme-primary-content) 52%,
        color-mix(in srgb, var(--theme-primary-content) 86%, #0f172a 14%) 100%
    );
    box-shadow: 0 0 12px color-mix(in srgb, var(--theme-primary-content) 48%, transparent);
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
`;

type Timer = ReturnType<typeof setTimeout>;

export default () => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const timeout = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [visible, setVisible] = useState(false);
    const progress = useStoreState((state) => state.progress.progress);
    const continuous = useStoreState((state) => state.progress.continuous);
    const setProgress = useStoreActions((actions) => actions.progress.setProgress);

    useEffect(() => {
        return () => {
            timeout.current && clearTimeout(timeout.current);
            interval.current && clearInterval(interval.current);
        };
    }, []);

    useEffect(() => {
        setVisible((progress || 0) > 0);

        if (progress === 100) {
            timeout.current = setTimeout(() => setProgress(undefined), 500);
        }
    }, [progress]);

    useEffect(() => {
        if (!continuous) {
            interval.current && clearInterval(interval.current);
            return;
        }

        if (!progress || progress === 0) {
            setProgress(randomInt(20, 30));
        }
    }, [continuous]);

    useEffect(() => {
        if (continuous) {
            interval.current && clearInterval(interval.current);
            if ((progress || 0) >= 90) {
                setProgress(90);
            } else {
                interval.current = setTimeout(() => setProgress((progress || 0) + randomInt(1, 5)), 500);
            }
        }
    }, [progress, continuous]);

    return (
        <BarTrack>
            <CSSTransition timeout={150} appear in={visible} unmountOnExit classNames={'fade'}>
                <BarFill style={{ width: progress === undefined ? '100%' : `${progress}%` }} />
            </CSSTransition>
        </BarTrack>
    );
};
