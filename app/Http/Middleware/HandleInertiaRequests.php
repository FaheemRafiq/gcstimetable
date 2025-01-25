<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $this->currentUser($request),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn () => session('success'),
                'error'   => fn () => session('error'),
            ],
        ];
    }

    private function currentUser(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $userId   = $user->id;
            $cacheKey = sprintf('user_%s_with_relations', $userId);

            return cache()->remember($cacheKey, 60, function () use ($user): UserResource {
                $user->load(['institution:id,name', 'roles', 'permissions']);

                return new UserResource($user);
            });
        }

        return null;
    }
}
