<?php

namespace App\Http\Controllers\Admin;

use App\Models\Department;
use App\Models\Institution;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;
use App\Http\Requests\DepartmentRequest;
use App\Http\Resources\DepartmentResource;
use Illuminate\Support\Facades\Request;

class DepartmentController extends Controller
{
    public const ONLY = ['index', 'show', 'create', 'store', 'update', 'destroy'];

    public function index()
    {
        $admin = Auth::user();
        try {
            $departments = [];
            $queryBuilder = Department::query()->with('institution:id,name');
            $per_page = Request::input('per_page', config('providers.pagination.per_page'));
            $search = Request::input('s');

            if (!$admin->isSuperAdmin()) {
                $queryBuilder->where('institution_id', $admin->institution_id);
            }

            if ($search) {
                $queryBuilder->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhereHas('institution', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            }

            $departments = $queryBuilder->orderBy('updated_at', 'desc')->paginate($per_page)->appends(Request::query());

            return inertia()->render('Admin/Departments/index', [
                'departments' => DepartmentResource::collection($departments),
            ]);
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('departments')->error('QueryException', $logData);

            return back()->withErrors(['message' => 'Database error 👉 Something went wrong!']);
        }
    }

    public function create()
    {
        $response    = Gate::inspect('create', Department::class);
        $message     = '';
        $institutions = Institution::all();

        if ($response->allowed()) {
            return response()->json([
                'institutions' => $institutions,
            ]);
        } else {
            $message = $response->message();
        }

        return response()->json(['message' => $message]);
    }

    public function store(DepartmentRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Department::class);
        $message    = '';

        try {
            if ($response->allowed()) {
                Department::create($attributes);

                return back()->with('success', 'Department successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('departments')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    public function show(Department $department)
    {
        $response = Gate::inspect('view', $department);
        $message  = '';

        $department->load('institution:id,name');

        if ($response->allowed()) {
            return inertia()->render('Admin/Departments/show', [
                'department' => new DepartmentResource($department),
            ]);
        } else {
            $message = $response->message();
        }

        return back()->with('error', $message);
    }

    public function update(DepartmentRequest $request, Department $department)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $department);
        $message    = '';

        try {
            if ($response->allowed()) {
                $department->update($attributes);

                return back()->with('success', 'Resource successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('departments')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    public function destroy(Department $department)
    {
        $response = Gate::inspect('delete', $department);
        $message  = '';

        try {
            if ($response->allowed()) {
                $department->delete();

                return back()->with('success', 'Resource successfully deleted');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('departments')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->with('error', $message);
    }
}
