<?php

namespace Pterodactyl\Transformers\Api\Client;

use Pterodactyl\Models\ServerSubdomain;

class SubdomainTransformer extends BaseClientTransformer
{
    public function getResourceName(): string
    {
        return 'subdomain';
    }

    public function transform(ServerSubdomain $model): array
    {
        return [
            'id' => $model->id,
            'server_id' => $model->server_id,
            'allocation_id' => $model->allocation_id,
            'domain_id' => $model->domain_id,
            'subdomain' => $model->subdomain,
            'domain' => $model->domain,
            'fqdn' => $model->fqdn,
            'record_type' => $model->record_type,
            'record_id' => $model->record_id,
            'srv_record_id' => $model->srv_record_id,
            'target' => $model->target,
            'port' => $model->port,
            'proxied' => $model->proxied,
            'created_at' => $model->created_at?->toAtomString(),
            'updated_at' => $model->updated_at?->toAtomString(),
        ];
    }
}
