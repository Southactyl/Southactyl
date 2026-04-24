<?php

namespace Pterodactyl\Http\Requests\Api\Client\ServerGroups;

use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class SortServerGroupServersRequest extends ClientApiRequest
{
    public function rules(): array
    {
        return [
            'server_ids' => ['required', 'array'],
            'server_ids.*' => ['string', 'max:191'],
        ];
    }
}

