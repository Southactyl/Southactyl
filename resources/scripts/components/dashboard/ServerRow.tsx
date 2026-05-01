import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faCircle, faInfinity } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerStats } from '@/api/server/getServerResourceUsage';
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
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const defaultAllocation = server.allocations.find((allocation) => allocation.isDefault);
    const endpoint =
        server.primaryAllocationSubdomain ||
        (defaultAllocation ? `${defaultAllocation.alias || ip(defaultAllocation.ip)}:${defaultAllocation.port}` : 'No allocation');

    const cpuPercent = stats ? Math.max(0, Math.min(100, stats.cpuUsagePercent)) : 0;
    const memoryLimitBytes = server.limits.memory > 0 ? mbToBytes(server.limits.memory) : 0;
    const memoryPercent =
        stats && memoryLimitBytes > 0
            ? Math.max(0, Math.min(100, (stats.memoryUsageInBytes / memoryLimitBytes) * 100))
            : 0;

    const barTrackStyle = {
        background: 'color-mix(in srgb, var(--theme-dashboard-search-background) 66%, transparent)',
        border: '1px solid color-mix(in srgb, var(--theme-dashboard-search-border) 76%, transparent)',
    } as React.CSSProperties;

    const barFillStyle = (value: number) =>
        ({
            width: `${value}%`,
            background: 'color-mix(in srgb, var(--theme-primary-content) 72%, #ffffff 28%)',
        } as React.CSSProperties);

    const getDisplayStatus = (): string => {
        if (isSuspended) return 'Suspended';
        if (server.isTransferring) return 'Transferring';
        if (server.status === 'installing') return 'Installing';
        if (server.status === 'restoring_backup') return 'Restoring Backup';
        if (server.status === 'suspended') return 'Suspended';
        if (!stats && server.status) return 'Unavailable';
        if (!stats) return 'Loading';

        if (stats.status === 'running') return 'Running';
        if (stats.status === 'starting') return 'Starting';
        if (stats.status === 'stopping') return 'Stopping';
        return 'Offline';
    };

    const displayStatus = getDisplayStatus();

    const statusStyle: React.CSSProperties = {
        color: 'var(--theme-text-muted)',
    };

    if (displayStatus === 'Running') {
        statusStyle.color = 'var(--theme-dashboard-online-text)';
    } else if (displayStatus === 'Offline' || displayStatus === 'Suspended') {
        statusStyle.color = 'var(--theme-dashboard-offline-text)';
    } else if (displayStatus === 'Starting' || displayStatus === 'Stopping' || displayStatus === 'Installing') {
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
            <div css={tw`px-3 py-3 sm:px-4 sm:py-3`}>
                <div css={tw`flex items-center gap-3 sm:gap-4 min-h-[72px]`}>
                    <div css={tw`min-w-0 flex-[1.3]`}>
                        <div css={tw`flex items-center gap-3 min-w-0`}>
                            <div
                                css={tw`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0`}
                                style={{
                                    background:
                                        'linear-gradient(145deg, color-mix(in srgb, var(--theme-dashboard-stat-background) 90%, #01050d 10%) 0%, var(--theme-dashboard-stat-background) 100%)',
                                    border: '1px solid color-mix(in srgb, var(--theme-dashboard-stat-border) 55%, transparent)',
                                }}
                            >
                                <FontAwesomeIcon icon={faServer} />
                            </div>
                            <div css={tw`min-w-0`}>
                                <p
                                    css={tw`text-sm sm:text-base font-semibold leading-none truncate`}
                                    style={{ color: 'var(--theme-text-primary)' }}
                                >
                                    {server.name}
                                    <span
                                        css={tw`text-sm px-2 flex-shrink-0 inline-flex items-center gap-2 justify-end`}
                                        style={statusStyle}
                                    >
                                        {displayStatus}
                                    </span>
                                </p>
                                <p css={tw`mt-2 text-xs truncate`} style={{ color: 'var(--theme-text-muted)' }}>
                                    {endpoint}
                                </p>
                            </div>
                            {showGroupButton && (
                                <button
                                    type={'button'}
                                    css={tw`text-xs my-auto px-2 py-1 rounded-full hidden xl:inline-flex flex-shrink-0 items-center`}
                                    style={{
                                        background:
                                            'color-mix(in srgb, var(--theme-dashboard-search-background) 80%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--theme-dashboard-search-border) 76%, transparent)',
                                        color: 'var(--theme-text-muted)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onAddToGroup?.(server);
                                    }}
                                >
                                    + Group
                                </button>
                            )}
                        </div>
                    </div>

                    <div css={tw`flex-1 grid grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-4 items-center`}>
                        <div>
                            <div css={tw`text-xs mb-1 whitespace-nowrap`} style={{ color: 'var(--theme-text-muted)' }}>
                                {stats ? `${cpuPercent.toFixed(1)}%` : '0.0%'} /{' '}
                                {server.limits.cpu > 0 ? `${server.limits.cpu}%` : <>&infin;</>} CPU
                            </div>
                            <div css={tw`h-1.5 rounded-full overflow-hidden`} style={barTrackStyle}>
                                <div css={tw`h-full rounded-full`} style={barFillStyle(cpuPercent)} />
                            </div>
                        </div>
                        <div>
                            <div css={tw`text-xs mb-1 whitespace-nowrap`} style={{ color: 'var(--theme-text-muted)' }}>
                                {stats ? `${Math.round(stats.memoryUsageInBytes / 1024 / 1024)} MB` : '0 MB'} /{' '}
                                {server.limits.memory > 0 ? `${server.limits.memory} MB` : <>&infin;</>} RAM
                            </div>
                            <div css={tw`h-1.5 rounded-full overflow-hidden`} style={barTrackStyle}>
                                <div css={tw`h-full rounded-full`} style={barFillStyle(memoryPercent)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GreyRowBox>
    );
};
