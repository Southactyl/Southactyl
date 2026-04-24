<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $color
 * @property int $sort_order
 * @property bool $is_locked
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ServerGroup extends Model
{
    /** @use HasFactory<\Database\Factories\ServerGroupFactory> */
    use HasFactory;

    public const RESOURCE_NAME = 'server_group';

    protected $table = 'server_groups';

    protected $guarded = ['id', self::CREATED_AT, self::UPDATED_AT];

    protected $casts = [
        'user_id' => 'int',
        'sort_order' => 'int',
        'is_locked' => 'bool',
        self::CREATED_AT => 'datetime',
        self::UPDATED_AT => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<ServerGroupServer, $this>
     */
    public function groupServers(): HasMany
    {
        return $this->hasMany(ServerGroupServer::class, 'server_group_id');
    }

    /**
     * @return BelongsToMany<Server, $this>
     */
    public function servers(): BelongsToMany
    {
        return $this->belongsToMany(Server::class, 'server_group_servers', 'server_group_id', 'server_id')
            ->withPivot(['id', 'sort_order'])
            ->withTimestamps()
            ->orderBy('server_group_servers.sort_order');
    }
}
