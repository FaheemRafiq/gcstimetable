<?php

namespace App\Models;

use Exception;
use App\Enums\RoleEnum;
use App\Traits\RoleTrait;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens;
    use HasFactory;
    use HasRoles;
    use Notifiable;
    use RoleTrait;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
        'label',
    ];

    protected static function booted()
    {
        parent::creating(function (User $user): void {
            if (is_null($user->institution_id) && $user->email != 'sadmin@gmail.com') {
                throw new Exception('User must belongs to an instituion.');
            }
        });
    }

    /**
     * A model may have multiple roles.
     */
    public function roles(): BelongsToMany
    {
        $relation = $this->morphToMany(
            config('permission.models.role'),
            'model',
            config('permission.table_names.model_has_roles'),
            config('permission.column_names.model_morph_key'),
            app(PermissionRegistrar::class)->pivotRole
        );

        // If teams are not enabled, simply return the relation.
        if (! app(PermissionRegistrar::class)->teams) {
            return $relation;
        }

        $teamsKey = app(PermissionRegistrar::class)->teamsKey;
        // Ensure the pivot data contains the team key.
        $relation->withPivot($teamsKey);

        $teamField = config('permission.table_names.roles').'.'.$teamsKey;

        // When no team is set, return only global roles.
        if (is_null(getPermissionsTeamId())) {
            return $relation->wherePivot($teamField, null);
        }

        // Otherwise, return both:
        // - Global roles (pivot team_id is null), and
        // - Roles assigned to the current team.
        return $relation->where(function ($query) use ($teamField) {
            $query->whereNull($teamField)
                ->orWhere($teamField, getPermissionsTeamId());
        });
    }

    /**
     * Get the URL to the user's profile photo.
     *
     * @return string
     */
    public function getProfilePhotoUrlAttribute()
    {
        return $this->profile_photo_path ?? generateAvatar($this->name);
    }

    public function getLabelAttribute(): string
    {
        return RoleEnum::getLabel($this->roles->first()->name ?? '');
    }

    public function setPasswordAttribute($password): void
    {
        $this->attributes['password'] = bcrypt($password);
    }

    public function scopeWhereInstitution($query, $value): void
    {
        $query->where('institution_id', $value);
    }

    public function scopeWhereDepartment($query, $value): void
    {
        $query->where('department_id', $value);
    }

    public function scopeWhereDepartmentIn($query, array $value): void
    {
        $query->whereIn('department_id', $value);
    }

    // Relationships

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    public function student()
    {
        return $this->hasOne(Student::class);
    }
}
