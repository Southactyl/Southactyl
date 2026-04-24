import http from '@/api/http';

export interface ServerGroupMembership {
    server_id: number;
    sort_order: number;
}

export interface ServerGroup {
    id: number;
    name: string;
    color: string | null;
    sort_order: number;
    is_locked: boolean;
    server_count: number;
    servers: ServerGroupMembership[];
}

const normalizeGroups = (payload: any): ServerGroup[] => {
    const rows = payload?.data || [];

    return rows.map((row: any) => (row.attributes ? row.attributes : row)) as ServerGroup[];
};

export const getServerGroups = async (): Promise<ServerGroup[]> => {
    const { data } = await http.get('/api/client/server-groups');

    return normalizeGroups(data);
};

export const createServerGroup = async (payload: {
    name: string;
    color?: string | null;
    is_locked?: boolean;
}): Promise<ServerGroup> => {
    const { data } = await http.post('/api/client/server-groups', payload);

    return (data.attributes || data) as ServerGroup;
};

export const updateServerGroup = async (
    groupId: number,
    payload: { name?: string; color?: string | null; sort_order?: number; is_locked?: boolean }
): Promise<ServerGroup> => {
    const { data } = await http.patch(`/api/client/server-groups/${groupId}`, payload);

    return (data.attributes || data) as ServerGroup;
};

export const deleteServerGroup = async (groupId: number): Promise<void> => {
    await http.delete(`/api/client/server-groups/${groupId}`);
};

export const addServerToGroup = async (groupId: number, serverId: string | number): Promise<ServerGroup> => {
    const { data } = await http.post(`/api/client/server-groups/${groupId}/servers`, { server_id: String(serverId) });

    return (data.attributes || data) as ServerGroup;
};

export const removeServerFromGroup = async (groupId: number, serverId: string | number): Promise<void> => {
    await http.delete(`/api/client/server-groups/${groupId}/servers/${serverId}`);
};

export const sortServerGroups = async (groupId: number, groupIds: number[]): Promise<void> => {
    await http.patch(`/api/client/server-groups/${groupId}/sort`, { group_ids: groupIds });
};

export const sortGroupServers = async (groupId: number, serverIds: Array<string | number>): Promise<void> => {
    await http.patch(`/api/client/server-groups/${groupId}/servers/sort`, { server_ids: serverIds.map(String) });
};
