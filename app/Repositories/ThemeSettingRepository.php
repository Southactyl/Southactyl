<?php

namespace Pterodactyl\Repositories;

use Pterodactyl\Models\ThemeSetting;

class ThemeSettingRepository
{
    /**
     * Return the currently active theme row, creating one if missing.
     */
    public function getActive(): ThemeSetting
    {
        $theme = ThemeSetting::query()->where('is_active', true)->first();
        if (!is_null($theme)) {
            return $theme;
        }

        $theme = ThemeSetting::query()->first();
        if (!is_null($theme)) {
            if (!$theme->is_active) {
                $theme->is_active = true;
                $theme->save();
            }

            return $theme;
        }

        return ThemeSetting::query()->create([
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
            'is_active' => true,
        ]);
    }

    /**
     * Save the single active theme.
     */
    public function saveActive(array $data): ThemeSetting
    {
        $theme = $this->getActive();
        $theme->fill($data);
        $theme->is_active = true;
        $theme->save();

        ThemeSetting::query()->where('id', '!=', $theme->id)->update(['is_active' => false]);

        return $theme->fresh();
    }
}
