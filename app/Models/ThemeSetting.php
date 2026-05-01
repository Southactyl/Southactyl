<?php

namespace Pterodactyl\Models;

/**
 * Pterodactyl\Models\ThemeSetting.
 *
 * @property int $id
 * @property string $primary_content
 * @property string $secondary_content
 * @property string $background_color
 * @property string $component_headers
 * @property string $sidebar_navigation
 * @property string $success_color
 * @property string $warning_color
 * @property string $danger_color
 * @property string $info_color
 * @property string $text_primary
 * @property string $text_muted
 * @property string $link_color
 * @property string $link_hover_color
 * @property string $card_background
 * @property string $card_border
 * @property string $input_background
 * @property string $input_border
 * @property string $topbar_background
 * @property string $topbar_text
 * @property string $footer_background
 * @property string $footer_text
 * @property string $dashboard_panel_background
 * @property string $dashboard_panel_border
 * @property string $dashboard_stat_background
 * @property string $dashboard_stat_border
 * @property string $dashboard_search_background
 * @property string $dashboard_search_border
 * @property string $dashboard_online_text
 * @property string $dashboard_offline_text
 * @property string $sidebar_text
 * @property string $sidebar_text_active
 * @property string $sidebar_section_text
 * @property string $sidebar_footer_text
 * @property string $sidebar_active_background
 * @property string $sidebar_icon_background
 * @property string $sidebar_hover_background
 * @property bool $is_active
 */
class ThemeSetting extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'theme_settings';

    protected $fillable = [
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
        'text_muted',
        'link_color',
        'link_hover_color',
        'card_background',
        'card_border',
        'input_background',
        'input_border',
        'topbar_background',
        'topbar_text',
        'footer_background',
        'footer_text',
        'dashboard_panel_background',
        'dashboard_panel_border',
        'dashboard_stat_background',
        'dashboard_stat_border',
        'dashboard_search_background',
        'dashboard_search_border',
        'dashboard_online_text',
        'dashboard_offline_text',
        'sidebar_text',
        'sidebar_text_active',
        'sidebar_section_text',
        'sidebar_footer_text',
        'sidebar_active_background',
        'sidebar_icon_background',
        'sidebar_hover_background',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'bool',
    ];

    public static array $validationRules = [
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
        'is_active' => ['required', 'boolean'],
    ];
}
