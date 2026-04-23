<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Facades\Activity;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\ServerSubdomain;
use Pterodactyl\Models\SubdomainDomain;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Services\Subdomains\CloudflareSubdomainService;
use Pterodactyl\Transformers\Api\Client\SubdomainTransformer;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Http\Requests\Api\Client\Servers\Subdomains\GetSubdomainsRequest;
use Pterodactyl\Http\Requests\Api\Client\Servers\Subdomains\StoreSubdomainRequest;
use Pterodactyl\Http\Requests\Api\Client\Servers\Subdomains\DeleteSubdomainRequest;
use Pterodactyl\Http\Requests\Api\Client\Servers\Subdomains\UpdateSubdomainRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SubdomainController extends ClientApiController
{
    public function __construct(
        private readonly CloudflareSubdomainService $cloudflareSubdomainService,
        private readonly SettingsRepositoryInterface $settings,
    ) {
        parent::__construct();
    }

    public function index(GetSubdomainsRequest $request, Server $server): array
    {
        $this->assertFeatureAvailable();

        return $this->fractal->collection($server->subdomains()->latest()->get())
            ->transformWith($this->getTransformer(SubdomainTransformer::class))
            ->toArray();
    }

    public function domains(GetSubdomainsRequest $request, Server $server): JsonResponse
    {
        if (!$this->isFeatureAvailable()) {
            return new JsonResponse([
                'object' => 'list',
                'data' => [],
            ], Response::HTTP_OK);
        }

        $domains = SubdomainDomain::query()
            ->where('enabled', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return new JsonResponse([
            'object' => 'list',
            'data' => $domains->map(fn (SubdomainDomain $domain) => [
                'object' => 'subdomain_domain',
                'attributes' => [
                    'id' => $domain->id,
                    'name' => $domain->name,
                ],
            ])->values(),
        ]);
    }

    /**
     * @throws DisplayException
     */
    public function store(StoreSubdomainRequest $request, Server $server): array
    {
        $this->assertFeatureAvailable();

        $allocationId = (int) $request->integer('allocation_id');
        $allocation = $server->allocations()->whereKey($allocationId)->first();
        if (!$allocation) {
            throw new DisplayException('The selected allocation is not assigned to this server.');
        }

        $domainModel = SubdomainDomain::query()
            ->where('enabled', true)
            ->find((int) $request->integer('domain_id'));
        if (!$domainModel) {
            throw new DisplayException('The selected domain is not available.');
        }

        $subdomain = strtolower(trim((string) $request->input('subdomain')));
        $domain = strtolower(trim((string) $domainModel->name));

        $target = trim((string) ($request->input('target') ?: $allocation->ip_alias ?: $allocation->ip));
        $port = $request->filled('port') ? (int) $request->integer('port') : (int) $allocation->port;
        $proxied = (bool) $request->boolean('proxied');
        $createSrv = (bool) $request->boolean('create_srv', true);
        $fqdn = $subdomain . '.' . $domain;

        $exists = $server->subdomains()->where('fqdn', $fqdn)->exists();
        if ($exists) {
            throw new DisplayException('A subdomain with this hostname already exists on this server.');
        }

        $result = Activity::event('server:subdomain.create')->transaction(function ($activity) use (
            $server,
            $allocation,
            $domainModel,
            $subdomain,
            $domain,
            $fqdn,
            $target,
            $port,
            $proxied,
            $createSrv
        ) {
            return DB::transaction(function () use (
                $activity,
                $server,
                $allocation,
                $domainModel,
                $subdomain,
                $domain,
                $fqdn,
                $target,
                $port,
                $proxied,
                $createSrv
            ) {
                $limit = $this->resolveSubdomainLimit($server);
                if (!is_null($limit) && $server->subdomains()->lockForUpdate()->count() >= $limit) {
                    throw new DisplayException('This server has reached its subdomain limit.');
                }

                $record = $this->cloudflareSubdomainService->createRecord($domainModel, $fqdn, $target, $proxied);
                $srvRecordId = null;
                if ($createSrv) {
                    $srvRecordId = $this->cloudflareSubdomainService->createSrvRecord($domainModel, $fqdn, $target, $port);
                }

                $model = ServerSubdomain::query()->create([
                    'server_id' => $server->id,
                    'allocation_id' => $allocation->id,
                    'domain_id' => $domainModel->id,
                    'subdomain' => $subdomain,
                    'domain' => $domain,
                    'fqdn' => $fqdn,
                    'record_type' => $record['type'],
                    'record_id' => $record['id'],
                    'srv_record_id' => $srvRecordId,
                    'target' => $target,
                    'port' => $port,
                    'proxied' => $proxied,
                ]);

                $activity->subject($model)
                    ->property([
                        'fqdn' => $fqdn,
                        'target' => $target,
                        'port' => $port,
                    ]);

                return $model;
            });
        });

        return $this->fractal->item($result)
            ->transformWith($this->getTransformer(SubdomainTransformer::class))
            ->toArray();
    }

    /**
     * @throws DisplayException
     */
    public function update(UpdateSubdomainRequest $request, Server $server, ServerSubdomain $subdomain): array
    {
        $this->assertFeatureAvailable();

        $domainModel = $subdomain->domainModel;
        if ($request->filled('domain_id')) {
            $domainModel = SubdomainDomain::query()
                ->where('enabled', true)
                ->find((int) $request->integer('domain_id'));
        }
        if (!$domainModel) {
            throw new DisplayException('The selected domain is not available.');
        }

        $newSubdomain = strtolower(trim((string) ($request->input('subdomain') ?: $subdomain->subdomain)));
        $newDomain = strtolower(trim((string) $domainModel->name));
        $newFqdn = $newSubdomain . '.' . $newDomain;
        $newTarget = trim((string) ($request->input('target') ?: $subdomain->target));
        $newPort = $request->filled('port') ? (int) $request->integer('port') : $subdomain->port;
        $newProxied = $request->has('proxied') ? (bool) $request->boolean('proxied') : (bool) $subdomain->proxied;

        $duplicateExists = $server->subdomains()
            ->where('fqdn', $newFqdn)
            ->whereKeyNot($subdomain->id)
            ->exists();
        if ($duplicateExists) {
            throw new DisplayException('A subdomain with this hostname already exists on this server.');
        }

        Activity::event('server:subdomain.update')->transaction(function ($activity) use (
            $subdomain,
            $domainModel,
            $newSubdomain,
            $newDomain,
            $newFqdn,
            $newTarget,
            $newPort,
            $newProxied
        ) {
            DB::transaction(function () use ($subdomain, $domainModel, $newFqdn, $newTarget, $newPort, $newProxied) {
                $this->cloudflareSubdomainService->updateRecord($domainModel, $subdomain->record_id, $newFqdn, $newTarget, $newProxied);
                if (!empty($subdomain->srv_record_id) && !is_null($newPort)) {
                    $this->cloudflareSubdomainService->updateSrvRecord($domainModel, $subdomain->srv_record_id, $newFqdn, $newTarget, $newPort);
                }
            });

            $subdomain->forceFill([
                'domain_id' => $domainModel->id,
                'subdomain' => $newSubdomain,
                'domain' => $newDomain,
                'fqdn' => $newFqdn,
                'target' => $newTarget,
                'port' => $newPort,
                'proxied' => $newProxied,
            ])->save();

            $activity->subject($subdomain)
                ->property([
                    'fqdn' => $newFqdn,
                    'target' => $newTarget,
                    'port' => $newPort,
                ]);
        });

        return $this->fractal->item($subdomain->refresh())
            ->transformWith($this->getTransformer(SubdomainTransformer::class))
            ->toArray();
    }

    public function delete(DeleteSubdomainRequest $request, Server $server, ServerSubdomain $subdomain): JsonResponse
    {
        $this->assertFeatureAvailable();

        $domainModel = $subdomain->domainModel;
        if (!$domainModel) {
            throw new DisplayException('The selected domain is not available.');
        }

        Activity::event('server:subdomain.delete')->transaction(function ($activity) use ($subdomain, $domainModel) {
            DB::transaction(function () use ($subdomain, $domainModel) {
                $this->cloudflareSubdomainService->deleteRecord($domainModel, $subdomain->record_id);
                if (!empty($subdomain->srv_record_id)) {
                    $this->cloudflareSubdomainService->deleteRecord($domainModel, $subdomain->srv_record_id);
                }

                $subdomain->delete();
            });

            $activity->subject($subdomain)->property('fqdn', $subdomain->fqdn);
        });

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    private function isFeatureAvailable(): bool
    {
        $enabled = filter_var(
            $this->settings->get('subdomains:enabled', config('subdomains.enabled') ? 'true' : 'false'),
            FILTER_VALIDATE_BOOLEAN
        );
        if (!$enabled) {
            return false;
        }

        return SubdomainDomain::query()->where('enabled', true)->exists();
    }

    private function assertFeatureAvailable(): void
    {
        if (!$this->isFeatureAvailable()) {
            throw new NotFoundHttpException();
        }
    }

    private function resolveSubdomainLimit(Server $server): ?int
    {
        if (!is_null($server->subdomain_limit)) {
            return max(0, (int) $server->subdomain_limit);
        }

        $default = $this->settings->get('subdomains:default_limit');
        if ($default === null || $default === '') {
            return null;
        }

        return max(0, (int) $default);
    }
}
