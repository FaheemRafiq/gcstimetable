<?php

namespace App\Providers;

use App\Models\Allocation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Schema\Blueprint;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::unguard();

        JsonResource::withoutWrapping();

        Blueprint::macro('is_active', function () {
            $this->enum('is_active', ['active', 'inactive'])->default('active');
        });


    }
}
