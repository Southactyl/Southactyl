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
            'link_color' => '#8166ff',
            'link_hover_color' => '#9485ff',
            'card_background' => '#0a1425',
            'card_border' => '#21325f',
            'input_background' => '#091322',
            'input_border' => '#1b2b54',
            'topbar_background' => '#070f1e',
            'topbar_text' => '#e9f0fb',
            'footer_background' => '#070f1e',
            'footer_text' => '#8fa1bb',
            'dashboard_panel_background' => '#081121',
            'dashboard_panel_border' => '#1a2a4f',
            'dashboard_stat_background' => '#0a1425',
            'dashboard_stat_border' => '#182849',
            'dashboard_search_background' => '#091323',
            'dashboard_search_border' => '#162544',
            'dashboard_online_text' => '#28cf8d',
            'dashboard_offline_text' => '#f06272',
            'sidebar_text' => '#8fa1bb',
            'sidebar_text_active' => '#e9f0fb',
            'sidebar_section_text' => '#55667f',
            'sidebar_footer_text' => '#465874',
            'sidebar_active_background' => '#1b2452',
            'sidebar_icon_background' => '#070f1e',
            'sidebar_hover_background' => '#151f45',
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
