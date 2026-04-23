import http from '@/api/http';
import {
    rawDataToServerSubdomain,
    ServerSubdomain,
    UpdateServerSubdomainPayload,
} from '@/api/server/subdomains/types';

export default async (
    uuid: string,
    subdomainId: number,
    payload: UpdateServerSubdomainPayload
): Promise<ServerSubdomain> => {
    const { data } = await http.patch(`/api/client/servers/${uuid}/subdomains/${subdomainId}`, payload);

    return rawDataToServerSubdomain(data.attributes);
};

