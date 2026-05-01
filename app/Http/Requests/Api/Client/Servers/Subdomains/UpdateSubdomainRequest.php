<?php

namespace Pterodactyl\Http\Requests\Api\Client\Servers\Subdomains;

use Pterodactyl\Models\Permission;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class UpdateSubdomainRequest extends ClientApiRequest
{
    public function rules(): array
    {
        return [
            'subdomain' => ['sometimes', 'string', 'max:191', 'regex:/^[a-z0-9-]+$/'],
            'domain_id' => ['sometimes', 'integer', 'exists:subdomain_domains,id'],
            'target' => ['sometimes', 'string', 'max:191'],
            'port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'proxied' => ['sometimes', 'boolean'],
        ];
    }

    public function permission(): string
    {
        return Permission::ACTION_USER_SUBDOMAINS;
    }
}
