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
                    <p class="text-muted" style="margin-top: 6px; margin-bottom: 0;">Set core colors only. Other colors auto-generate from blends.</p>
                    <div class="form-group" style="margin-top: 10px; margin-bottom: 0; max-width: 220px;">
                        <label for="theme_mode" style="margin-bottom: 4px;">Theme Mode</label>
                        <select id="theme_mode" name="theme_mode" class="form-control">
                            <option value="simple" {{ old('theme_mode', 'simple') === 'simple' ? 'selected' : '' }}>Simple</option>
                            <option value="advanced" {{ old('theme_mode') === 'advanced' ? 'selected' : '' }}>Advanced</option>
                        </select>
                    </div>
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
                                <li role="presentation">
                                    <a href="#theme-tab-dashboard" aria-controls="theme-tab-dashboard" role="tab" data-toggle="tab">Dashboard</a>
                                </li>
                                <li role="presentation">
                                    <a href="#theme-tab-sidebar" aria-controls="theme-tab-sidebar" role="tab" data-toggle="tab">Sidebar</a>
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
                                <div role="tabpanel" class="tab-pane" id="theme-tab-dashboard">
                                <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'dashboard_panel_background' => 'Panel Background',
                                            'dashboard_panel_border' => 'Panel Border',
                                            'dashboard_stat_background' => 'Stat Card Background',
                                            'dashboard_stat_border' => 'Stat Card Border',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'dashboard_search_background' => 'Search Background',
                                            'dashboard_search_border' => 'Search Border',
                                            'dashboard_online_text' => 'Online Text',
                                            'dashboard_offline_text' => 'Offline Text',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                                <div role="tabpanel" class="tab-pane" id="theme-tab-sidebar">
                                <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'sidebar_text' => 'Sidebar Text',
                                            'sidebar_text_active' => 'Sidebar Active Text',
                                            'sidebar_section_text' => 'Sidebar Section Label',
                                            'sidebar_footer_text' => 'Sidebar Footer Text',
                                        ] as $key => $label)
                                            <div class="form-group">
                                                <label for="{{ $key }}">{{ $label }}</label>
                                                <input id="{{ $key }}" name="{{ $key }}" type="color" class="form-control js-theme-input" value="{{ old($key, $theme[$key]) }}" />
                                            </div>
                                        @endforeach
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        @foreach ([
                                            'sidebar_active_background' => 'Sidebar Active Background',
                                            'sidebar_icon_background' => 'Sidebar Icon Background',
                                            'sidebar_hover_background' => 'Sidebar Hover Background',
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
            background: color-mix(in srgb, var(--theme-sidebar) 72%, var(--theme-primary-content) 28%);
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
            background: color-mix(in srgb, var(--theme-background) 82%, var(--theme-primary-content) 18%);
        }
    </style>

@endsection

@section('footer-scripts')
    @parent
    <script>
        (function () {
            var editableKeys = [
                'primary_content',
                'secondary_content',
                'background_color',
                'component_headers',
                'sidebar_navigation',
                'success_color',
                'warning_color',
                'danger_color',
                'info_color',
                'text_primary',
                'text_muted'
            ];
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
                footer_text: '--theme-footer-text',
                dashboard_panel_background: '--theme-dashboard-panel-background',
                dashboard_panel_border: '--theme-dashboard-panel-border',
                dashboard_stat_background: '--theme-dashboard-stat-background',
                dashboard_stat_border: '--theme-dashboard-stat-border',
                dashboard_search_background: '--theme-dashboard-search-background',
                dashboard_search_border: '--theme-dashboard-search-border',
                dashboard_online_text: '--theme-dashboard-online-text',
                dashboard_offline_text: '--theme-dashboard-offline-text',
                sidebar_text: '--theme-sidebar-text',
                sidebar_text_active: '--theme-sidebar-text-active',
                sidebar_section_text: '--theme-sidebar-section-text',
                sidebar_footer_text: '--theme-sidebar-footer-text',
                sidebar_active_background: '--theme-sidebar-active-background',
                sidebar_icon_background: '--theme-sidebar-icon-background',
                sidebar_hover_background: '--theme-sidebar-hover-background'
            };

            var initPreview = function () {
                var inputs = Array.prototype.slice.call(document.querySelectorAll('.js-theme-input'));
                if (!inputs.length) return;
                var modeSelect = document.getElementById('theme_mode');

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

                var applyMode = function () {
                    var mode = modeSelect && modeSelect.value === 'advanced' ? 'advanced' : 'simple';
                    inputs.forEach(function (input) {
                        var isCore = editableKeys.indexOf(input.name) !== -1;
                        var shouldDisable = mode === 'simple' && !isCore;
                        if (shouldDisable) {
                            input.setAttribute('disabled', 'disabled');
                        } else {
                            input.removeAttribute('disabled');
                        }
                        var group = input.closest('.form-group');
                        if (group) {
                            group.style.opacity = shouldDisable ? '0.45' : '1';
                        }
                    });
                };

                if (modeSelect) {
                    modeSelect.addEventListener('change', applyMode);
                }

                applyMode();
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
