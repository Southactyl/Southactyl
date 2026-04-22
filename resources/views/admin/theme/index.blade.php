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
                        <div class="row">
                            <div class="col-xs-12 col-md-6">
                                <h4 class="no-margin-top">Core</h4>
                                @foreach ([
                                    'primary_content' => 'Primary',
                                    'secondary_content' => 'Secondary',
                                    'background_color' => 'Background',
                                    'component_headers' => 'Component Headers',
                                    'sidebar_navigation' => 'Sidebar',
                                ] as $key => $label)
                                    <div class="form-group">
                                        <label for="{{ $key }}">{{ $label }}</label>
                                        <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                    </div>
                                @endforeach
                            </div>
                            <div class="col-xs-12 col-md-6">
                                <h4 class="no-margin-top">State</h4>
                                @foreach ([
                                    'success_color' => 'Success',
                                    'warning_color' => 'Warning',
                                    'danger_color' => 'Danger',
                                    'info_color' => 'Info',
                                ] as $key => $label)
                                    <div class="form-group">
                                        <label for="{{ $key }}">{{ $label }}</label>
                                        <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                    </div>
                                @endforeach
                            </div>
                            <div class="col-xs-12 col-md-6">
                                <h4>Text & Links</h4>
                                @foreach ([
                                    'text_primary' => 'Text Primary',
                                    'text_muted' => 'Text Muted',
                                    'link_color' => 'Link',
                                    'link_hover_color' => 'Link Hover',
                                ] as $key => $label)
                                    <div class="form-group">
                                        <label for="{{ $key }}">{{ $label }}</label>
                                        <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                    </div>
                                @endforeach
                            </div>
                            <div class="col-xs-12 col-md-6">
                                <h4>Cards & Inputs</h4>
                                @foreach ([
                                    'card_background' => 'Card Background',
                                    'card_border' => 'Card Border',
                                    'input_background' => 'Input Background',
                                    'input_border' => 'Input Border',
                                ] as $key => $label)
                                    <div class="form-group">
                                        <label for="{{ $key }}">{{ $label }}</label>
                                        <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                    </div>
                                @endforeach
                            </div>
                            <div class="col-xs-12 col-md-6">
                                <h4>Topbar</h4>
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
                            <div class="col-xs-12 col-md-6">
                                <h4>Footer</h4>
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
                            <span>Header</span>
                            <a href="#" class="theme-preview__link">Sample Link</a>
                        </div>
                        <div class="theme-preview__layout">
                            <aside class="theme-preview__sidebar">
                                <div class="theme-preview__sidebar-item active">Dashboard</div>
                                <div class="theme-preview__sidebar-item">Settings</div>
                                <div class="theme-preview__sidebar-item">Servers</div>
                            </aside>
                            <main class="theme-preview__content">
                                <div class="theme-preview__card">
                                    <div class="theme-preview__card-header">Component Header</div>
                                    <div class="theme-preview__card-body">
                                        <input type="text" class="form-control theme-preview__input" placeholder="Form input" readonly />
                                        <div class="theme-preview__alerts">
                                            <span class="theme-preview__badge success">Success</span>
                                            <span class="theme-preview__badge warning">Warning</span>
                                            <span class="theme-preview__badge danger">Danger</span>
                                            <span class="theme-preview__badge info">Info</span>
                                        </div>
                                        <table class="table theme-preview__table">
                                            <thead>
                                            <tr><th>Status</th><th>Row</th></tr>
                                            </thead>
                                            <tbody>
                                            <tr><td>Active</td><td>Default table state</td></tr>
                                            <tr><td>Hover</td><td>Move cursor here</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
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
        .theme-preview__link {
            color: var(--theme-link);
            text-decoration: none;
        }
        .theme-preview__layout {
            display: flex;
            min-height: 310px;
        }
        .theme-preview__sidebar {
            width: 170px;
            background: var(--theme-sidebar);
            border-right: 1px solid var(--theme-card-border);
            padding: 10px;
        }
        .theme-preview__sidebar-item {
            padding: 8px 10px;
            border-radius: 8px;
            margin-bottom: 6px;
            color: var(--theme-text-muted);
        }
        .theme-preview__sidebar-item.active {
            background: rgba(59, 130, 246, 0.16);
            color: var(--theme-primary-content);
            font-weight: 600;
        }
        .theme-preview__content {
            flex: 1;
            padding: 12px;
            background: var(--theme-background);
        }
        .theme-preview__card {
            border: 1px solid var(--theme-card-border);
            border-radius: 12px;
            overflow: hidden;
            background: var(--theme-card-background);
        }
        .theme-preview__card-header {
            background: var(--theme-component-headers);
            color: var(--theme-text-primary);
            padding: 10px 12px;
            font-weight: 600;
        }
        .theme-preview__card-body {
            padding: 12px;
            color: var(--theme-text-muted);
        }
        .theme-preview__input {
            background: var(--theme-input-background) !important;
            border-color: var(--theme-input-border) !important;
            color: var(--theme-text-primary) !important;
        }
        .theme-preview__alerts {
            margin-top: 10px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .theme-preview__badge {
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 12px;
            color: #fff;
            font-weight: 600;
            letter-spacing: .01em;
        }
        .theme-preview__badge.success { background: var(--theme-success); }
        .theme-preview__badge.warning { background: var(--theme-warning); }
        .theme-preview__badge.danger { background: var(--theme-danger); }
        .theme-preview__badge.info { background: var(--theme-info); }
        .theme-preview__table {
            margin-top: 12px;
            color: var(--theme-text-muted);
        }
        .theme-preview__table > thead > tr > th,
        .theme-preview__table > tbody > tr > td {
            border-color: var(--theme-card-border);
        }
        .theme-preview__table > tbody > tr:hover {
            background: rgba(59, 130, 246, 0.12);
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

                var bodyEl = document.body;
                var preview = document.getElementById('themePreview');

                var applyTheme = function () {
                    inputs.forEach(function (input) {
                        var variable = map[input.name];
                        if (!variable) return;
                        bodyEl.style.setProperty(variable, input.value);
                        if (preview) preview.style.setProperty(variable, input.value);
                    });
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
