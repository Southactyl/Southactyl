export interface ServerSubdomain {
    id: number;
    serverId: number;
    allocationId: number | null;
    domainId: number | null;
    subdomain: string;
    domain: string;
    fqdn: string;
    recordType: string;
    recordId: string;
    srvRecordId: string | null;
    target: string;
    port: number | null;
    proxied: boolean;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface CreateServerSubdomainPayload {
    subdomain: string;
    domain_id: number;
    allocation_id: number;
    target?: string;
    port?: number;
    proxied?: boolean;
    create_srv?: boolean;
}

export interface UpdateServerSubdomainPayload {
    subdomain?: string;
    domain_id?: number;
    target?: string;
    port?: number;
    proxied?: boolean;
}

export const rawDataToServerSubdomain = (attributes: any): ServerSubdomain => ({
    id: attributes.id,
    serverId: attributes.server_id,
    allocationId: attributes.allocation_id,
    domainId: attributes.domain_id,
    subdomain: attributes.subdomain,
    domain: attributes.domain,
    fqdn: attributes.fqdn,
    recordType: attributes.record_type,
    recordId: attributes.record_id,
    srvRecordId: attributes.srv_record_id,
    target: attributes.target,
    port: attributes.port,
    proxied: attributes.proxied,
    createdAt: attributes.created_at ?? null,
    updatedAt: attributes.updated_at ?? null,
});

export interface SubdomainDomainOption {
    id: number;
    name: string;
}
