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
