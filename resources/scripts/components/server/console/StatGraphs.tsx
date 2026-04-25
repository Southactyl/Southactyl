import React, { useEffect, useRef } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { Line } from 'react-chartjs-2';
import { useChart, useChartTickLabel } from '@/components/server/console/chart';
import { hexToRgba } from '@/lib/helpers';
import { bytesToString } from '@/lib/formatters';
import { CloudDownloadIcon, CloudUploadIcon } from '@heroicons/react/solid';
import { theme } from 'twin.macro';
import ChartBlock from '@/components/server/console/ChartBlock';
import Tooltip from '@/components/elements/tooltip/Tooltip';

const cssVar = (name: string, fallback: string): string => {
    if (typeof window === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
};

const mixHex = (hex: string, target: number, amount: number): string => {
    if (!/^#?[a-fA-F0-9]{6}$/.test(hex)) {
        return hex;
    }

    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const [r, g, b] = cleanHex.match(/[a-fA-F0-9]{2}/g)!.map((v) => parseInt(v, 16));
    const blend = (value: number) => Math.round(value + (target - value) * amount);

    return `#${[blend(r), blend(g), blend(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

const lightenHex = (hex: string, amount: number): string => mixHex(hex, 255, amount);
const darkenHex = (hex: string, amount: number): string => mixHex(hex, 0, amount);

export default () => {
    const status = ServerContext.useStoreState((state) => state.status.value);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const previous = useRef<Record<'tx' | 'rx', number>>({ tx: -1, rx: -1 });

    const cpu = useChartTickLabel('CPU', limits.cpu, '%', 2);
    const memory = useChartTickLabel('Memory', limits.memory, 'MiB');
    const network = useChart('Network', {
        sets: 2,
        options: {
            scales: {
                y: {
                    ticks: {
                        callback(value) {
                            return bytesToString(typeof value === 'string' ? parseInt(value, 10) : value);
                        },
                    },
                },
            },
        },
        callback(opts, index) {
            const primary = cssVar('--theme-primary-content', theme('colors.primary.500'));
            const inbound = lightenHex(primary, 0.18);
            const outbound = darkenHex(primary, 0.18);
            return {
                ...opts,
                label: !index ? 'Network In' : 'Network Out',
                borderColor: !index ? inbound : outbound,
                backgroundColor: hexToRgba(!index ? inbound : outbound, 0.26),
            };
        },
    });

    useEffect(() => {
        if (status === 'offline') {
            cpu.clear();
            memory.clear();
            network.clear();
        }
    }, [status]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        cpu.push(values.cpu_absolute);
        memory.push(Math.floor(values.memory_bytes / 1024 / 1024));
        network.push([
            previous.current.tx < 0 ? 0 : Math.max(0, values.network.tx_bytes - previous.current.tx),
            previous.current.rx < 0 ? 0 : Math.max(0, values.network.rx_bytes - previous.current.rx),
        ]);

        previous.current = { tx: values.network.tx_bytes, rx: values.network.rx_bytes };
    });

    return (
        <>
            <ChartBlock title={'CPU Load'}>
                <Line {...cpu.props} />
            </ChartBlock>
            <ChartBlock title={'Memory'}>
                <Line {...memory.props} />
            </ChartBlock>
            <ChartBlock
                title={'Network'}
                legend={
                    <>
                        <Tooltip arrow content={'Inbound'}>
                            <CloudDownloadIcon
                                className={'mr-2 w-4 h-4'}
                                style={{ color: lightenHex(cssVar('--theme-primary-content', theme('colors.primary.500')), 0.18) }}
                            />
                        </Tooltip>
                        <Tooltip arrow content={'Outbound'}>
                            <CloudUploadIcon
                                className={'w-4 h-4'}
                                style={{ color: darkenHex(cssVar('--theme-primary-content', theme('colors.primary.500')), 0.18) }}
                            />
                        </Tooltip>
                    </>
                }
            >
                <Line {...network.props} />
            </ChartBlock>
        </>
    );
};
