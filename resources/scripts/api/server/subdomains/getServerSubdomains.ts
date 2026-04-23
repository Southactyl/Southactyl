import http from '@/api/http';
import { rawDataToServerSubdomain, ServerSubdomain } from '@/api/server/subdomains/types';

export default async (uuid: string): Promise<ServerSubdomain[]> => {
    const { data } = await http.get(`/api/client/servers/${uuid}/subdomains`);

    return (data.data || []).map((item: any) => rawDataToServerSubdomain(item.attributes));
};

