<?php

namespace Pterodactyl\Http\Requests\Api\Client\ServerGroups;

use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class SortServerGroupsRequest extends ClientApiRequest
{
    public function rules(): array
    {
        return [
            'group_ids' => ['required', 'array'],
            'group_ids.*' => ['integer', 'min:1'],
        ];
    }
}

