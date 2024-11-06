<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $admin  = Auth::user();
        $users  = User::select('id', 'name', 'email', 'email_verified_at', 'created_at')
            ->when($admin->isInstitutionAdmin(), function ($query) use ($admin) {
                $query->whereInstitution($admin->institution_id);
            })
            ->when($admin->isDepartmentAdmin(), function ($query) use ($admin) {
                $query->whereDepartment($admin->department_id);
            })
            ->with('roles.permissions')
            ->paginate($request->input('per_page', config('providers.per_page')));

        return Inertia::render('Admin/Users/index', [
            'users' => UserResource::collection($users)
        ]);
    }

    public function destroy($user_id)
    {
        $user = User::find($user_id);

        if (!$user) {
            return back()->with('error' , 'User not found.');
        }

        $response = Gate::inspect('delete', [User::class, $user]);

        if ($response->allowed()) {

            if (!$user->isStudent() && !$user->isTeacher()) {
                return back()->with('error' , "User, {$user->name} can't be deleted.");
            }

            $user->delete();

            return back()->with('success', 'User deleted successfully.');
        }

        return back()->with('error', $response->message());
    }
}
