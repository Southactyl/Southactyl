<?php

namespace Pterodactyl\Services\Themes;

use Illuminate\Database\QueryException;
use Pterodactyl\Repositories\ThemeSettingRepository;

class ThemeService
{
    private const BASE_THEME_KEYS = [
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
    ];
    private const DERIVED_THEME_KEYS = [
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
    ];

    public const DEFAULT_THEME = [
        'primary_content' => '#6b5bff',
        'secondary_content' => '#8ea1bf',
        'background_color' => '#060d1a',
        'component_headers' => '#0d1728',
        'sidebar_navigation' => '#070f1f',
        'success_color' => '#28cf8d',
        'warning_color' => '#f3b44d',
        'danger_color' => '#f06272',
        'info_color' => '#3ec7ff',
        'text_primary' => '#e9f0fb',
        'text_muted' => '#8fa1bb',
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
            $base = [];
            foreach (self::BASE_THEME_KEYS as $key) {
                $base[$key] = $theme->{$key} ?? self::DEFAULT_THEME[$key];
            }

            return $this->applyDerivedTheme($base);
        } catch (QueryException) {
            $base = [];
            foreach (self::BASE_THEME_KEYS as $key) {
                $base[$key] = self::DEFAULT_THEME[$key];
            }

            return $this->applyDerivedTheme($base);
        }
    }

    /**
     * Save active theme values.
     */
    public function saveActiveTheme(array $data, bool $advanced = false): array
    {
        if ($advanced) {
            $theme = $this->repository->saveActive($this->normalizeFullTheme($data));
        } else {
            $base = [];
            foreach (self::BASE_THEME_KEYS as $key) {
                $base[$key] = $data[$key] ?? self::DEFAULT_THEME[$key];
            }
            $theme = $this->repository->saveActive($this->applyDerivedTheme($base));
        }

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

    private function applyDerivedTheme(array $theme): array
    {
        $primary = $theme['primary_content'];
        $background = $theme['background_color'];
        $component = $theme['component_headers'];
        $sidebar = $theme['sidebar_navigation'];
        $textPrimary = $theme['text_primary'];
        $textMuted = $theme['text_muted'];

        $theme['link_color'] = $this->lighten($primary, 0.14);
        $theme['link_hover_color'] = $this->lighten($primary, 0.24);
        $theme['card_background'] = $this->mix($background, $component, 0.56);
        $theme['card_border'] = $this->mix($background, $primary, 0.28);
        $theme['input_background'] = $this->mix($background, $component, 0.36);
        $theme['input_border'] = $this->mix($background, $primary, 0.24);
        $theme['topbar_background'] = $this->mix($background, $sidebar, 0.72);
        $theme['topbar_text'] = $textPrimary;
        $theme['footer_background'] = $this->mix($background, $sidebar, 0.8);
        $theme['footer_text'] = $textMuted;

        $theme['dashboard_panel_background'] = $this->mix($background, $sidebar, 0.45);
        $theme['dashboard_panel_border'] = $this->mix($background, $primary, 0.22);
        $theme['dashboard_stat_background'] = $this->mix($background, $component, 0.52);
        $theme['dashboard_stat_border'] = $this->mix($background, $primary, 0.2);
        $theme['dashboard_search_background'] = $this->mix($background, $component, 0.34);
        $theme['dashboard_search_border'] = $this->mix($background, $primary, 0.18);
        $theme['dashboard_online_text'] = $theme['success_color'];
        $theme['dashboard_offline_text'] = $theme['danger_color'];

        $theme['sidebar_text'] = $textMuted;
        $theme['sidebar_text_active'] = $textPrimary;
        $theme['sidebar_section_text'] = $this->mix($background, $textMuted, 0.52);
        $theme['sidebar_footer_text'] = $this->mix($background, $textMuted, 0.42);
        $theme['sidebar_active_background'] = $this->mix($sidebar, $primary, 0.2);
        $theme['sidebar_icon_background'] = $this->mix($background, $sidebar, 0.62);
        $theme['sidebar_hover_background'] = $this->mix($sidebar, $primary, 0.14);

        return $theme;
    }

    private function normalizeFullTheme(array $theme): array
    {
        $normalized = [];
        foreach (self::BASE_THEME_KEYS as $key) {
            $normalized[$key] = $theme[$key] ?? self::DEFAULT_THEME[$key];
        }
        foreach (self::DERIVED_THEME_KEYS as $key) {
            $normalized[$key] = $theme[$key] ?? self::DEFAULT_THEME[$key];
        }

        return $normalized;
    }

    private function lighten(string $hex, float $amount): string
    {
        return $this->mix($hex, '#ffffff', $amount);
    }

    private function mix(string $baseHex, string $overlayHex, float $ratio): string
    {
        $ratio = max(0.0, min(1.0, $ratio));
        [$r1, $g1, $b1] = $this->hexToRgb($baseHex);
        [$r2, $g2, $b2] = $this->hexToRgb($overlayHex);

        $r = (int) round(($r1 * (1 - $ratio)) + ($r2 * $ratio));
        $g = (int) round(($g1 * (1 - $ratio)) + ($g2 * $ratio));
        $b = (int) round(($b1 * (1 - $ratio)) + ($b2 * $ratio));

        return sprintf('#%02x%02x%02x', $r, $g, $b);
    }

    private function hexToRgb(string $hex): array
    {
        $value = ltrim($hex, '#');
        if (strlen($value) !== 6) {
            return [0, 0, 0];
        }

        return [
            hexdec(substr($value, 0, 2)),
            hexdec(substr($value, 2, 2)),
            hexdec(substr($value, 4, 2)),
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
