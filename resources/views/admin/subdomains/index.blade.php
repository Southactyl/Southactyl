@extends('layouts.admin')

@section('title')
    Subdomains
@endsection

@section('content-header')
    <h1>Subdomains<small>Manage extension state and Cloudflare domain credentials.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Subdomains</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12 col-lg-4">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Extension</h3>
                </div>
                <form action="{{ route('admin.subdomains.settings') }}" method="POST">
                    <div class="box-body">
                        {!! csrf_field() !!}
                        <input type="hidden" name="_method" value="PATCH">
                        <div class="form-group">
                            <label for="pEnabled">Subdomain Management</label>
                            <select name="enabled" id="pEnabled" class="form-control">
                                <option value="1" @if($enabled) selected @endif>Enabled</option>
                                <option value="0" @if(!$enabled) selected @endif>Disabled</option>
                            </select>
                            <p class="text-muted small">When disabled, client sidebar entry is hidden and subdomain routes are unavailable.</p>
                        </div>
                        <div class="form-group">
                            <label for="pDefaultLimit">Default Subdomain Limit</label>
                            <input
                                type="number"
                                min="0"
                                name="default_limit"
                                id="pDefaultLimit"
                                class="form-control"
                                value="{{ old('default_limit', $defaultLimit) }}"
                                placeholder="Leave empty for unlimited"
                            />
                            <p class="text-muted small">Global default per-server subdomain limit. Individual servers can override this in Build settings.</p>
                        </div>
                    </div>
                    <div class="box-footer">
                        <button type="submit" class="btn btn-primary pull-right">Save</button>
                    </div>
                </form>
            </div>

            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Add Domain</h3>
                </div>
                <form action="{{ route('admin.subdomains.domains.store') }}" method="POST">
                    <div class="box-body">
                        {!! csrf_field() !!}
                        <div class="form-group">
                            <label for="pName">Domain Name</label>
                            <input type="text" name="name" id="pName" class="form-control" placeholder="example.com" required />
                        </div>
                        <div class="form-group">
                            <label for="pZone">Cloudflare Zone ID</label>
                            <input type="text" name="cloudflare_zone_id" id="pZone" class="form-control" required />
                        </div>
                        <div class="form-group">
                            <label for="pToken">Cloudflare API Token</label>
                            <textarea name="cloudflare_api_token" id="pToken" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="pDomainEnabled">Status</label>
                            <select name="enabled" id="pDomainEnabled" class="form-control">
                                <option value="1" selected>Enabled</option>
                                <option value="0">Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="box-footer">
                        <button type="submit" class="btn btn-success pull-right">Create</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="col-xs-12 col-lg-8">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Domains</h3>
                </div>
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Domain</th>
                            <th>Zone ID</th>
                            <th>Status</th>
                            <th>Records</th>
                            <th style="width: 220px;">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        @forelse($domains as $domain)
                            <tr>
                                <td><code>{{ $domain->id }}</code></td>
                                <td><code>{{ $domain->name }}</code></td>
                                <td><code>{{ $domain->cloudflare_zone_id }}</code></td>
                                <td>
                                    @if($domain->enabled)
                                        <span class="label label-success">Enabled</span>
                                    @else
                                        <span class="label label-default">Disabled</span>
                                    @endif
                                </td>
                                <td>{{ $domain->subdomains_count }}</td>
                                <td>
                                    <button class="btn btn-xs btn-primary" data-toggle="modal" data-target="#edit-domain-{{ $domain->id }}">Edit</button>
                                    <form action="{{ route('admin.subdomains.domains.delete', $domain->id) }}" method="POST" style="display:inline-block;">
                                        {!! csrf_field() !!}
                                        <input type="hidden" name="_method" value="DELETE">
                                        <button type="submit" class="btn btn-xs btn-danger" @if($domain->subdomains_count > 0) disabled @endif>Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center text-muted">No domains configured.</td>
                            </tr>
                        @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    @foreach($domains as $domain)
        <div class="modal fade" id="edit-domain-{{ $domain->id }}" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form action="{{ route('admin.subdomains.domains.update', $domain->id) }}" method="POST">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Edit Domain</h4>
                        </div>
                        <div class="modal-body">
                            {!! csrf_field() !!}
                            <input type="hidden" name="_method" value="PATCH">

                            <div class="form-group">
                                <label>Domain Name</label>
                                <input type="text" name="name" class="form-control" value="{{ $domain->name }}" required />
                            </div>
                            <div class="form-group">
                                <label>Cloudflare Zone ID</label>
                                <input type="text" name="cloudflare_zone_id" class="form-control" value="{{ $domain->cloudflare_zone_id }}" required />
                            </div>
                            <div class="form-group">
                                <label>Cloudflare API Token</label>
                                <textarea name="cloudflare_api_token" class="form-control" rows="3" placeholder="Leave empty to keep existing token"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Status</label>
                                <select name="enabled" class="form-control">
                                    <option value="1" @if($domain->enabled) selected @endif>Enabled</option>
                                    <option value="0" @if(!$domain->enabled) selected @endif>Disabled</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default btn-sm pull-left" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary btn-sm">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endforeach
@endsection
