import http from '@/api/http';
import { SubdomainDomainOption } from '@/api/server/subdomains/types';

export default async (uuid: string): Promise<SubdomainDomainOption[]> => {
    const { data } = await http.get(`/api/client/servers/${uuid}/subdomains/domains`);

    return (data.data || []).map((item: any) => ({
        id: item.attributes.id,
        name: item.attributes.name,
    }));
};

