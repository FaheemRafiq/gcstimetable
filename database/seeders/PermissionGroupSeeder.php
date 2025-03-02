<?php

namespace Database\Seeders;

use App\Models\PermissionGroup;
use Illuminate\Database\Seeder;
use App\Helpers\PermissionHelper;

class PermissionGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (PermissionHelper::getAllPermissions() as $groupName => $permissions) {
            // Create or update the group
            $group = PermissionGroup::firstOrCreate(['name' => $groupName]);

            foreach ($permissions as $permissionEnum) {
                // Create Permission
                $group->permissions()->create([
                    'name'          => $permissionEnum['key'],
                    'description'   => $permissionEnum['description'],
                ]);
            }
        }
    }
}
