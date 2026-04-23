<?php

namespace Pterodactyl\Services\Subdomains;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Models\SubdomainDomain;

class CloudflareSubdomainService
{
    private const API_BASE = 'https://api.cloudflare.com/client/v4';

    public function __construct(
        private readonly SettingsRepositoryInterface $settings,
    ) {
    }

    /**
     * @throws DisplayException
     */
    public function createRecord(SubdomainDomain $domain, string $fqdn, string $target, bool $proxied = false): array
    {
        $recordType = filter_var($target, FILTER_VALIDATE_IP) ? 'A' : 'CNAME';

        $response = $this->request($domain, 'post', '/dns_records', [
            'type' => $recordType,
            'name' => $fqdn,
            'content' => $target,
            'ttl' => 1,
            'proxied' => $recordType === 'CNAME' ? $proxied : false,
        ]);

        return [
            'id' => Arr::get($response, 'result.id'),
            'type' => $recordType,
        ];
    }

    /**
     * @throws DisplayException
     */
    public function createSrvRecord(SubdomainDomain $domain, string $fqdn, string $target, int $port): string
    {
        $response = $this->request($domain, 'post', '/dns_records', [
            'type' => 'SRV',
            'name' => '_minecraft._tcp.' . $fqdn,
            'data' => [
                'target' => $fqdn,
                'port' => $port,
                'weight' => 0,
                'priority' => 0,
            ],
            'comment' => sprintf('Target %s:%d', $target, $port),
            'ttl' => 1,
        ]);

        return (string) Arr::get($response, 'result.id');
    }

    /**
     * @throws DisplayException
     */
    public function updateRecord(SubdomainDomain $domain, string $recordId, string $fqdn, string $target, bool $proxied = false): void
    {
        $recordType = filter_var($target, FILTER_VALIDATE_IP) ? 'A' : 'CNAME';

        $this->request($domain, 'put', "/dns_records/{$recordId}", [
            'type' => $recordType,
            'name' => $fqdn,
            'content' => $target,
            'ttl' => 1,
            'proxied' => $recordType === 'CNAME' ? $proxied : false,
        ]);
    }

    /**
     * @throws DisplayException
     */
    public function updateSrvRecord(SubdomainDomain $domain, string $recordId, string $fqdn, string $target, int $port): void
    {
        $this->request($domain, 'put', "/dns_records/{$recordId}", [
            'type' => 'SRV',
            'name' => '_minecraft._tcp.' . $fqdn,
            'data' => [
                'target' => $fqdn,
                'port' => $port,
                'weight' => 0,
                'priority' => 0,
            ],
            'comment' => sprintf('Target %s:%d', $target, $port),
            'ttl' => 1,
        ]);
    }

    /**
     * @throws DisplayException
     */
    public function deleteRecord(SubdomainDomain $domain, string $recordId): void
    {
        $this->request($domain, 'delete', "/dns_records/{$recordId}");
    }

    /**
     * Validate Cloudflare token + zone combination.
     *
     * @throws DisplayException
     */
    public function assertDomainCredentialsValid(string $zoneId, string $token): void
    {
        $zoneId = trim($zoneId);
        $token = trim($token);

        if ($zoneId === '' || $token === '') {
            throw new DisplayException('Cloudflare zone ID and API token are required.');
        }

        $response = Http::acceptJson()
            ->withToken($token)
            ->get(self::API_BASE . '/zones/' . $zoneId);

        $data = $response->json();
        if ($response->failed() || !Arr::get($data, 'success', false)) {
            $message = Arr::get($data, 'errors.0.message') ?: 'Cloudflare credential check failed.';
            throw new DisplayException($message);
        }

        if ((string) Arr::get($data, 'result.id') !== $zoneId) {
            throw new DisplayException('Cloudflare zone validation failed.');
        }
    }

    /**
     * @throws DisplayException
     */
    private function request(SubdomainDomain $domain, string $method, string $path, array $payload = []): array
    {
        $enabled = filter_var(
            $this->settings->get('subdomains:enabled', config('subdomains.enabled') ? 'true' : 'false'),
            FILTER_VALIDATE_BOOLEAN
        );
        $token = (string) $domain->cloudflare_api_token;
        $zoneId = (string) $domain->cloudflare_zone_id;

        if (!$enabled) {
            throw new DisplayException('Subdomain management is disabled by configuration.');
        }

        if (empty($token) || empty($zoneId)) {
            throw new DisplayException('Cloudflare subdomain configuration is missing.');
        }

        $response = Http::acceptJson()
            ->withToken($token)
            ->send($method, self::API_BASE . '/zones/' . $zoneId . $path, [
                'json' => $payload,
            ]);

        $data = $response->json();
        if ($response->failed() || !Arr::get($data, 'success', false)) {
            $message = Arr::get($data, 'errors.0.message') ?: 'Cloudflare API request failed.';
            throw new DisplayException($message);
        }

        return is_array($data) ? $data : [];
    }
}
