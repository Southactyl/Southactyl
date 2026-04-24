<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $server_group_id
 * @property int $server_id
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ServerGroupServer extends Model
{
    /** @use HasFactory<\Database\Factories\ServerGroupServerFactory> */
    use HasFactory;

    public const RESOURCE_NAME = 'server_group_server';

    protected $table = 'server_group_servers';

    protected $guarded = ['id', self::CREATED_AT, self::UPDATED_AT];

    protected $casts = [
        'server_group_id' => 'int',
        'server_id' => 'int',
        'sort_order' => 'int',
        self::CREATED_AT => 'datetime',
        self::UPDATED_AT => 'datetime',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(ServerGroup::class, 'server_group_id');
    }

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class, 'server_id');
    }
}

