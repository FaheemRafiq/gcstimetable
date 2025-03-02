<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PermissionGroup extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionGroupFactory> */
    use HasFactory;

    protected $fillable = ['name'];

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }
}
