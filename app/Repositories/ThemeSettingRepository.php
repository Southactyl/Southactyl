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
            'secondary_content' => '#7f92b0',
            'background_color' => '#040515',
            'component_headers' => '#0a1323',
            'sidebar_navigation' => '#050d1b',
            'success_color' => '#28cf8d',
            'warning_color' => '#f3b44d',
            'danger_color' => '#f06272',
            'info_color' => '#3ec7ff',
            'text_primary' => '#e8effb',
            'text_muted' => '#8295b3',
            'link_color' => '#8072ff',
            'link_hover_color' => '#8f82ff',
            'card_background' => '#070d1d',
            'card_border' => '#211d57',
            'input_background' => '#060a1a',
            'input_border' => '#1d1a4d',
            'topbar_background' => '#050b19',
            'topbar_text' => '#e8effb',
            'footer_background' => '#050b1a',
            'footer_text' => '#8295b3',
            'dashboard_panel_background' => '#040918',
            'dashboard_panel_border' => '#1b1848',
            'dashboard_stat_background' => '#070c1c',
            'dashboard_stat_border' => '#191644',
            'dashboard_search_background' => '#060a1a',
            'dashboard_search_border' => '#17143f',
            'dashboard_online_text' => '#28cf8d',
            'dashboard_offline_text' => '#f06272',
            'sidebar_text' => '#8295b3',
            'sidebar_text_active' => '#e8effb',
            'sidebar_section_text' => '#465067',
            'sidebar_footer_text' => '#394157',
            'sidebar_active_background' => '#191d49',
            'sidebar_icon_background' => '#050a19',
            'sidebar_hover_background' => '#13183b',
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
