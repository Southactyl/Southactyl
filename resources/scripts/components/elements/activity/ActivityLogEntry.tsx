import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Translate from '@/components/elements/Translate';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ActivityLog } from '@definitions/user';
import ActivityLogMetaButton from '@/components/elements/activity/ActivityLogMetaButton';
import { FolderOpenIcon, TerminalIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import style from './style.module.css';
import Avatar from '@/components/Avatar';
import useLocationHash from '@/plugins/useLocationHash';
import { getObjectKeys, isObject } from '@/lib/objects';

interface Props {
    activity: ActivityLog;
    children?: React.ReactNode;
    hashBasePath?: string;
}

function wrapProperties(value: unknown): any {
    if (value === null || typeof value === 'string' || typeof value === 'number') {
        return `<strong>${String(value)}</strong>`;
    }

    if (isObject(value)) {
        return getObjectKeys(value).reduce((obj, key) => {
            if (key === 'count' || (typeof key === 'string' && key.endsWith('_count'))) {
                return { ...obj, [key]: value[key] };
            }
            return { ...obj, [key]: wrapProperties(value[key]) };
        }, {} as Record<string, unknown>);
    }

    if (Array.isArray(value)) {
        return value.map(wrapProperties);
    }

    return value;
}

export default ({ activity, children, hashBasePath }: Props) => {
    const { pathTo } = useLocationHash();
    const actor = activity.relationships.actor;
    const properties = wrapProperties(activity.properties);

    const eventHash = `#${pathTo({ event: activity.event })}`;
    const eventLink = hashBasePath ? `${hashBasePath}${eventHash}` : eventHash;

    return (
        <div className={classNames('py-4 last:rounded-b last:border-0 group', style.activityRow, style.activityEntry)}>
            <div className={style.activityMain}>
                <div className={classNames(style.actorAvatarWrap, 'select-none')}>
                    <div className={classNames('flex items-center w-10 h-10 rounded-full overflow-hidden', style.actorAvatar)}>
                        <Avatar name={actor?.uuid || 'system'} />
                    </div>
                </div>
                <div className={style.activityBody}>
                    <div className={classNames(style.actorText, style.actorRow)}>
                        <Tooltip placement={'top'} content={actor?.email || 'System User'}>
                            <span className={style.actorName}>{actor?.username || 'System'}</span>
                        </Tooltip>
                        <span className={style.separator}>&mdash;</span>
                        <Link
                            to={eventLink}
                            className={style.activityLink}
                        >
                            {activity.event}
                        </Link>
                        <div className={style.icons}>
                            {activity.isApi && (
                                <Tooltip placement={'top'} content={'Using API Key'}>
                                    <TerminalIcon />
                                </Tooltip>
                            )}
                            {activity.event.startsWith('server:sftp.') && (
                                <Tooltip placement={'top'} content={'Using SFTP'}>
                                    <FolderOpenIcon />
                                </Tooltip>
                            )}
                            {children}
                        </div>
                    </div>
                    <p className={style.description}>
                        <Translate ns={'activity'} values={properties} i18nKey={activity.event.replace(':', '.')} />
                    </p>
                    <div className={classNames('mt-1 text-sm', style.activityMeta)}>
                        {activity.ip && (
                            <span>
                                {activity.ip}
                                <span className={style.separator}>&nbsp;|&nbsp;</span>
                            </span>
                        )}
                        <Tooltip placement={'right'} content={format(activity.timestamp, 'MMM do, yyyy H:mm:ss')}>
                            <span>{formatDistanceToNowStrict(activity.timestamp, { addSuffix: true })}</span>
                        </Tooltip>
                    </div>
                </div>
                {activity.hasAdditionalMetadata && <ActivityLogMetaButton meta={activity.properties} />}
            </div>
        </div>
    );
};
