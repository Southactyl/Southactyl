<?php

namespace Pterodactyl\Services\Themes;

use Illuminate\Database\QueryException;
use Pterodactyl\Repositories\ThemeSettingRepository;

class ThemeService
{
    public const DEFAULT_THEME = [
        'primary_content' => '#3d8bff',
        'secondary_content' => '#9bb0d0',
        'background_color' => '#050b1a',
        'component_headers' => '#0b162b',
        'sidebar_navigation' => '#030b1f',
        'success_color' => '#22c55e',
        'warning_color' => '#f59e0b',
        'danger_color' => '#ef4444',
        'info_color' => '#38bdf8',
        'text_primary' => '#eaf2ff',
        'text_muted' => '#9bb0d0',
        'link_color' => '#6aa8ff',
        'link_hover_color' => '#9ec5ff',
        'card_background' => '#0d1a31',
        'card_border' => '#223a63',
        'input_background' => '#0a1730',
        'input_border' => '#2b4878',
        'topbar_background' => '#040d21',
        'topbar_text' => '#c9daf6',
        'footer_background' => '#040d21',
        'footer_text' => '#b8cae8',
        'dashboard_panel_background' => '#0a1427',
        'dashboard_panel_border' => '#1f3357',
        'dashboard_stat_background' => '#101c35',
        'dashboard_stat_border' => '#243d65',
        'dashboard_search_background' => '#0b1730',
        'dashboard_search_border' => '#2f4c7e',
        'dashboard_online_text' => '#27d17f',
        'dashboard_offline_text' => '#fb5f71',
        'sidebar_text' => '#9bb0d0',
        'sidebar_text_active' => '#eaf2ff',
        'sidebar_section_text' => '#6f86aa',
        'sidebar_footer_text' => '#6f86aa',
        'sidebar_active_background' => '#12284d',
        'sidebar_icon_background' => '#0b1730',
        'sidebar_hover_background' => '#0f2345',
    ];

    /**
     * ThemeService constructor.
     */
    public function __construct(private ThemeSettingRepository $repository)
    {
    }

    /**
     * Return active theme values.
     */
    public function getActiveTheme(): array
    {
        try {
            $theme = $this->repository->getActive();

            return [
                'primary_content' => $theme->primary_content ?? self::DEFAULT_THEME['primary_content'],
                'secondary_content' => $theme->secondary_content ?? self::DEFAULT_THEME['secondary_content'],
                'background_color' => $theme->background_color ?? self::DEFAULT_THEME['background_color'],
                'component_headers' => $theme->component_headers ?? self::DEFAULT_THEME['component_headers'],
                'sidebar_navigation' => $theme->sidebar_navigation ?? self::DEFAULT_THEME['sidebar_navigation'],
                'success_color' => $theme->success_color ?? self::DEFAULT_THEME['success_color'],
                'warning_color' => $theme->warning_color ?? self::DEFAULT_THEME['warning_color'],
                'danger_color' => $theme->danger_color ?? self::DEFAULT_THEME['danger_color'],
                'info_color' => $theme->info_color ?? self::DEFAULT_THEME['info_color'],
                'text_primary' => $theme->text_primary ?? self::DEFAULT_THEME['text_primary'],
                'text_muted' => $theme->text_muted ?? self::DEFAULT_THEME['text_muted'],
                'link_color' => $theme->link_color ?? self::DEFAULT_THEME['link_color'],
                'link_hover_color' => $theme->link_hover_color ?? self::DEFAULT_THEME['link_hover_color'],
                'card_background' => $theme->card_background ?? self::DEFAULT_THEME['card_background'],
                'card_border' => $theme->card_border ?? self::DEFAULT_THEME['card_border'],
                'input_background' => $theme->input_background ?? self::DEFAULT_THEME['input_background'],
                'input_border' => $theme->input_border ?? self::DEFAULT_THEME['input_border'],
                'topbar_background' => $theme->topbar_background ?? self::DEFAULT_THEME['topbar_background'],
                'topbar_text' => $theme->topbar_text ?? self::DEFAULT_THEME['topbar_text'],
                'footer_background' => $theme->footer_background ?? self::DEFAULT_THEME['footer_background'],
                'footer_text' => $theme->footer_text ?? self::DEFAULT_THEME['footer_text'],
                'dashboard_panel_background' =>
                    $theme->dashboard_panel_background ?? self::DEFAULT_THEME['dashboard_panel_background'],
                'dashboard_panel_border' => $theme->dashboard_panel_border ?? self::DEFAULT_THEME['dashboard_panel_border'],
                'dashboard_stat_background' =>
                    $theme->dashboard_stat_background ?? self::DEFAULT_THEME['dashboard_stat_background'],
                'dashboard_stat_border' => $theme->dashboard_stat_border ?? self::DEFAULT_THEME['dashboard_stat_border'],
                'dashboard_search_background' =>
                    $theme->dashboard_search_background ?? self::DEFAULT_THEME['dashboard_search_background'],
                'dashboard_search_border' =>
                    $theme->dashboard_search_border ?? self::DEFAULT_THEME['dashboard_search_border'],
                'dashboard_online_text' => $theme->dashboard_online_text ?? self::DEFAULT_THEME['dashboard_online_text'],
                'dashboard_offline_text' =>
                    $theme->dashboard_offline_text ?? self::DEFAULT_THEME['dashboard_offline_text'],
                'sidebar_text' => $theme->sidebar_text ?? self::DEFAULT_THEME['sidebar_text'],
                'sidebar_text_active' => $theme->sidebar_text_active ?? self::DEFAULT_THEME['sidebar_text_active'],
                'sidebar_section_text' => $theme->sidebar_section_text ?? self::DEFAULT_THEME['sidebar_section_text'],
                'sidebar_footer_text' => $theme->sidebar_footer_text ?? self::DEFAULT_THEME['sidebar_footer_text'],
                'sidebar_active_background' =>
                    $theme->sidebar_active_background ?? self::DEFAULT_THEME['sidebar_active_background'],
                'sidebar_icon_background' =>
                    $theme->sidebar_icon_background ?? self::DEFAULT_THEME['sidebar_icon_background'],
                'sidebar_hover_background' =>
                    $theme->sidebar_hover_background ?? self::DEFAULT_THEME['sidebar_hover_background'],
            ];
        } catch (QueryException) {
            return self::DEFAULT_THEME;
        }
    }

