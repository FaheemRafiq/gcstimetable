<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\TeacherResource;
use Illuminate\Database\QueryException;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;

class TeacherController extends Controller
{
    public const ONLY = ['index'];
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin          = Auth::user();
        $queyBuilder    = Teacher::query();

        if ($admin->isInstitutionAdmin()) {
            
            $queyBuilder
                ->whereHas('department', function ($query) use ($admin) {
                    $query->where('institution_id', $admin->institution_id);
                })
                ->with('department.institution');

        } elseif ($admin->isDepartmentAdmin()) {
            $queyBuilder->where('department_id', $admin->department_id)
                ->with('department.institution');
        }

        $teachers = $queyBuilder->paginate($request->input('per_page', config('providers.per_page')));
        ;

        return Inertia::render('Admin/Teachers/index', [
            'teachers' => TeacherResource::collection($teachers)
        ]);
    }
}
