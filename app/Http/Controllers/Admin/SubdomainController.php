<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Models\SubdomainDomain;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Services\Subdomains\CloudflareSubdomainService;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;

class SubdomainController extends Controller
{
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings,
        private CloudflareSubdomainService $cloudflareSubdomainService,
    ) {
    }

    public function index(): View
    {
        $domains = SubdomainDomain::query()
            ->withCount('subdomains')
            ->orderBy('name')
            ->get();

        $enabled = filter_var(
            $this->settings->get('subdomains:enabled', config('subdomains.enabled') ? 'true' : 'false'),
            FILTER_VALIDATE_BOOLEAN
        );
        $defaultLimit = $this->settings->get('subdomains:default_limit');

        return view('admin.subdomains.index', [
            'domains' => $domains,
            'enabled' => $enabled,
            'defaultLimit' => $defaultLimit,
        ]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'enabled' => ['nullable', 'in:0,1'],
            'default_limit' => ['nullable', 'integer', 'min:0'],
        ]);

        $this->settings->set('subdomains:enabled', ($data['enabled'] ?? '0') === '1' ? 'true' : 'false');
        $this->settings->set('subdomains:default_limit', isset($data['default_limit']) ? (string) $data['default_limit'] : '');
        $this->alert->success('Subdomain extension settings updated.')->flash();

        return redirect()->route('admin.subdomains');
    }

    public function storeDomain(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:191', 'regex:/^(?=.{1,191}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i', 'unique:subdomain_domains,name'],
            'cloudflare_zone_id' => ['required', 'string', 'max:191'],
            'cloudflare_api_token' => ['required', 'string', 'max:4000'],
            'enabled' => ['nullable', 'in:0,1'],
        ]);

        try {
            $this->cloudflareSubdomainService->assertDomainCredentialsValid(
                trim($data['cloudflare_zone_id']),
                trim($data['cloudflare_api_token'])
            );
        } catch (DisplayException $exception) {
            $this->alert->danger('Cloudflare validation failed: ' . $exception->getMessage())->flash();

            return redirect()->route('admin.subdomains')->withInput();
        }

        SubdomainDomain::query()->create([
            'name' => strtolower(trim($data['name'])),
            'cloudflare_zone_id' => trim($data['cloudflare_zone_id']),
            'cloudflare_api_token' => trim($data['cloudflare_api_token']),
            'enabled' => ($data['enabled'] ?? '1') === '1',
        ]);

        $this->alert->success('Domain has been added.')->flash();

        return redirect()->route('admin.subdomains');
    }

    public function updateDomain(Request $request, SubdomainDomain $domain): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:191', 'regex:/^(?=.{1,191}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i', 'unique:subdomain_domains,name,' . $domain->id],
            'cloudflare_zone_id' => ['required', 'string', 'max:191'],
            'cloudflare_api_token' => ['nullable', 'string', 'max:4000'],
            'enabled' => ['nullable', 'in:0,1'],
        ]);

        $zoneId = trim($data['cloudflare_zone_id']);
        $token = !empty($data['cloudflare_api_token'])
            ? trim($data['cloudflare_api_token'])
            : (string) $domain->cloudflare_api_token;

        try {
            $this->cloudflareSubdomainService->assertDomainCredentialsValid($zoneId, $token);
        } catch (DisplayException $exception) {
            $this->alert->danger('Cloudflare validation failed: ' . $exception->getMessage())->flash();

            return redirect()->route('admin.subdomains')->withInput();
        }

        $payload = [
            'name' => strtolower(trim($data['name'])),
            'cloudflare_zone_id' => $zoneId,
            'enabled' => ($data['enabled'] ?? '0') === '1',
        ];

        if (!empty($data['cloudflare_api_token'])) {
            $payload['cloudflare_api_token'] = trim($data['cloudflare_api_token']);
        }

        $domain->update($payload);
        $this->alert->success('Domain has been updated.')->flash();

        return redirect()->route('admin.subdomains');
    }

    public function deleteDomain(SubdomainDomain $domain): RedirectResponse
    {
        if ($domain->subdomains()->count() > 0) {
            $this->alert->danger('Cannot delete a domain that still has subdomain records.')->flash();

            return redirect()->route('admin.subdomains');
        }

        $domain->delete();
        $this->alert->success('Domain has been deleted.')->flash();

        return redirect()->route('admin.subdomains');
    }
}
