<?php

namespace Pterodactyl\Http\Requests\Api\Client\ServerGroups;

use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class AttachServerGroupServerRequest extends ClientApiRequest
{
    public function rules(): array
    {
        return [
            'server_id' => ['required', 'string', 'max:191'],
        ];
    }
}

