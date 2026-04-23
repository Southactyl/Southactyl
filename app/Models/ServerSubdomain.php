<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property int $server_id
 * @property int|null $allocation_id
 * @property int|null $domain_id
 * @property string $subdomain
 * @property string $domain
 * @property string $fqdn
 * @property string $record_type
 * @property string $record_id
 * @property string|null $srv_record_id
 * @property string $target
 * @property int|null $port
 * @property bool $proxied
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ServerSubdomain extends Model
{
    /** @use HasFactory<\Database\Factories\ServerSubdomainFactory> */
    use HasFactory;

    public const RESOURCE_NAME = 'subdomain';

    protected $table = 'server_subdomains';

    protected $guarded = ['id', self::CREATED_AT, self::UPDATED_AT];

    protected $casts = [
        'server_id' => 'int',
        'allocation_id' => 'int',
        'domain_id' => 'int',
        'port' => 'int',
        'proxied' => 'bool',
        self::CREATED_AT => 'datetime',
        self::UPDATED_AT => 'datetime',
    ];

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public function allocation(): BelongsTo
    {
        return $this->belongsTo(Allocation::class);
    }

    public function domainModel(): BelongsTo
    {
        return $this->belongsTo(SubdomainDomain::class, 'domain_id');
    }
}
