<?php

namespace Pterodactyl\Http\Requests\Api\Client\ServerGroups;

use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class StoreServerGroupRequest extends ClientApiRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:64'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_locked' => ['sometimes', 'boolean'],
        ];
    }
}
