<?php

namespace Pterodactyl\Http\ViewComposers;

use Illuminate\View\View;
use Pterodactyl\Services\Helpers\AssetHashService;
use Pterodactyl\Services\Themes\ThemeService;

class AssetComposer
{
    /**
     * AssetComposer constructor.
     */
    public function __construct(
        private AssetHashService $assetHashService,
        private ThemeService $themeService,
    )
    {
    }

    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $theme = $this->themeService->getActiveTheme();
        $themeCssVariables = $this->themeService->getCssVariables();

        $view->with('asset', $this->assetHashService);
        $view->with('themeConfiguration', $theme);
        $view->with('themeCssVariables', $themeCssVariables);
        $view->with('themeCssInline', $this->themeService->getInlineStyleString());
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Pterodactyl',
            'locale' => config('app.locale') ?? 'en',
            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],
            'registration' => [
                'enabled' => config('pterodactyl.auth.allow_registration', false),
            ],
            'theme' => $theme,
        ]);
    }
}
