<?php

namespace Pterodactyl\Http\Requests\Api\Client\Servers\Subdomains;

use Pterodactyl\Models\Permission;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class StoreSubdomainRequest extends ClientApiRequest
{
    public function rules(): array
    {
        return [
            'subdomain' => ['required', 'string', 'max:191', 'regex:/^[a-z0-9-]+$/'],
            'domain_id' => ['required', 'integer', 'exists:subdomain_domains,id'],
            'allocation_id' => ['required', 'integer', 'exists:allocations,id'],
            'target' => ['nullable', 'string', 'max:191'],
            'port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'proxied' => ['sometimes', 'boolean'],
            'create_srv' => ['sometimes', 'boolean'],
        ];
    }

    public function permission(): string
    {
        return Permission::ACTION_ALLOCATION_CREATE;
    }
}
