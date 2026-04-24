import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faMemory, faMicrochip, faServer, faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';

type Timer = ReturnType<typeof setInterval>;

export default ({
    server,
    className,
    onAddToGroup,
    showGroupButton = true,
}: {
    server: Server;
    className?: string;
    onAddToGroup?: (server: Server) => void;
    showGroupButton?: boolean;
}) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        // Don't waste a HTTP request if there is nothing important to show to the user because
        // the server is suspended.
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const defaultAllocation = server.allocations.find((allocation) => allocation.isDefault);
    const endpoint = defaultAllocation
        ? `${defaultAllocation.alias || ip(defaultAllocation.ip)}:${defaultAllocation.port}`
        : 'No allocation';
    const shortId = server.uuid.slice(0, 8);
    const renewsIn = server.container?.installed ? 'Active' : 'Pending Install';

    const cpuPercent = stats ? Math.max(0, Math.min(100, stats.cpuUsagePercent)) : 0;
    const memoryLimitBytes = server.limits.memory > 0 ? mbToBytes(server.limits.memory) : 0;
    const memoryPercent =
        stats && memoryLimitBytes > 0 ? Math.max(0, Math.min(100, (stats.memoryUsageInBytes / memoryLimitBytes) * 100)) : 0;

    const barTrackStyle = {
        background: 'color-mix(in srgb, var(--theme-input-border) 35%, transparent)',
        border: '1px solid color-mix(in srgb, var(--theme-card-border) 78%, transparent)',
    } as React.CSSProperties;

    const barFillStyle = (value: number) =>
        ({
            width: `${value}%`,
            background: 'color-mix(in srgb, var(--theme-primary-content) 72%, #ffffff 28%)',
        }) as React.CSSProperties;

    const getDisplayStatus = (): string => {
        if (isSuspended) return 'Suspended';
        if (server.isTransferring) return 'Transferring';
        if (server.status === 'installing') return 'Installing';
        if (server.status === 'restoring_backup') return 'Restoring Backup';
        if (server.status === 'suspended') return 'Suspended';
        if (!stats && server.status) return 'Unavailable';
        if (!stats) return 'Loading';

        if (stats.status === 'running') return 'Online';
        if (stats.status === 'starting') return 'Starting';
        if (stats.status === 'stopping') return 'Stopping';
        return 'Offline';
    };

    const displayStatus = getDisplayStatus();

    const statusStyle: React.CSSProperties = {
        background: 'color-mix(in srgb, var(--theme-component-headers) 78%, transparent)',
        border: '1px solid color-mix(in srgb, var(--theme-card-border) 78%, transparent)',
        color: 'var(--theme-text-muted)',
    };

    if (displayStatus === 'Online') {
        statusStyle.background = 'color-mix(in srgb, var(--theme-success) 22%, transparent)';
        statusStyle.border = '1px solid color-mix(in srgb, var(--theme-success) 52%, transparent)';
        statusStyle.color = 'var(--theme-text-primary)';
    } else if (displayStatus === 'Offline' || displayStatus === 'Suspended') {
        statusStyle.background = 'color-mix(in srgb, var(--theme-danger) 18%, transparent)';
        statusStyle.border = '1px solid color-mix(in srgb, var(--theme-danger) 52%, transparent)';
        statusStyle.color = 'var(--theme-text-primary)';
    } else if (displayStatus === 'Starting' || displayStatus === 'Stopping' || displayStatus === 'Installing') {
        statusStyle.background = 'color-mix(in srgb, var(--theme-warning) 20%, transparent)';
        statusStyle.border = '1px solid color-mix(in srgb, var(--theme-warning) 52%, transparent)';
        statusStyle.color = 'var(--theme-text-primary)';
    }

    return (
        <GreyRowBox
            as={Link}
            to={`/server/${server.id}`}
            className={className}
            css={tw`block w-full p-0 overflow-hidden`}
            $hoverable
        >
            <div css={tw`p-3 sm:p-4`}>
                <div css={tw`flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-6`}>
                    <div css={tw`min-w-0 flex-1`}>
                        <div css={tw`flex items-center gap-3 min-w-0`}>
                            <div
                                css={tw`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0`}
                                style={{
                                    background: 'color-mix(in srgb, var(--theme-primary-content) 16%, transparent)',
                                    border: '1px solid color-mix(in srgb, var(--theme-danger) 45%, transparent)',
                                }}
                            >
                                <FontAwesomeIcon icon={faServer} />
                            </div>
                            <p css={tw`text-lg leading-none truncate`}>{server.name}</p>
                            <span css={tw`text-xs px-2 py-1 rounded-full flex-shrink-0`} style={statusStyle}>
                                {displayStatus}
                            </span>
                            {showGroupButton && (
                                <button
                                    type={'button'}
                                    css={tw`text-xs my-auto px-2 py-1 rounded-full hidden sm:inline-flex flex-shrink-0 items-center`}
                                    style={{
                                        background: 'color-mix(in srgb, var(--theme-background) 76%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--theme-card-border) 78%, transparent)',
                                        color: 'var(--theme-text-muted)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onAddToGroup?.(server);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} css={tw`mr-1`} /> Group
                                </button>
                            )}
                        </div>
                        <div css={tw`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500`}>
                            <span css={tw`inline-flex items-center gap-1 min-w-0`}>
                                <FontAwesomeIcon icon={faEthernet} />
                                <span css={tw`truncate`}>{endpoint}</span>
                            </span>
                            <span css={tw`inline-flex items-center gap-1`}>
                                <FontAwesomeIcon icon={faClock} />
                                Renews in {renewsIn}
                            </span>
                            <span css={tw`inline-flex items-center gap-1`}>
                                <FontAwesomeIcon icon={faServer} />
                                {shortId}...
                            </span>
                        </div>
                    </div>

                    <div
                        css={tw`w-full xl:w-auto rounded-md p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3`}
                        style={{
                            background: 'color-mix(in srgb, var(--theme-background) 78%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--theme-card-border) 76%, transparent)',
                        }}
                    >
                        <div css={tw`sm:w-60`}>
                            <div css={tw`flex items-center justify-between text-xs mb-2`}>
                                <span css={tw`inline-flex items-center gap-1 text-neutral-400 uppercase tracking-wide`}>
                                    <FontAwesomeIcon icon={faMicrochip} />
                                    CPU
                                </span>
                                <span css={tw`text-neutral-300`}>{stats ? `${cpuPercent.toFixed(0)}%` : '0%'}</span>
                            </div>
                            <div css={tw`h-2 rounded-full overflow-hidden`} style={barTrackStyle}>
                                <div css={tw`h-full rounded-full`} style={barFillStyle(cpuPercent)} />
                            </div>
                        </div>

                        <div css={tw`sm:w-60`}>
                            <div css={tw`flex items-center justify-between text-xs mb-2`}>
                                <span css={tw`inline-flex items-center gap-1 text-neutral-400 uppercase tracking-wide`}>
                                    <FontAwesomeIcon icon={faMemory} />
                                    Memory
                                </span>
                                <span css={tw`text-neutral-300`}>{stats ? `${memoryPercent.toFixed(0)}%` : '0%'}</span>
                            </div>
                            <div css={tw`h-2 rounded-full overflow-hidden`} style={barTrackStyle}>
                                <div css={tw`h-full rounded-full`} style={barFillStyle(memoryPercent)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GreyRowBox>
    );
};
