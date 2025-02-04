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
    public const ONLY = ['index', 'destroy'];

    public function index(Request $request)
    {
        $admin  = Auth::user();

        $search     = $request->query('s');
        $verified   = $request->query('verified', 1);
        $unverified = $request->query('unverified', 1);
        $start_date = $request->query('start_date', null);
        $end_date   = $request->query('end_date', null);

        $users = User::query()
            ->select('id', 'name', 'email', 'email_verified_at', 'created_at')
            ->when($admin->isInstitutionAdmin(), function ($query) use ($admin): void {
                $query->whereInstitution($admin->institution_id);
            })
            ->when($admin->isDepartmentAdmin(), function ($query) use ($admin): void {
                $query->whereDepartment($admin->department_id);
            })
            ->when($search, function ($query) use ($search): void {
                $query->where(function ($wQuery) use ($search) {
                    $wQuery->where('name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                });
            })
            ->when($verified == 'false', function ($query) {
                $query->whereNull('email_verified_at');
            })
            ->when($unverified == 'false', function ($query) {
                $query->whereNotNull('email_verified_at');
            })
            ->when($start_date, function ($query) use ($start_date) {
                $query->where('created_at', '>=', $start_date);
            })
            ->when($end_date, function ($query) use ($end_date) {
                $query->where('created_at', '<=', $end_date);
            })
            ->with('roles.permissions')
            ->paginate($request->input('per_page', config('providers.pagination.per_page')));

        return Inertia::render('Admin/Users/index', [
            'users' => UserResource::collection($users)->withQuery($request->query()),
        ]);
    }

    public function destroy($user_id)
    {
        $auth = Auth::user();
        $user = User::find($user_id);

        if (! $user) {
            return back()->with('error', 'User not found.');
        }

        $response = Gate::inspect('delete', [User::class, $user]);

        if ($response->allowed()) {
            if (! $user->isStudent() && ! $user->isTeacher()) {
                return back()->with('error', sprintf("User, %s can't be deleted.", $user->name));
            }

            $user->delete();

            return back()->with('success', 'User deleted successfully.');
        }

        return back()->with('error', $response->message());
    }
}
