@extends('layouts.admin')

@section('title')
    Theme
@endsection

@section('content-header')
    <h1>Theme<small>Configure global panel theme variables.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Theme</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12 col-lg-5">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Theme Colors</h3>
                </div>
                <form id="themeForm" action="{{ route('admin.theme.update') }}" method="POST">
                    <div class="box-body">
                        <div class="nav-tabs-custom nav-tabs-floating theme-editor-tabs-shell">
                            <ul class="nav nav-tabs" role="tablist">
                                <li role="presentation" class="active">
                                    <a href="#theme-tab-core" aria-controls="theme-tab-core" role="tab" data-toggle="tab">Core</a>
                                </li>
                                <li role="presentation">
                                    <a href="#theme-tab-surfaces" aria-controls="theme-tab-surfaces" role="tab" data-toggle="tab">Surfaces</a>
                                </li>
                                <li role="presentation">
                                    <a href="#theme-tab-text" aria-controls="theme-tab-text" role="tab" data-toggle="tab">Text & Links</a>
                                </li>
                                <li role="presentation">
                                    <a href="#theme-tab-states" aria-controls="theme-tab-states" role="tab" data-toggle="tab">States</a>
                                </li>
                                <li role="presentation">
                                    <a href="#theme-tab-navigation" aria-controls="theme-tab-navigation" role="tab" data-toggle="tab">Navigation</a>
                                </li>
                                <li role="presentation">
                                    <a href="#theme-tab-footer" aria-controls="theme-tab-footer" role="tab" data-toggle="tab">Footer</a>
                                </li>
                            </ul>
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane active" id="theme-tab-core">
                                <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'primary_content' => 'Primary',
                                            'secondary_content' => 'Secondary',
                                            'background_color' => 'Background',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'component_headers' => 'Component Headers',
                                            'sidebar_navigation' => 'Sidebar',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                                <div role="tabpanel" class="tab-pane" id="theme-tab-surfaces">
                                <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'card_background' => 'Card Background',
                                            'card_border' => 'Card Border',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'input_background' => 'Input Background',
                                            'input_border' => 'Input Border',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                                <div role="tabpanel" class="tab-pane" id="theme-tab-text">
                                <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'text_primary' => 'Text Primary',
                                            'text_muted' => 'Text Muted',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'link_color' => 'Link',
                                            'link_hover_color' => 'Link Hover',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                                <div role="tabpanel" class="tab-pane" id="theme-tab-states">
                                <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'success_color' => 'Success',
                                            'warning_color' => 'Warning',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'danger_color' => 'Danger',
                                            'info_color' => 'Info',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                                <div role="tabpanel" class="tab-pane" id="theme-tab-navigation">
                                <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'topbar_background' => 'Topbar Background',
                                            'topbar_text' => 'Topbar Text',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                                <div role="tabpanel" class="tab-pane" id="theme-tab-footer">
                                <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'footer_background' => 'Footer Background',
                                            'footer_text' => 'Footer Text',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-primary pull-right">Save Theme</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="col-xs-12 col-lg-7">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Live Preview</h3>
                </div>
                <div class="box-body">
                    <div class="theme-preview" id="themePreview">
                        <div class="theme-preview__topbar">
                            <div class="theme-preview__brand">Client Panel</div>
                            <a href="#" class="theme-preview__link">Account</a>
                        </div>
                        <div class="theme-preview__routebar">
                            <span class="theme-preview__route-label">Route:</span>
                            <code class="theme-preview__route-item active">/</code>
                            <code class="theme-preview__route-item">/server/alpha</code>
                            <code class="theme-preview__route-item">/account</code>
                        </div>
                        <div class="theme-preview__layout">
                            <aside class="theme-preview__sidebar">
                                <div class="theme-preview__sidebar-item active">Dashboard</div>
                                <div class="theme-preview__sidebar-item">Servers</div>
                                <div class="theme-preview__sidebar-item">Backups</div>
                                <div class="theme-preview__sidebar-item">Account</div>
                            </aside>
                            <main class="theme-preview__content">
                                <div class="theme-preview__server-row">
                                    <div>
                                        <strong>Survival</strong>
                                        <small>UUID: f3d2b64f</small>
                                    </div>
                                    <span class="theme-preview__state theme-preview__state--success">Running</span>
                                </div>
                                <div class="theme-preview__grid">
                                    <section class="theme-preview__card">
                                        <header class="theme-preview__card-header">Controls</header>
                                        <div class="theme-preview__card-body">
                                            <button type="button" class="theme-preview__btn theme-preview__btn--primary">Start</button>
                                            <button type="button" class="theme-preview__btn theme-preview__btn--neutral">Restart</button>
                                            <button type="button" class="theme-preview__btn theme-preview__btn--danger">Stop</button>
                                        </div>
                                    </section>
                                    <section class="theme-preview__card">
                                        <header class="theme-preview__card-header">Form</header>
                                        <div class="theme-preview__card-body">
                                            <input type="text" class="form-control theme-preview__input" value="SERVER_JARFILE" readonly />
                                            <input type="text" class="form-control theme-preview__input" value="server.jar" readonly />
                                            <a href="#" class="theme-preview__link theme-preview__inline-link">Open docs</a>
                                        </div>
                                    </section>
                                    <section class="theme-preview__card theme-preview__card--wide">
                                        <header class="theme-preview__card-header">Activity</header>
                                        <div class="theme-preview__card-body">
                                            <div class="theme-preview__alerts">
                                                <span class="theme-preview__badge success">Success</span>
                                                <span class="theme-preview__badge warning">Warning</span>
                                                <span class="theme-preview__badge danger">Danger</span>
                                                <span class="theme-preview__badge info">Info</span>
                                            </div>
                                            <table class="table theme-preview__table">
                                                <thead>
                                                    <tr><th>Event</th><th>Status</th></tr>
                                                </thead>
                                                <tbody>
                                                    <tr><td>Backup finished</td><td>OK</td></tr>
                                                    <tr><td>Server reinstall</td><td>Queued</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </div>
                            </main>
                        </div>
                        <div class="theme-preview__footer">
                            Footer preview · <a href="#" class="theme-preview__link">Status Page</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .theme-editor-tabs-shell > .nav-tabs {
            display: flex;
            flex-wrap: wrap;
        }
        .theme-editor-tabs-shell > .nav-tabs > li {
            float: none;
        }
        .theme-editor-tabs-shell > .tab-content {
            background: var(--theme-card-background);
            border-top: 1px solid var(--theme-card-border);
            padding: 12px;
        }
        .theme-editor-tabs-shell > .tab-content > .tab-pane {
            background: transparent;
        }
        .theme-editor-tabs-shell .form-group > label {
            color: var(--theme-text-muted);
            font-weight: 600;
        }
        .theme-editor-tabs-shell .form-control[type="color"] {
            background: var(--theme-input-background);
            border-color: var(--theme-input-border);
            height: 34px;
            padding: 4px 6px;
        }
        .theme-preview {
            border: 1px solid var(--theme-card-border);
            border-radius: 14px;
            overflow: hidden;
            background: var(--theme-background);
            color: var(--theme-text-muted);
        }
        .theme-preview__topbar {
            background: var(--theme-topbar-background);
            color: var(--theme-topbar-text);
            border-bottom: 1px solid var(--theme-card-border);
            padding: 10px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .theme-preview__brand {
            font-weight: 700;
            color: var(--theme-topbar-text);
        }
        .theme-preview__link {
            color: var(--theme-link);
            text-decoration: none;
        }
        .theme-preview__link:hover {
            color: var(--theme-link-hover);
        }
        .theme-preview__routebar {
            background: color-mix(in srgb, var(--theme-component-headers) 78%, transparent);
            border-bottom: 1px solid var(--theme-card-border);
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .theme-preview__route-label {
            color: var(--theme-text-muted);
            font-size: 12px;
            font-weight: 600;
        }
        .theme-preview__route-item {
            display: inline-block;
            font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
            font-size: 12px;
            padding: 3px 8px;
            border-radius: 999px;
            background: color-mix(in srgb, var(--theme-background) 82%, transparent);
            border: 1px solid var(--theme-card-border);
            color: var(--theme-text-muted);
        }
        .theme-preview__route-item.active {
            color: var(--theme-primary-content);
            border-color: color-mix(in srgb, var(--theme-primary-content) 45%, transparent);
            background: color-mix(in srgb, var(--theme-primary-content) 14%, transparent);
        }
        .theme-preview__layout {
            display: flex;
            min-height: 560px;
        }
        .theme-preview__sidebar {
            width: 180px;
            background: var(--theme-sidebar);
            border-right: 1px solid var(--theme-card-border);
            padding: 12px;
        }
        .theme-preview__sidebar-item {
            padding: 8px 10px;
            border-radius: 8px;
            margin-bottom: 6px;
            color: var(--theme-text-muted);
            font-weight: 600;
        }
        .theme-preview__sidebar-item.active {
            background: color-mix(in srgb, var(--theme-sidebar) 72%, var(--theme-primary-content) 28%);
            color: var(--theme-primary-content);
        }
        .theme-preview__content {
            flex: 1;
            padding: 12px;
            background: var(--theme-background);
        }
        .theme-preview__server-row {
            border: 1px solid var(--theme-card-border);
            background: var(--theme-card-background);
            border-radius: 10px;
            padding: 10px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .theme-preview__server-row strong {
            display: block;
            color: var(--theme-text-primary);
            line-height: 1.2;
        }
        .theme-preview__server-row small {
            color: var(--theme-text-muted);
            font-size: 12px;
        }
        .theme-preview__state {
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 700;
            border: 1px solid transparent;
        }
        .theme-preview__state--success {
            color: #fff;
            background: var(--theme-success);
            border-color: color-mix(in srgb, var(--theme-success) 78%, #000 22%);
        }
        .theme-preview__grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }
        .theme-preview__card {
            border: 1px solid var(--theme-card-border);
            border-radius: 12px;
            overflow: hidden;
            background: var(--theme-card-background);
        }
        .theme-preview__card--wide {
            grid-column: span 2;
        }
        .theme-preview__card-header {
            background: var(--theme-component-headers);
            color: var(--theme-text-primary);
            padding: 10px 12px;
            font-weight: 700;
            border-bottom: 1px solid var(--theme-card-border);
        }
        .theme-preview__card-body {
            padding: 12px;
            color: var(--theme-text-muted);
        }
        .theme-preview__btn {
            border: 1px solid transparent;
            border-radius: 8px;
            padding: 6px 10px;
            font-weight: 700;
            font-size: 12px;
            margin-right: 8px;
            color: #fff;
            background: var(--theme-component-headers);
            border-color: var(--theme-card-border);
        }
        .theme-preview__btn--primary {
            background: var(--theme-primary-content);
            border-color: color-mix(in srgb, var(--theme-primary-content) 82%, #000 18%);
        }
        .theme-preview__btn--danger {
            background: var(--theme-danger);
            border-color: color-mix(in srgb, var(--theme-danger) 82%, #000 18%);
        }
        .theme-preview__btn--neutral {
            color: var(--theme-text-primary);
            background: color-mix(in srgb, var(--theme-component-headers) 78%, transparent);
            border-color: var(--theme-card-border);
        }
        .theme-preview__input {
            background: var(--theme-input-background) !important;
            border-color: var(--theme-input-border) !important;
            color: var(--theme-text-primary) !important;
            margin-bottom: 8px;
        }
        .theme-preview__inline-link {
            display: inline-block;
            margin-top: 4px;
            font-weight: 600;
        }
        .theme-preview__alerts {
            margin-bottom: 10px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .theme-preview__badge {
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 12px;
            color: #fff;
            font-weight: 700;
            letter-spacing: .01em;
        }
        .theme-preview__badge.success { background: var(--theme-success); }
        .theme-preview__badge.warning { background: var(--theme-warning); }
        .theme-preview__badge.danger { background: var(--theme-danger); }
        .theme-preview__badge.info { background: var(--theme-info); }
        .theme-preview__table {
            margin-bottom: 0;
            color: var(--theme-text-muted);
        }
        .theme-preview__table > thead > tr > th,
        .theme-preview__table > tbody > tr > td {
            border-color: var(--theme-card-border);
        }
        .theme-preview__table > tbody > tr:hover {
            background: color-mix(in srgb, var(--theme-background) 82%, var(--theme-primary-content) 18%);
        }
        .theme-preview__footer {
            border-top: 1px solid var(--theme-card-border);
            background: var(--theme-footer-background);
            color: var(--theme-footer-text);
            padding: 10px 12px;
            font-size: 12px;
        }
        @media (max-width: 991px) {
            .theme-preview__layout {
                flex-direction: column;
                min-height: 0;
            }
            .theme-preview__sidebar {
                width: auto;
                border-right: 0;
                border-bottom: 1px solid var(--theme-card-border);
            }
            .theme-preview__grid {
                grid-template-columns: 1fr;
            }
            .theme-preview__card--wide {
                grid-column: span 1;
            }
        }
    </style>

@endsection

@section('footer-scripts')
    @parent
    <script>
        (function () {
            var map = {
                primary_content: '--theme-primary-content',
                secondary_content: '--theme-secondary-content',
                background_color: '--theme-background',
                component_headers: '--theme-component-headers',
                sidebar_navigation: '--theme-sidebar',
                success_color: '--theme-success',
                warning_color: '--theme-warning',
                danger_color: '--theme-danger',
                info_color: '--theme-info',
                text_primary: '--theme-text-primary',
                text_muted: '--theme-text-muted',
                link_color: '--theme-link',
                link_hover_color: '--theme-link-hover',
                card_background: '--theme-card-background',
                card_border: '--theme-card-border',
                input_background: '--theme-input-background',
                input_border: '--theme-input-border',
                topbar_background: '--theme-topbar-background',
                topbar_text: '--theme-topbar-text',
                footer_background: '--theme-footer-background',
                footer_text: '--theme-footer-text'
            };

            var initPreview = function () {
                var inputs = Array.prototype.slice.call(document.querySelectorAll('.js-theme-input'));
                if (!inputs.length) return;

                var rootEl = document.documentElement;
                var bodyEl = document.body;
                var preview = document.getElementById('themePreview');

                var applyVariablesTo = function (el) {
                    if (!el) return;
                    inputs.forEach(function (input) {
                        var variable = map[input.name];
                        if (!variable) return;
                        el.style.setProperty(variable, input.value);
                    });
                };

                var applyTheme = function () {
                    applyVariablesTo(rootEl);
                    applyVariablesTo(bodyEl);
                    applyVariablesTo(preview);
                };

                inputs.forEach(function (input) {
                    input.addEventListener('input', applyTheme);
                    input.addEventListener('change', applyTheme);
                });

                applyTheme();
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initPreview);
            } else {
                initPreview();
            }
        })();
    </script>
@endsection
