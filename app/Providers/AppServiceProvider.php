<?php

namespace App\Providers;

use App\Models\Day;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Resources\Json\JsonResource;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Blueprint::macro('is_active', function (): void {
            $this->enum('is_active', [Day::ACTIVE, Day::INACTIVE])->default(Day::ACTIVE);
        });
    }
}
