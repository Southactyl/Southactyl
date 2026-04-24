<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\User;
use Pterodactyl\Models\ServerGroup;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Models\ServerGroupServer;
use Illuminate\Database\Eloquent\Builder;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;
use Pterodactyl\Http\Requests\Api\Client\ServerGroups\GetServerGroupsRequest;
use Pterodactyl\Http\Requests\Api\Client\ServerGroups\StoreServerGroupRequest;
use Pterodactyl\Http\Requests\Api\Client\ServerGroups\UpdateServerGroupRequest;
use Pterodactyl\Http\Requests\Api\Client\ServerGroups\DeleteServerGroupRequest;
use Pterodactyl\Http\Requests\Api\Client\ServerGroups\SortServerGroupsRequest;
use Pterodactyl\Http\Requests\Api\Client\ServerGroups\AttachServerGroupServerRequest;
use Pterodactyl\Http\Requests\Api\Client\ServerGroups\SortServerGroupServersRequest;

class ServerGroupController extends ClientApiController
{
    public function index(GetServerGroupsRequest $request): JsonResponse
    {
        $user = $request->user();

        $groups = $user->serverGroups()
            ->with(['groupServers' => fn ($query) => $query->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();
        $accessibleIds = $this->getAccessibleServerIds($user);

        return new JsonResponse([
            'object' => 'list',
            'data' => $groups->map(fn (ServerGroup $group) => $this->transformGroup($group, $accessibleIds))->values(),
        ]);
    }

    /**
     * @throws DisplayException
     */
    public function store(StoreServerGroupRequest $request): JsonResponse
    {
        $user = $request->user();

        $group = DB::transaction(function () use ($user, $request) {
            $nextSort = ((int) $user->serverGroups()->max('sort_order')) + 1;

            return $user->serverGroups()->create([
                'name' => trim((string) $request->input('name')),
                'color' => $request->filled('color') ? strtoupper((string) $request->input('color')) : null,
                'sort_order' => $request->filled('sort_order') ? (int) $request->integer('sort_order') : $nextSort,
                'is_locked' => $request->boolean('is_locked', false),
            ]);
        });
        $accessibleIds = $this->getAccessibleServerIds($user);

        return new JsonResponse([
            'object' => 'server_group',
            'attributes' => $this->transformGroup($group->fresh('groupServers'), $accessibleIds),
        ], JsonResponse::HTTP_CREATED);
    }

    public function update(UpdateServerGroupRequest $request, int $group): JsonResponse
    {
        $model = $this->getOwnedGroup($request, $group);

        $model->fill([
            'name' => $request->filled('name') ? trim((string) $request->input('name')) : $model->name,
            'color' => $request->has('color')
                ? ($request->filled('color') ? strtoupper((string) $request->input('color')) : null)
                : $model->color,
            'sort_order' => $request->filled('sort_order') ? (int) $request->integer('sort_order') : $model->sort_order,
            'is_locked' => $request->has('is_locked') ? $request->boolean('is_locked') : $model->is_locked,
        ]);
        $model->save();
        $accessibleIds = $this->getAccessibleServerIds($request->user());

        return new JsonResponse([
            'object' => 'server_group',
            'attributes' => $this->transformGroup($model->fresh('groupServers'), $accessibleIds),
        ]);
    }

    public function delete(DeleteServerGroupRequest $request, int $group): JsonResponse
    {
        $model = $this->getOwnedGroup($request, $group);
        $model->delete();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    /**
     * @throws DisplayException
     */
    public function attachServer(AttachServerGroupServerRequest $request, int $group): JsonResponse
    {
        $model = $this->getOwnedGroup($request, $group);
        if ($model->is_locked) {
            throw new DisplayException('This group is locked. Unlock it before editing membership.');
        }
        $server = $this->resolveAccessibleServer($request->user(), (string) $request->input('server_id'));
        if (!$server) {
            throw new DisplayException('The selected server is not accessible.');
        }

        $exists = $model->groupServers()->where('server_id', $server->id)->exists();
        if ($exists) {
            throw new DisplayException('This server is already in the selected group.');
        }

        DB::transaction(function () use ($model, $server) {
            $nextSort = ((int) $model->groupServers()->max('sort_order')) + 1;
            $model->groupServers()->create([
                'server_id' => $server->id,
                'sort_order' => $nextSort,
            ]);
        });
        $accessibleIds = $this->getAccessibleServerIds($request->user());

        return new JsonResponse([
            'object' => 'server_group',
            'attributes' => $this->transformGroup($model->fresh('groupServers'), $accessibleIds),
        ]);
    }

    /**
     * @throws DisplayException
     */
    public function detachServer(DeleteServerGroupRequest $request, int $group, string $serverRef): JsonResponse
    {
        $model = $this->getOwnedGroup($request, $group);
        if ($model->is_locked) {
            throw new DisplayException('This group is locked. Unlock it before editing membership.');
        }
        $resolved = $this->resolveAccessibleServer($request->user(), $serverRef);
        if (!$resolved) {
            throw new DisplayException('The selected server is not accessible.');
        }

        $model->groupServers()->where('server_id', $resolved->id)->delete();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    public function sort(SortServerGroupsRequest $request, int $group): JsonResponse
    {
        $target = $this->getOwnedGroup($request, $group);
        $ids = collect($request->input('group_ids', []))
            ->map(fn ($value) => (int) $value)
            ->filter()
            ->values();

        if (!$ids->contains($target->id)) {
            $ids->prepend($target->id);
        }

        $ownedIds = $request->user()->serverGroups()->whereIn('id', $ids->all())->pluck('id');
        DB::transaction(function () use ($ids, $ownedIds) {
            $sort = 1;
            foreach ($ids as $id) {
                if (!$ownedIds->contains($id)) {
                    continue;
                }

                ServerGroup::query()->where('id', $id)->update(['sort_order' => $sort++]);
            }
        });

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    public function sortServers(SortServerGroupServersRequest $request, int $group): JsonResponse
    {
        $model = $this->getOwnedGroup($request, $group);
        if ($model->is_locked) {
            throw new DisplayException('This group is locked. Unlock it before reordering servers.');
        }
        $accessible = $request->user()->accessibleServers()->pluck('servers.id');

        $inputServerIds = collect($request->input('server_ids', []))
            ->map(fn ($value) => $this->resolveAccessibleServer($request->user(), (string) $value)?->id)
            ->filter()
            ->map(fn ($value) => (int) $value)
            ->unique()
            ->values();

        DB::transaction(function () use ($model, $accessible, $inputServerIds) {
            $current = $model->groupServers()->whereIn('server_id', $accessible->all())->pluck('server_id');
            $ordered = $inputServerIds->filter(fn ($id) => $current->contains($id));

            $sort = 1;
            foreach ($ordered as $serverId) {
                ServerGroupServer::query()
                    ->where('server_group_id', $model->id)
                    ->where('server_id', $serverId)
                    ->update(['sort_order' => $sort++]);
            }
        });

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    private function getOwnedGroup(ClientApiRequest $request, int $id): ServerGroup
    {
        return $request->user()->serverGroups()->whereKey($id)->firstOrFail();
    }

    private function resolveAccessibleServer(\Pterodactyl\Models\User $user, string $serverInput): ?Server
    {
        $query = $user->accessibleServers();

        if (ctype_digit($serverInput)) {
            return $query->where('servers.id', (int) $serverInput)->first();
        }

        return $query
            ->where(function (Builder $builder) use ($serverInput) {
                if (str_starts_with($serverInput, 'serv_')) {
                    $builder->whereIdentifier($serverInput);

                    return;
                }

                $builder->where(strlen($serverInput) === 8 ? 'servers.uuidShort' : 'servers.uuid', $serverInput);
            })
            ->first();
    }

    private function transformGroup(ServerGroup $group, Collection $accessibleServerIds): array
    {
        $memberships = $group->groupServers
            ->filter(fn (ServerGroupServer $pivot) => $accessibleServerIds->contains($pivot->server_id))
            ->sortBy('sort_order')
            ->values();

        return [
            'id' => $group->id,
            'name' => $group->name,
            'color' => $group->color,
            'sort_order' => $group->sort_order,
            'is_locked' => $group->is_locked,
            'server_count' => $memberships->count(),
            'servers' => $memberships->map(fn (ServerGroupServer $pivot) => [
                'server_id' => $pivot->server_id,
                'sort_order' => $pivot->sort_order,
            ])->values(),
        ];
    }

    private function getAccessibleServerIds(User $user): Collection
    {
        return $user->accessibleServers()->pluck('servers.id');
    }
}
