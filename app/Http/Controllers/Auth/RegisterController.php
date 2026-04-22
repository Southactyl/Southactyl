<?php

namespace Pterodactyl\Http\Controllers\Auth;

use Illuminate\Http\Response;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Services\Users\UserCreationService;
use Pterodactyl\Http\Requests\Auth\RegisterRequest;

class RegisterController extends AbstractLoginController
{
    public function __construct(private UserCreationService $creationService)
    {
        parent::__construct();
    }

    /**
     * Handle a registration request for the application.
     *
     * @throws \Exception
     * @throws \Throwable
     */
    public function register(RegisterRequest $request): Response
    {
        if (!config('pterodactyl.auth.allow_registration')) {
            throw new DisplayException('Registration is currently disabled.');
        }

        $this->creationService->handle([
            'email' => $request->input('email'),
            'username' => $request->input('username'),
            'name_first' => $request->input('name_first'),
            'name_last' => $request->input('name_last'),
            'password' => $request->input('password'),
            'root_admin' => false,
            'language' => config('app.locale', 'en'),
        ]);

        return response('', Response::HTTP_NO_CONTENT);
    }
}
