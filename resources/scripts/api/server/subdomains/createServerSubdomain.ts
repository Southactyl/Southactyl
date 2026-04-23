import http from '@/api/http';
import {
    CreateServerSubdomainPayload,
    rawDataToServerSubdomain,
    ServerSubdomain,
} from '@/api/server/subdomains/types';

export default async (uuid: string, payload: CreateServerSubdomainPayload): Promise<ServerSubdomain> => {
    const { data } = await http.post(`/api/client/servers/${uuid}/subdomains`, payload);

    return rawDataToServerSubdomain(data.attributes);
};

