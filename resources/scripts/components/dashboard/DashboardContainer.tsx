import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faPen } from '@fortawesome/free-solid-svg-icons';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult, httpErrorToHuman } from '@/api/http';
import Input from '@/components/elements/Input';
import Button from '@/components/elements/Button';
import Modal from '@/components/elements/Modal';
import NotFoundSvg from '@/assets/images/not_found.svg';
import DashboardActivityPanel from '@/components/dashboard/activity/DashboardActivityPanel';
import {
    addServerToGroup,
    createServerGroup,
    deleteServerGroup,
    getServerGroups,
    removeServerFromGroup,
    ServerGroup,
    updateServerGroup,
} from '@/api/serverGroups';

export default () => {
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const userEmail = useStoreState((state) => state.user.data!.email);
    const companyName = useStoreState((state) => state.settings.data!.name);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);
    const [collapsedGroups, setCollapsedGroups] = usePersistedState<Record<number, boolean>>(
        `${uuid}:collapsed_server_groups`,
        {}
    );
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState('#3B82F6');
    const [groupLocked, setGroupLocked] = useState(false);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [activeAddModalGroupId, setActiveAddModalGroupId] = useState<number | null>(null);
    const [addSearch, setAddSearch] = useState('');
    const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);
    const [isTogglingGroupLock, setIsTogglingGroupLock] = useState(false);
    const [draggingServer, setDraggingServer] = useState<Server | null>(null);
    const [dragOverGroupId, setDragOverGroupId] = useState<number | null>(null);
    const [dragOverUngrouped, setDragOverUngrouped] = useState(false);
    const [activeRenameGroup, setActiveRenameGroup] = useState<ServerGroup | null>(null);
    const [renameGroupName, setRenameGroupName] = useState('');
    const [activeDeleteGroup, setActiveDeleteGroup] = useState<ServerGroup | null>(null);

    const {
        data: serversResponse,
        error: serversError,
        mutate: mutateServers,
    } = useSWR<PaginatedResult<Server>>(['/api/client/servers', showOnlyAdmin && rootAdmin], () =>
        getServers({ type: showOnlyAdmin && rootAdmin ? 'admin' : undefined, perPage: 100 })
    );

    const {
        data: groups = [],
        error: groupsError,
        mutate: mutateGroups,
    } = useSWR<ServerGroup[]>('/api/client/server-groups', getServerGroups);

    const servers = serversResponse?.items ?? [];

    useEffect(() => {
        if (serversError) clearAndAddHttpError({ key: 'dashboard', error: serversError });
        if (!serversError) clearFlashes('dashboard');
    }, [serversError]);

    useEffect(() => {
        if (groupsError) clearAndAddHttpError({ key: 'dashboard', error: groupsError });
        if (!groupsError) clearFlashes('dashboard');
    }, [groupsError]);

    const serverByInternalId = useMemo(() => {
        return new Map<number, Server>(
            servers
                .map((server) => [Number(server.internalId), server] as const)
                .filter(([id]) => Number.isFinite(id))
        );
    }, [servers]);

    const groupedSections = useMemo(() => {
        const sortedGroups = [...groups].sort((a, b) => a.sort_order - b.sort_order);
        const groupedServerIds = new Set<number>();

        const sections = sortedGroups.map((group) => {
            const groupServers = [...group.servers]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((pivot) => serverByInternalId.get(pivot.server_id))
                .filter((server): server is Server => !!server);

            group.servers.forEach((pivot) => groupedServerIds.add(pivot.server_id));

            return { group, servers: groupServers };
        });

        const ungrouped = servers.filter((server) => {
            const internalId = Number(server.internalId);

            return Number.isFinite(internalId) && !groupedServerIds.has(internalId);
        });

        return { sections, ungrouped };
    }, [groups, serverByInternalId]);

    const activeAddGroup = useMemo(
        () => groups.find((group) => group.id === activeAddModalGroupId) || null,
        [groups, activeAddModalGroupId]
    );

    const manageableServers = useMemo(() => {
        if (!activeAddGroup) return [];

        const q = addSearch.trim().toLowerCase();

        return servers.filter((server) => {
            const internalId = Number(server.internalId);
            if (!Number.isFinite(internalId)) return false;
            if (!q) return true;

            return (
                server.name.toLowerCase().includes(q) ||
                server.uuid.toLowerCase().includes(q) ||
                String(server.internalId).includes(q)
            );
        });
    }, [activeAddGroup, servers, addSearch]);

    const safeMutation = async (cb: () => Promise<void>) => {
        clearFlashes('dashboard');
        try {
            await cb();
            await Promise.all([mutateGroups(), mutateServers()]);
        } catch (error) {
            clearAndAddHttpError({ key: 'dashboard', error });
        }
    };

    const onCreateGroup = async () => {
        const trimmed = groupName.trim();
        if (!trimmed) return;

        setIsCreatingGroup(true);
        await safeMutation(async () => {
            await createServerGroup({ name: trimmed, color: groupColor || null, is_locked: groupLocked });
            setGroupName('');
            setGroupColor('#3B82F6');
            setGroupLocked(false);
            setShowCreateGroupModal(false);
        });
        setIsCreatingGroup(false);
    };

    const onRenameGroup = async (group: ServerGroup) => {
        setRenameGroupName(group.name);
        setActiveRenameGroup(group);
    };

    const onDeleteGroup = async (group: ServerGroup) => {
        setActiveDeleteGroup(group);
    };

    const onToggleGroupLock = async (group: ServerGroup) => {
        setIsTogglingGroupLock(true);
        await safeMutation(async () => {
            await updateServerGroup(group.id, { is_locked: !group.is_locked });
        });
        setIsTogglingGroupLock(false);
    };

    const onAddServer = async (groupId: number, server: Server) => {
        await safeMutation(async () => {
            await addServerToGroup(groupId, server.internalId);
        });
    };

    const onRemoveServer = async (groupId: number, server: Server) => {
        await safeMutation(async () => {
            await removeServerFromGroup(groupId, server.internalId);
        });
    };

    const moveServerBetweenGroups = async (server: Server, targetGroupId: number | null) => {
        const internalId = Number(server.internalId);
        const currentGroups = groups.filter((group) =>
            group.servers.some((membership) => membership.server_id === internalId)
        );

        const blockedGroup = currentGroups.find((group) => group.is_locked && group.id !== targetGroupId);
        if (blockedGroup) {
            throw new Error(`Server is in locked group "${blockedGroup.name}". Unlock it first.`);
        }

        const targetGroup = targetGroupId ? groups.find((group) => group.id === targetGroupId) : null;
        if (targetGroup?.is_locked) {
            throw new Error(`Target group "${targetGroup.name}" is locked.`);
        }

        await safeMutation(async () => {
            for (const group of currentGroups) {
                if (targetGroupId !== null && group.id === targetGroupId) {
                    continue;
                }

                await removeServerFromGroup(group.id, server.internalId);
            }

            if (targetGroupId !== null) {
                const alreadyInTarget = currentGroups.some((group) => group.id === targetGroupId);
                if (!alreadyInTarget) {
                    await addServerToGroup(targetGroupId, server.internalId);
                }
            }
        });
    };

    const createDragPreviewElement = (sourceElement: HTMLDivElement): HTMLDivElement => {
        const preview = sourceElement.cloneNode(true) as HTMLDivElement;
        const rect = sourceElement.getBoundingClientRect();

        preview.style.position = 'fixed';
        preview.style.top = '-1000px';
        preview.style.left = '-1000px';
        preview.style.pointerEvents = 'none';
        preview.style.zIndex = '2147483647';
        preview.style.width = `${rect.width}px`;
        preview.style.maxWidth = `${rect.width}px`;
        preview.style.opacity = '0.95';
        preview.style.transform = 'scale(0.98)';
        preview.style.transformOrigin = 'top left';

        document.body.appendChild(preview);

        return preview;
    };

    const onDragStartServer = (event: React.DragEvent<HTMLDivElement>, server: Server) => {
        const internalId = Number(server.internalId);
        const isDragLocked = groups.some(
            (group) => group.is_locked && group.servers.some((membership) => membership.server_id === internalId)
        );
        if (isDragLocked) {
            event.preventDefault();

            return;
        }

        setDraggingServer(server);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', server.uuid);

        const preview = createDragPreviewElement(event.currentTarget);
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = Math.max(8, Math.min(rect.width - 8, event.clientX - rect.left));
        const offsetY = Math.max(8, Math.min(rect.height - 8, event.clientY - rect.top));
        event.dataTransfer.setDragImage(preview, offsetX, offsetY);
        setTimeout(() => {
            preview.remove();
        }, 0);
    };

    const onDragEndServer = () => {
        setDraggingServer(null);
        setDragOverGroupId(null);
        setDragOverUngrouped(false);
    };

    const onDropToGroup = async (groupId: number) => {
        if (!draggingServer) return;
        await moveServerBetweenGroups(draggingServer, groupId);
        onDragEndServer();
    };

    const onDropToUngrouped = async () => {
        if (!draggingServer) return;
        await moveServerBetweenGroups(draggingServer, null);
        onDragEndServer();
    };

    const isShowingOtherUsersServers = !!(showOnlyAdmin && rootAdmin);
    const hideGroupSettings = !!(showOnlyAdmin && rootAdmin);

    const toggleCollapsed = (groupId: number) => {
        setCollapsedGroups((current) => ({ ...(current || {}), [groupId]: !(current || {})[groupId] }));
    };

    return (
        <PageContentBlock className={'content-dashboard'} title={'Dashboard'} showFlashKey={'dashboard'}>
            <div css={tw`mb-4`}>
                <h1 css={tw`text-2xl sm:text-3xl font-semibold`} style={{ color: 'var(--theme-text-primary)' }}>
                    Welcome to {companyName}
                </h1>
                <p css={tw`text-sm mt-1`} style={{ color: 'var(--theme-text-muted)' }}>
                    Logged in as {userEmail}
                </p>
            </div>
            <div css={tw`mb-4 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:min-h-[2.5rem]`}>
                <div css={tw`flex items-center w-full sm:w-[22rem] max-w-full`}>
                    <p css={tw`uppercase text-xs text-neutral-400 mr-2 w-auto sm:w-[13.5rem] whitespace-nowrap overflow-hidden truncate`}>
                        {showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
                    </p>
                    {rootAdmin && (
                        <Switch
                            name={'show_all_servers'}
                            defaultChecked={showOnlyAdmin}
                            onChange={() => setShowOnlyAdmin((s) => !s)}
                        />
                    )}
                </div>
                <div css={tw`flex justify-start sm:justify-end w-full sm:w-[10rem] sm:flex-shrink-0`}>
                    <Button
                        isSecondary
                        onClick={() => setShowGroupSettingsModal(true)}
                        css={tw`w-full sm:w-full`}
                        style={{
                            visibility: hideGroupSettings ? 'hidden' : 'visible',
                            pointerEvents: hideGroupSettings ? 'none' : 'auto',
                        }}
                    >
                        Group Settings
                    </Button>
                </div>
            </div>

            {!serversResponse ? (
                <Spinner centered size={'large'} />
            ) : (
                <div css={tw`w-full grid grid-cols-1 xl:grid-cols-12 gap-4`}>
                    <div css={tw`xl:col-span-8 2xl:col-span-9 min-w-0`}>
                        {isShowingOtherUsersServers ? (
                            servers.length > 0 ? (
                                <div css={tw`w-full`}>
                                    {servers.map((server, index) => (
                                        <ServerRow
                                            key={server.uuid}
                                            server={server}
                                            className={index > 0 ? 'mt-2' : ''}
                                            showGroupButton={false}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div
                                    css={tw`w-full rounded-md p-8 text-center`}
                                    style={{
                                        background: 'color-mix(in srgb, var(--theme-component-headers) 72%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--theme-card-border) 76%, transparent)',
                                    }}
                                >
                                    <img
                                        src={NotFoundSvg}
                                        alt={'No servers'}
                                        css={tw`mx-auto mb-5 max-w-full select-none opacity-90`}
                                        style={{ width: 'clamp(8rem, 35vw, 36rem)' }}
                                    />
                                    <p
                                        css={tw`font-semibold leading-tight`}
                                        style={{
                                            color: 'var(--theme-text-primary)',
                                            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                                        }}
                                    >
                                        No Servers
                                    </p>
                                    <p
                                        css={tw`mt-3 mx-auto max-w-2xl px-2 leading-relaxed`}
                                        style={{
                                            color: 'var(--theme-text-muted)',
                                            fontSize: 'clamp(1rem, 2.6vw, 1.375rem)',
                                        }}
                                    >
                                        No servers found for this view.
                                    </p>
                                </div>
                            )
                        ) : (
                            <div css={tw`w-full`}>
                                {groupedSections.sections.map(({ group, servers: groupServers }) => (
                                    <div
                                        key={group.id}
                                        css={tw`mb-4 rounded-md overflow-hidden`}
                                        style={{
                                            border: '1px solid color-mix(in srgb, var(--theme-card-border) 76%, transparent)',
                                            background: 'color-mix(in srgb, var(--theme-component-headers) 76%, transparent)',
                                            boxShadow:
                                                draggingServer && dragOverGroupId === group.id
                                                    ? '0 0 0 2px color-mix(in srgb, var(--theme-primary-content) 48%, transparent) inset'
                                                    : undefined,
                                        }}
                                        onDragOver={(event) => {
                                            event.preventDefault();
                                            if (!draggingServer) return;
                                            setDragOverGroupId(group.id);
                                        }}
                                        onDrop={(event) => {
                                            event.preventDefault();
                                            onDropToGroup(group.id);
                                        }}
                                    >
                                        <div css={tw`px-3 py-2 flex items-center justify-between gap-2`}>
                                            <div css={tw`flex items-center gap-2 min-w-0`}>
                                                <button
                                                    type={'button'}
                                                    css={tw`w-6 h-6 rounded-sm inline-flex items-center justify-center text-neutral-300 hover:text-white`}
                                                    onClick={() => toggleCollapsed(group.id)}
                                                    title={collapsedGroups?.[group.id] ? 'Expand group' : 'Collapse group'}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={collapsedGroups?.[group.id] ? faChevronRight : faChevronDown}
                                                    />
                                                </button>
                                                <span
                                                    css={tw`inline-block w-2 h-2 rounded-full flex-shrink-0`}
                                                    style={{ background: group.color || 'var(--theme-primary-content)' }}
                                                />
                                                <p css={tw`font-semibold truncate`}>{group.name}</p>
                                                <button
                                                    type={'button'}
                                                    css={tw`w-2 h-2 px-2 rounded-sm inline-flex items-center justify-center text-neutral-400 hover:text-white`}
                                                    onClick={() => onRenameGroup(group)}
                                                    title={'Rename group'}
                                                >
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>
                                                {group.is_locked && (
                                                    <span
                                                        css={tw`text-xs px-2 py-0.5 rounded-full`}
                                                        style={{
                                                            background: 'color-mix(in srgb, var(--theme-warning) 20%, transparent)',
                                                            border: '1px solid color-mix(in srgb, var(--theme-warning) 50%, transparent)',
                                                        }}
                                                    >
                                                        Locked
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {!collapsedGroups?.[group.id] && (
                                            <div css={tw`p-2`}>
                                                {groupServers.length > 0 ? (
                                                    groupServers.map((server, index) => {
                                                        const isDragLocked = groups.some(
                                                            (lockedGroup) =>
                                                                lockedGroup.is_locked &&
                                                                lockedGroup.servers.some(
                                                                    (membership) =>
                                                                        membership.server_id === Number(server.internalId)
                                                                )
                                                        );

                                                        return (
                                                            <div
                                                                key={server.uuid}
                                                                draggable={!isDragLocked}
                                                                onDragStart={(event) => {
                                                                    onDragStartServer(event, server);
                                                                }}
                                                                onDragEnd={onDragEndServer}
                                                                css={tw`select-none`}
                                                                style={{ cursor: isDragLocked ? 'not-allowed' : 'move' }}
                                                            >
                                                                <ServerRow
                                                                    server={server}
                                                                    className={index > 0 ? 'mt-2' : ''}
                                                                    showGroupButton={false}
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p css={tw`text-sm text-neutral-400 px-2 py-3`}>No servers in this group yet.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div
                                    style={{
                                        boxShadow:
                                            draggingServer && dragOverUngrouped
                                                ? '0 0 0 2px color-mix(in srgb, var(--theme-primary-content) 48%, transparent) inset'
                                                : undefined,
                                        borderRadius: draggingServer && dragOverUngrouped ? '8px' : undefined,
                                    }}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        if (!draggingServer) return;
                                        setDragOverUngrouped(true);
                                        setDragOverGroupId(null);
                                    }}
                                    onDragLeave={() => setDragOverUngrouped(false)}
                                    onDrop={(event) => {
                                        event.preventDefault();
                                        onDropToUngrouped();
                                    }}
                                >
                                    {groupedSections.ungrouped.length > 0 ? (
                                        groupedSections.ungrouped.map((server, index) => {
                                            const isDragLocked = groups.some(
                                                (lockedGroup) =>
                                                    lockedGroup.is_locked &&
                                                    lockedGroup.servers.some(
                                                        (membership) => membership.server_id === Number(server.internalId)
                                                    )
                                            );

                                            return (
                                                <div
                                                    key={server.uuid}
                                                    draggable={!isDragLocked}
                                                    onDragStart={(event) => {
                                                        onDragStartServer(event, server);
                                                    }}
                                                    onDragEnd={onDragEndServer}
                                                    css={tw`select-none`}
                                                    style={{ cursor: isDragLocked ? 'not-allowed' : 'move' }}
                                                >
                                                    <ServerRow
                                                        server={server}
                                                        className={index > 0 ? 'mt-2' : ''}
                                                        showGroupButton={false}
                                                    />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div css={tw`text-sm text-neutral-400 px-4 py-12`} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div css={tw`xl:col-span-4 2xl:col-span-3 min-w-0`}>
                        <div css={tw`xl:sticky xl:top-24`}>
                            <DashboardActivityPanel />
                        </div>
                    </div>
                </div>
            )}

            <Modal
                visible={showGroupSettingsModal}
                onDismissed={() => {
                    setShowGroupSettingsModal(false);
                }}
            >
                <h2 css={tw`text-lg font-semibold mb-1`} style={{ color: 'var(--theme-text-primary)' }}>
                    Group Settings
                </h2>
                <p css={tw`text-xs mb-3`} style={{ color: 'var(--theme-text-muted)' }}>
                    Manage group names, lock state, and server membership.
                </p>
                <div css={tw`mb-3 flex justify-end`}>
                    <Button
                        onClick={() => {
                            setShowGroupSettingsModal(false);
                            setShowCreateGroupModal(true);
                        }}
                    >
                        Create New Group
                    </Button>
                </div>
                <div css={tw`space-y-2 max-h-96 overflow-y-auto pr-1`}>
                    {groups.length > 0 ? (
                        [...groups]
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((group) => (
                                <div
                                    key={group.id}
                                    css={tw`p-3 rounded-md`}
                                    style={{
                                        background: 'color-mix(in srgb, var(--theme-background) 84%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--theme-card-border) 74%, transparent)',
                                    }}
                                >
                                    <div css={tw`flex items-center gap-2 min-w-0 mb-2`}>
                                        <span
                                            css={tw`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0`}
                                            style={{ background: group.color || 'var(--theme-primary-content)' }}
                                        />
                                        <p css={tw`text-sm font-semibold truncate`}>{group.name}</p>
                                        <span
                                            css={tw`ml-auto text-xs px-2 py-0.5 rounded-full`}
                                            style={{
                                                background: group.is_locked
                                                    ? 'color-mix(in srgb, var(--theme-warning) 20%, transparent)'
                                                    : 'color-mix(in srgb, var(--theme-success) 18%, transparent)',
                                                border: group.is_locked
                                                    ? '1px solid color-mix(in srgb, var(--theme-warning) 50%, transparent)'
                                                    : '1px solid color-mix(in srgb, var(--theme-success) 50%, transparent)',
                                                color: 'var(--theme-text-primary)',
                                            }}
                                        >
                                            {group.is_locked ? 'Locked' : 'Unlocked'}
                                        </span>
                                    </div>
                                    <div css={tw`grid grid-cols-2 gap-2`}>
                                        <Button
                                            size={'xsmall'}
                                            isSecondary
                                            disabled={group.is_locked}
                                            style={{
                                                background: 'color-mix(in srgb, var(--theme-component-headers) 72%, transparent)',
                                                borderColor: 'color-mix(in srgb, var(--theme-card-border) 78%, transparent)',
                                                color: 'var(--theme-text-primary)',
                                            }}
                                            onClick={() => {
                                                setShowGroupSettingsModal(false);
                                                setActiveAddModalGroupId(group.id);
                                            }}
                                        >
                                            Manage Servers
                                        </Button>
                                        <Button
                                            size={'xsmall'}
                                            isSecondary
                                            disabled={group.is_locked}
                                            style={{
                                                background: 'color-mix(in srgb, var(--theme-component-headers) 72%, transparent)',
                                                borderColor: 'color-mix(in srgb, var(--theme-card-border) 78%, transparent)',
                                                color: 'var(--theme-text-primary)',
                                            }}
                                            onClick={() => {
                                                setShowGroupSettingsModal(false);
                                                onRenameGroup(group);
                                            }}
                                        >
                                            Rename
                                        </Button>
                                        <Button
                                            size={'xsmall'}
                                            isSecondary
                                            isLoading={isTogglingGroupLock}
                                            style={{
                                                background: group.is_locked
                                                    ? 'color-mix(in srgb, var(--theme-success) 22%, transparent)'
                                                    : 'color-mix(in srgb, var(--theme-warning) 22%, transparent)',
                                                borderColor: group.is_locked
                                                    ? 'color-mix(in srgb, var(--theme-success) 52%, transparent)'
                                                    : 'color-mix(in srgb, var(--theme-warning) 52%, transparent)',
                                                color: 'var(--theme-text-primary)',
                                            }}
                                            onClick={() => onToggleGroupLock(group)}
                                        >
                                            {group.is_locked ? 'Unlock' : 'Lock'}
                                        </Button>
                                        <Button
                                            size={'xsmall'}
                                            color={'red'}
                                            isSecondary
                                            disabled={group.is_locked}
                                            style={{
                                                background: 'color-mix(in srgb, var(--theme-danger) 20%, transparent)',
                                                borderColor: 'color-mix(in srgb, var(--theme-danger) 52%, transparent)',
                                                color: 'var(--theme-text-primary)',
                                            }}
                                            onClick={() => {
                                                setShowGroupSettingsModal(false);
                                                onDeleteGroup(group);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p css={tw`text-sm`} style={{ color: 'var(--theme-text-muted)' }}>
                            No groups yet.
                        </p>
                    )}
                </div>
            </Modal>

            <Modal
                visible={!!activeAddGroup}
                onDismissed={() => {
                    setActiveAddModalGroupId(null);
                    setAddSearch('');
                }}
            >
                <h2 css={tw`text-lg font-semibold mb-3`}>Manage Servers in {activeAddGroup?.name}</h2>
                {activeAddGroup?.is_locked && (
                    <p css={tw`text-sm text-yellow-400 mb-3`}>This group is locked. Unlock it from group settings first.</p>
                )}
                <Input
                    placeholder={'Search servers...'}
                    value={addSearch}
                    onChange={(e) => setAddSearch(e.currentTarget.value)}
                    css={tw`mb-3`}
                />
                <div css={tw`space-y-2 max-h-96 overflow-y-auto pr-1`}>
                    {manageableServers.length > 0 ? (
                        manageableServers.map((server) => {
                            const hasServer = !!activeAddGroup?.servers.some(
                                (membership) => membership.server_id === Number(server.internalId)
                            );

                            return (
                                <div
                                    key={server.uuid}
                                    css={tw`p-2 rounded-md flex items-center justify-between gap-2`}
                                    style={{
                                        background: 'color-mix(in srgb, var(--theme-background) 84%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--theme-card-border) 72%, transparent)',
                                    }}
                                >
                                    <div css={tw`min-w-0`}>
                                        <p css={tw`truncate`}>{server.name}</p>
                                        <p css={tw`text-xs text-neutral-400 truncate`}>
                                            {server.uuid} • #{server.internalId}
                                        </p>
                                    </div>
                                    <Button
                                        size={'xsmall'}
                                        color={hasServer ? 'red' : 'primary'}
                                        isSecondary={hasServer}
                                        disabled={!!activeAddGroup?.is_locked}
                                        onClick={() =>
                                            hasServer
                                                ? onRemoveServer(activeAddGroup!.id, server)
                                                : onAddServer(activeAddGroup!.id, server)
                                        }
                                    >
                                        {hasServer ? 'Remove' : 'Add'}
                                    </Button>
                                </div>
                            );
                        })
                    ) : (
                        <p css={tw`text-sm text-neutral-400`}>No servers found.</p>
                    )}
                </div>
                <p css={tw`text-xs text-neutral-500 mt-3`}>
                    {groupsError ? httpErrorToHuman(groupsError) : 'Only servers you can access are shown.'}
                </p>
            </Modal>

            <Modal
                visible={showCreateGroupModal}
                onDismissed={() => {
                    setShowCreateGroupModal(false);
                }}
            >
                <h2 css={tw`text-lg font-semibold mb-3`}>Create Group</h2>
                <div css={tw`flex gap-2`}>
                    <Input
                        placeholder={'Group name...'}
                        value={groupName}
                        onChange={(e) => setGroupName(e.currentTarget.value)}
                    />
                    <Input
                        type={'color'}
                        value={groupColor}
                        onChange={(e) => setGroupColor(e.currentTarget.value)}
                        css={tw`w-14 p-1`}
                    />
                </div>
                <div css={tw`mt-3`}>
                    <label
                        css={tw`flex items-center justify-between gap-3 rounded-md px-3 py-2 cursor-pointer`}
                        style={{
                            background: 'color-mix(in srgb, var(--theme-background) 84%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--theme-card-border) 72%, transparent)',
                        }}
                    >
                        <div css={tw`min-w-0`}>
                            <p css={tw`text-sm font-medium text-neutral-200`}>Lock group after creation</p>
                            <p css={tw`text-xs text-neutral-400`}>
                                Locked groups cannot be renamed or changed until unlocked.
                            </p>
                        </div>
                        <input
                            type={'checkbox'}
                            checked={groupLocked}
                            onChange={(e) => setGroupLocked(e.currentTarget.checked)}
                            css={tw`w-5 h-5 cursor-pointer flex-shrink-0`}
                            style={{ accentColor: 'var(--theme-primary-content)' }}
                        />
                    </label>
                </div>
                <div css={tw`mt-4 flex justify-end`}>
                    <Button onClick={onCreateGroup} isLoading={isCreatingGroup}>
                        Save Group
                    </Button>
                </div>
            </Modal>

            <Modal
                visible={!!activeRenameGroup}
                onDismissed={() => {
                    setActiveRenameGroup(null);
                    setRenameGroupName('');
                }}
            >
                <h2 css={tw`text-lg font-semibold mb-3`}>Rename Group</h2>
                <Input
                    placeholder={'Group name'}
                    value={renameGroupName}
                    onChange={(e) => setRenameGroupName(e.currentTarget.value)}
                />
                <div css={tw`mt-4 flex justify-end gap-2`}>
                    <Button isSecondary onClick={() => setActiveRenameGroup(null)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            if (!activeRenameGroup) return;
                            const trimmed = renameGroupName.trim();
                            if (!trimmed || trimmed === activeRenameGroup.name) {
                                setActiveRenameGroup(null);
                                return;
                            }

                            await safeMutation(async () => {
                                await updateServerGroup(activeRenameGroup.id, { name: trimmed });
                            });
                            setActiveRenameGroup(null);
                            setRenameGroupName('');
                        }}
                    >
                        Save
                    </Button>
                </div>
            </Modal>

            <Modal
                visible={!!activeDeleteGroup}
                onDismissed={() => {
                    setActiveDeleteGroup(null);
                }}
            >
                <h2 css={tw`text-lg font-semibold mb-3`}>Delete Group</h2>
                <p css={tw`text-sm text-neutral-300`}>
                    Delete "{activeDeleteGroup?.name}"? This removes only group links, not servers.
                </p>
                <div css={tw`mt-4 flex justify-end gap-2`}>
                    <Button isSecondary onClick={() => setActiveDeleteGroup(null)}>
                        Cancel
                    </Button>
                    <Button
                        color={'red'}
                        onClick={async () => {
                            if (!activeDeleteGroup) return;
                            await safeMutation(async () => {
                                await deleteServerGroup(activeDeleteGroup.id);
                            });
                            setActiveDeleteGroup(null);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </Modal>
        </PageContentBlock>
    );
};