    /**
     * Save active theme values.
     */
    public function saveActiveTheme(array $data): array
    {
        $theme = $this->repository->saveActive($data);

        return [
            'primary_content' => $theme->primary_content,
            'secondary_content' => $theme->secondary_content,
            'background_color' => $theme->background_color,
            'component_headers' => $theme->component_headers,
            'sidebar_navigation' => $theme->sidebar_navigation,
            'success_color' => $theme->success_color,
            'warning_color' => $theme->warning_color,
            'danger_color' => $theme->danger_color,
            'info_color' => $theme->info_color,
            'text_primary' => $theme->text_primary,
            'text_muted' => $theme->text_muted,
            'link_color' => $theme->link_color,
            'link_hover_color' => $theme->link_hover_color,
            'card_background' => $theme->card_background,
            'card_border' => $theme->card_border,
            'input_background' => $theme->input_background,
            'input_border' => $theme->input_border,
            'topbar_background' => $theme->topbar_background,
            'topbar_text' => $theme->topbar_text,
            'footer_background' => $theme->footer_background,
            'footer_text' => $theme->footer_text,
            'dashboard_panel_background' => $theme->dashboard_panel_background,
            'dashboard_panel_border' => $theme->dashboard_panel_border,
            'dashboard_stat_background' => $theme->dashboard_stat_background,
            'dashboard_stat_border' => $theme->dashboard_stat_border,
            'dashboard_search_background' => $theme->dashboard_search_background,
            'dashboard_search_border' => $theme->dashboard_search_border,
            'dashboard_online_text' => $theme->dashboard_online_text,
            'dashboard_offline_text' => $theme->dashboard_offline_text,
            'sidebar_text' => $theme->sidebar_text,
            'sidebar_text_active' => $theme->sidebar_text_active,
            'sidebar_section_text' => $theme->sidebar_section_text,
            'sidebar_footer_text' => $theme->sidebar_footer_text,
            'sidebar_active_background' => $theme->sidebar_active_background,
            'sidebar_icon_background' => $theme->sidebar_icon_background,
            'sidebar_hover_background' => $theme->sidebar_hover_background,
        ];
    }

    /**
     * Return css custom properties for active theme.
     */
    public function getCssVariables(): array
    {
        $theme = $this->getActiveTheme();

        return [
            '--theme-primary-content' => $theme['primary_content'],
            '--theme-secondary-content' => $theme['secondary_content'],
            '--theme-background' => $theme['background_color'],
            '--theme-component-headers' => $theme['component_headers'],
            '--theme-sidebar' => $theme['sidebar_navigation'],
            '--theme-success' => $theme['success_color'],
            '--theme-warning' => $theme['warning_color'],
            '--theme-danger' => $theme['danger_color'],
            '--theme-info' => $theme['info_color'],
            '--theme-text-primary' => $theme['text_primary'],
            '--theme-text-muted' => $theme['text_muted'],
            '--theme-link' => $theme['link_color'],
            '--theme-link-hover' => $theme['link_hover_color'],
            '--theme-card-background' => $theme['card_background'],
            '--theme-card-border' => $theme['card_border'],
            '--theme-input-background' => $theme['input_background'],
            '--theme-input-border' => $theme['input_border'],
            '--theme-topbar-background' => $theme['topbar_background'],
            '--theme-topbar-text' => $theme['topbar_text'],
            '--theme-footer-background' => $theme['footer_background'],
            '--theme-footer-text' => $theme['footer_text'],
            '--theme-dashboard-panel-background' => $theme['dashboard_panel_background'],
            '--theme-dashboard-panel-border' => $theme['dashboard_panel_border'],
            '--theme-dashboard-stat-background' => $theme['dashboard_stat_background'],
            '--theme-dashboard-stat-border' => $theme['dashboard_stat_border'],
            '--theme-dashboard-search-background' => $theme['dashboard_search_background'],
            '--theme-dashboard-search-border' => $theme['dashboard_search_border'],
            '--theme-dashboard-online-text' => $theme['dashboard_online_text'],
            '--theme-dashboard-offline-text' => $theme['dashboard_offline_text'],
            '--theme-sidebar-text' => $theme['sidebar_text'],
            '--theme-sidebar-text-active' => $theme['sidebar_text_active'],
            '--theme-sidebar-section-text' => $theme['sidebar_section_text'],
            '--theme-sidebar-footer-text' => $theme['sidebar_footer_text'],
            '--theme-sidebar-active-background' => $theme['sidebar_active_background'],
            '--theme-sidebar-icon-background' => $theme['sidebar_icon_background'],
            '--theme-sidebar-hover-background' => $theme['sidebar_hover_background'],
        ];
    }

    /**
     * Return an inline style string containing theme css variables.
     */
    public function getInlineStyleString(): string
    {
        return collect($this->getCssVariables())
            ->map(fn (string $value, string $key) => sprintf('%s:%s', $key, $value))
            ->implode(';');
    }
}
