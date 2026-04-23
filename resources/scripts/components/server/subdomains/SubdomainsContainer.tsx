import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';
import { faEdit, faGlobe, faNetworkWired, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import { ServerContext } from '@/state/server';
import { ip } from '@/lib/formatters';
import FlashMessageRender from '@/components/FlashMessageRender';
import GreyRowBox from '@/components/elements/GreyRowBox';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import Spinner from '@/components/elements/Spinner';
import { useFlashKey } from '@/plugins/useFlash';
import getServerSubdomains from '@/api/server/subdomains/getServerSubdomains';
import createServerSubdomain from '@/api/server/subdomains/createServerSubdomain';
import deleteServerSubdomain from '@/api/server/subdomains/deleteServerSubdomain';
import updateServerSubdomain from '@/api/server/subdomains/updateServerSubdomain';
import { ServerSubdomain } from '@/api/server/subdomains/types';
import getSubdomainDomains from '@/api/server/subdomains/getSubdomainDomains';
import { SubdomainDomainOption } from '@/api/server/subdomains/types';
import Modal from '@/components/elements/Modal';

export default function SubdomainsContainer() {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const allocations = ServerContext.useStoreState((state) => state.server.data?.allocations || []);
    const [subdomain, setSubdomain] = useState('');
    const [selectedAllocation, setSelectedAllocation] = useState('');
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<ServerSubdomain[]>([]);
    const [domains, setDomains] = useState<SubdomainDomainOption[]>([]);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editing, setEditing] = useState<ServerSubdomain | null>(null);
    const [editSubdomain, setEditSubdomain] = useState('');
    const [editDomainId, setEditDomainId] = useState('');
    const [editTarget, setEditTarget] = useState('');
    const [editPort, setEditPort] = useState('');

    const { clearAndAddHttpError, clearFlashes } = useFlashKey('server:subdomains');

    const allocationOptions = useMemo(
        () =>
            allocations.map((allocation) => ({
                value: allocation.id.toString(),
                label: `${allocation.alias || ip(allocation.ip)}:${allocation.port}${allocation.isDefault ? ' (Default)' : ''}`,
            })),
        [allocations]
    );

    const fetchSubdomains = () => {
        setLoading(true);
        clearFlashes();

        Promise.all([getSubdomainDomains(uuid), getServerSubdomains(uuid)])
            .then(([domainsData, subdomainsData]) => {
                setDomains(domainsData);
                setItems(subdomainsData);
            })
            .catch((error) => clearAndAddHttpError(error))
            .then(() => setLoading(false));
    };

    useEffect(() => {
        fetchSubdomains();
    }, [uuid]);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        clearFlashes();

        const normalizedSubdomain = subdomain.trim().toLowerCase();
        const allocationId = Number(selectedAllocation || allocationOptions[0]?.value || 0);

        const domainId = Number(selectedDomain);
        if (!normalizedSubdomain || !allocationId || !domainId) {
            setFormError('Please provide a domain, subdomain, and allocation.');
            return;
        }

        if (!/^[a-z0-9-]+$/.test(normalizedSubdomain)) {
            setFormError('Subdomain can contain only lowercase letters, numbers, and hyphens.');
            return;
        }

        setCreating(true);
        try {
            const created = await createServerSubdomain(uuid, {
                subdomain: normalizedSubdomain,
                domain_id: domainId,
                allocation_id: allocationId,
                create_srv: true,
            });

            setItems((current) => [created, ...current]);
            setSubdomain('');
        } catch (error) {
            clearAndAddHttpError(error);
        } finally {
            setCreating(false);
        }
    };

    const onDelete = async (id: number) => {
        if (!window.confirm('Delete this subdomain record?')) return;

        setDeleting(id);
        clearFlashes();
        try {
            await deleteServerSubdomain(uuid, id);
            setItems((current) => current.filter((item) => item.id !== id));
        } catch (error) {
            clearAndAddHttpError(error);
        } finally {
            setDeleting(null);
        }
    };

    const openEdit = (item: ServerSubdomain) => {
        setEditing(item);
        setEditSubdomain(item.subdomain);
        setEditDomainId(item.domainId ? item.domainId.toString() : '');
        setEditTarget(item.target);
        setEditPort(item.port ? item.port.toString() : '');
        setEditVisible(true);
    };

    const submitEdit = async (e: FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        const domainId = Number(editDomainId);
        if (!domainId || !editSubdomain.trim()) {
            setFormError('Please provide domain and subdomain.');
            return;
        }

        setUpdating(true);
        clearFlashes();
        try {
            const updated = await updateServerSubdomain(uuid, editing.id, {
                subdomain: editSubdomain.trim().toLowerCase(),
                domain_id: domainId,
                target: editTarget.trim() || undefined,
                port: editPort.trim() ? Number(editPort) : undefined,
            });

            setItems((current) => current.map((row) => (row.id === updated.id ? updated : row)));
            setEditVisible(false);
            setEditing(null);
        } catch (error) {
            clearAndAddHttpError(error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <ServerContentBlock title={'Subdomains'}>
            <FlashMessageRender byKey={'server:subdomains'} css={tw`mb-4`} />

            <div css={tw`mb-6`}>
                <h1 css={tw`text-2xl text-neutral-100`}>Subdomains</h1>
                <p css={tw`text-sm text-neutral-300 mt-2`}>
                    Create and manage subdomains for this server. Records are managed through Cloudflare.
                </p>
            </div>

            <div css={tw`grid grid-cols-1 xl:grid-cols-3 gap-4`}>
                <TitledGreyBox title={'Create Subdomain'} icon={faGlobe} className={'xl:col-span-2'}>
                    {formError && (
                        <p
                            css={tw`text-sm rounded p-3 mb-4`}
                            style={{
                                background:
                                    'color-mix(in srgb, var(--theme-danger) 12%, var(--theme-card-background) 88%)',
                                border: '1px solid color-mix(in srgb, var(--theme-danger) 50%, transparent)',
                            }}
                        >
                            {formError}
                        </p>
                    )}

                    <form css={tw`space-y-4`} onSubmit={onSubmit}>
                        <div css={tw`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                            <div>
                                <label css={tw`block text-xs uppercase tracking-wide mb-2 text-neutral-300`}>Subdomain</label>
                                <Input
                                    value={subdomain}
                                    onChange={(e) => setSubdomain(e.currentTarget.value)}
                                    placeholder={'play'}
                                />
                            </div>
                            <div>
                                <label css={tw`block text-xs uppercase tracking-wide mb-2 text-neutral-300`}>Domain</label>
                                <select
                                    css={tw`w-full p-3 rounded border-2 text-sm`}
                                    style={{
                                        background: 'var(--theme-input-background)',
                                        borderColor: 'var(--theme-input-border)',
                                        color: 'var(--theme-text-primary)',
                                    }}
                                    value={selectedDomain}
                                    onChange={(e) => setSelectedDomain(e.currentTarget.value)}
                                >
                                    <option value=''>Select domain</option>
                                    {domains.map((domainOption) => (
                                        <option key={domainOption.id} value={domainOption.id}>
                                            {domainOption.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label css={tw`block text-xs uppercase tracking-wide mb-2 text-neutral-300`}>Allocation</label>
                            <select
                                css={tw`w-full p-3 rounded border-2 text-sm`}
                                style={{
                                    background: 'var(--theme-input-background)',
                                    borderColor: 'var(--theme-input-border)',
                                    color: 'var(--theme-text-primary)',
                                }}
                                value={selectedAllocation}
                                onChange={(e) => setSelectedAllocation(e.currentTarget.value)}
                            >
                                {allocationOptions.length === 0 ? (
                                    <option value=''>No allocations available</option>
                                ) : (
                                    <>
                                        <option value=''>Select allocation</option>
                                        {allocationOptions.map((allocation) => (
                                            <option key={allocation.value} value={allocation.value}>
                                                {allocation.label}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>

                        <div css={tw`flex justify-end`}>
                            <Button
                                type={'submit'}
                                disabled={allocationOptions.length === 0 || domains.length === 0}
                                isLoading={creating}
                            >
                                Create Subdomain
                            </Button>
                        </div>
                    </form>
                </TitledGreyBox>

                <TitledGreyBox title={'DNS / Info'} icon={faNetworkWired}>
                    <ul css={tw`text-sm text-neutral-300 space-y-2`}>
                        <li>Creates A or CNAME record based on target format.</li>
                        <li>Creates SRV record for Minecraft routing.</li>
                        <li>Domain must be selected from domains configured in admin.</li>
                        {domains.length === 0 && (
                            <li css={tw`text-yellow-300`}>No enabled domains found. Ask an admin to add one in Admin -> Subdomains.</li>
                        )}
                    </ul>
                </TitledGreyBox>
            </div>

            <div css={tw`mt-6`}>
                {loading ? (
                    <Spinner size={'large'} centered />
                ) : items.length === 0 ? (
                    <p css={tw`text-center text-sm text-neutral-300`}>
                        No subdomains yet. Create your first subdomain above.
                    </p>
                ) : (
                    items.map((item, index) => (
                        <GreyRowBox key={item.id} $hoverable={false} css={index > 0 ? tw`mt-2` : undefined}>
                            <div css={tw`flex-1`}>
                                <p css={tw`text-base text-neutral-100`}>{item.fqdn}</p>
                                <p css={tw`mt-1 text-xs text-neutral-400`}>
                                    {item.recordType} -> {item.target}
                                    {item.port ? `:${item.port}` : ''} {item.srvRecordId ? '(SRV enabled)' : ''}
                                </p>
                            </div>
                            <div css={tw`text-right mr-4`}>
                                <p css={tw`text-xs text-neutral-400 uppercase`}>Created</p>
                                <p css={tw`text-xs text-neutral-300 mt-1`}>
                                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                                </p>
                            </div>
                            <Button
                                isSecondary
                                onClick={() => openEdit(item)}
                                css={tw`mr-2`}
                            >
                                <FontAwesomeIcon icon={faEdit} fixedWidth />
                            </Button>
                            <Button
                                color={'red'}
                                isSecondary
                                isLoading={deleting === item.id}
                                onClick={() => onDelete(item.id)}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
                            </Button>
                        </GreyRowBox>
                    ))
                )}
            </div>

            <Modal visible={editVisible} onDismissed={() => setEditVisible(false)} dismissable={!updating}>
                <h3 css={tw`text-2xl mb-4`}>Edit Subdomain</h3>
                <form css={tw`space-y-4`} onSubmit={submitEdit}>
                    <div>
                        <label css={tw`block text-xs uppercase tracking-wide mb-2 text-neutral-300`}>Subdomain</label>
                        <Input value={editSubdomain} onChange={(e) => setEditSubdomain(e.currentTarget.value)} />
                    </div>
                    <div>
                        <label css={tw`block text-xs uppercase tracking-wide mb-2 text-neutral-300`}>Domain</label>
                        <select
                            css={tw`w-full p-3 rounded border-2 text-sm`}
                            style={{
                                background: 'var(--theme-input-background)',
                                borderColor: 'var(--theme-input-border)',
                                color: 'var(--theme-text-primary)',
                            }}
                            value={editDomainId}
                            onChange={(e) => setEditDomainId(e.currentTarget.value)}
                        >
                            <option value=''>Select domain</option>
                            {domains.map((domainOption) => (
                                <option key={domainOption.id} value={domainOption.id}>
                                    {domainOption.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label css={tw`block text-xs uppercase tracking-wide mb-2 text-neutral-300`}>Target</label>
                        <Input value={editTarget} onChange={(e) => setEditTarget(e.currentTarget.value)} />
                    </div>
                    <div>
                        <label css={tw`block text-xs uppercase tracking-wide mb-2 text-neutral-300`}>Port</label>
                        <Input value={editPort} onChange={(e) => setEditPort(e.currentTarget.value)} />
                    </div>
                    <div css={tw`text-right`}>
                        <Button type={'button'} isSecondary css={tw`mr-2`} onClick={() => setEditVisible(false)}>
                            Cancel
                        </Button>
                        <Button type={'submit'} isLoading={updating}>
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>
        </ServerContentBlock>
    );
}
