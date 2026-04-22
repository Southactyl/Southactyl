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
            'primary_content' => '#3b82f6',
            'secondary_content' => '#94a3b8',
            'background_color' => '#070b13',
            'component_headers' => '#0f1622',
            'sidebar_navigation' => '#05080f',
            'success_color' => '#22c55e',
            'warning_color' => '#f59e0b',
            'danger_color' => '#ef4444',
            'info_color' => '#0ea5e9',
            'text_primary' => '#f8fafc',
            'text_muted' => '#94a3b8',
            'link_color' => '#60a5fa',
            'link_hover_color' => '#93c5fd',
            'card_background' => '#162130',
            'card_border' => '#334155',
            'input_background' => '#1a2636',
            'input_border' => '#475569',
            'topbar_background' => '#05080f',
            'topbar_text' => '#cbd5e1',
            'footer_background' => '#05080f',
            'footer_text' => '#cbd5e1',
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
