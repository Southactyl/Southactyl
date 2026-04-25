import React from 'react';
import { Link } from 'react-router-dom';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import { useActivityLogs } from '@/api/account/activity';
import ActivityLogEntry from '@/components/elements/activity/ActivityLogEntry';
import Spinner from '@/components/elements/Spinner';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import tw from 'twin.macro';

export default () => {
    const { data, isValidating } = useActivityLogs(
        { page: 1, sorts: { timestamp: -1 } },
        {
            revalidateOnMount: true,
            revalidateOnFocus: false,
        }
    );

    return (
        <aside
            css={tw`w-full`}
            style={{
                background: 'var(--theme-card-background)',
                border: '1px solid color-mix(in srgb, var(--theme-card-border) 82%, transparent)',
                borderRadius: '12px',
            }}
        >
            <div
                css={tw`px-4 py-3 flex items-center justify-between`}
                style={{
                    borderBottom: '1px solid color-mix(in srgb, var(--theme-card-border) 72%, transparent)',
                }}
            >
                <h2 css={tw`text-sm uppercase tracking-wide font-semibold`}>Activity Logs</h2>
                <Link to={'/account/activity'} css={tw`text-xs font-medium`}>
                    View all
                </Link>
            </div>

            {!data && isValidating ? (
                <div css={tw`py-8`}>
                    <Spinner centered />
                </div>
            ) : data && data.items.length > 0 ? (
                <div css={tw`max-h-[50rem] overflow-y-auto`}>
                    {data.items.slice(0, 10).map((activity) => (
                        <ActivityLogEntry key={activity.id} activity={activity} hashBasePath={'/account/activity'}>
                            {typeof activity.properties.useragent === 'string' && (
                                <Tooltip content={activity.properties.useragent} placement={'top'}>
                                    <span>
                                        <DesktopComputerIcon />
                                    </span>
                                </Tooltip>
                            )}
                        </ActivityLogEntry>
                    ))}
                </div>
            ) : (
                <p css={tw`p-4 text-sm text-neutral-400`}>No activity logs yet.</p>
            )}
        </aside>
    );
};
