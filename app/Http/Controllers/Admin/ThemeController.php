<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Services\Themes\ThemeService;

class ThemeController extends Controller
{
    /**
     * ThemeController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private ThemeService $themes,
    ) {
    }

    /**
     * Render the admin theme editor.
     */
    public function index(): View
    {
        return view('admin.theme.index', [
            'theme' => $this->themes->getActiveTheme(),
        ]);
    }

    /**
     * Persist the active theme values.
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'primary_content' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'secondary_content' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'background_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'component_headers' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sidebar_navigation' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'success_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'warning_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'danger_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'info_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'text_primary' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'text_muted' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'link_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'link_hover_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'card_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'card_border' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'input_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'input_border' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'topbar_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'topbar_text' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'footer_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'footer_text' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'dashboard_panel_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'dashboard_panel_border' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'dashboard_stat_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'dashboard_stat_border' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'dashboard_search_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'dashboard_search_border' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'dashboard_online_text' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'dashboard_offline_text' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sidebar_text' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sidebar_text_active' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sidebar_section_text' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sidebar_footer_text' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sidebar_active_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sidebar_icon_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sidebar_hover_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $this->themes->saveActiveTheme($data);
        $this->alert->success('Theme settings saved successfully.')->flash();

        return redirect()->route('admin.theme');
    }
}
