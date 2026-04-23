<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubdomainDomain extends Model
{
    /** @use HasFactory<\Database\Factories\SubdomainDomainFactory> */
    use HasFactory;

    public const RESOURCE_NAME = 'subdomain_domain';

    protected $table = 'subdomain_domains';

    protected $guarded = ['id', self::CREATED_AT, self::UPDATED_AT];

    protected $casts = [
        'enabled' => 'bool',
        'cloudflare_api_token' => 'encrypted',
        self::CREATED_AT => 'datetime',
        self::UPDATED_AT => 'datetime',
    ];

    public function subdomains(): HasMany
    {
        return $this->hasMany(ServerSubdomain::class, 'domain_id');
    }
}

