<?php

namespace App\Http\Controllers\Admin;

use App\Models\Day;
use App\Models\Slot;
use Inertia\Inertia;
use App\Models\Shift;
use App\Models\Teacher;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Enums\TeacherRankEnum;
use App\Enums\TeacherPositionEnum;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\TeacherRequest;
use App\Enums\TeacherQualificationEnum;
use App\Http\Resources\TeacherResource;
use Illuminate\Database\QueryException;

class TeacherController extends Controller
{
    public const ONLY = ['index', 'create', 'store', 'edit', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin          = Auth::user();
        $queyBuilder    = Teacher::query();
        $ranks          = TeacherRankEnum::toArray();
        $positions      = TeacherPositionEnum::toArray();
        $qualifications = TeacherQualificationEnum::toArray();
        $search         = $request->query('s');
        $rank           = $request->query('rank');

        $queyBuilder
            ->when($search, function ($query) use ($search) {
                $query->where(function ($wQuery) use ($search) {
                    $wQuery->where('email', 'LIKE', "%$search%")
                        ->orWhere('name', 'LIKE', "%$search%");
                });
            })
            ->when($rank, function ($query, $rank) {
                $query->where('rank', $rank);
            });

        if ($admin->isInstitutionAdmin()) {
            $queyBuilder
                ->whereHas('department', function ($query) use ($admin): void {
                    $query->where('departments.institution_id', $admin->institution_id);
                })
                ->with('department.institution');
        } elseif ($admin->isDepartmentAdmin()) {
            $queyBuilder->where('department_id', $admin->department_id)
                ->with('department.institution');
        }

        $teachers = $queyBuilder->with('department.institution:id,name')->paginate($request->input('perPage', config('providers.pagination.per_page')));

        return Inertia::render('Admin/Teachers/index', [
            'teachers'       => TeacherResource::collection($teachers)->withQuery($request->query()),
            'ranks'          => $ranks,
            'positions'      => $positions,
            'qualifications' => $qualifications,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin          = Auth::user();
        $ranks          = TeacherRankEnum::toArray();
        $positions      = TeacherPositionEnum::toArray();
        $qualifications = TeacherQualificationEnum::toArray();
        $departments    = [];

        if ($admin->isInstitutionAdmin()) {
            $departments = Department::where('institution_id', $admin->institution_id)->pluck('name', 'id');
        } elseif ($admin->isDepartmentAdmin()) {
            $departments = Department::where('id', $admin->department_id)->pluck('name', 'id');
        }

        return Inertia::render('Admin/Teachers/create', ['ranks' => $ranks, 'positions' => $positions, 'departments' => $departments, 'qualifications' => $qualifications]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TeacherRequest $request)
    {
        $attributes = $request->validated();
        $message    = '';
        $response   = Gate::inspect('create', Teacher::class);

        if (! $response->allowed()) {
            return back()->withErrors(['message' => $response->message()]);
        }

        try {
            Teacher::create($attributes);

            return back()->with('success', 'Teacher successfully created');
        } catch (QueryException $queryException) {
            Log::channel('teachers')->error('QueryException', [
                'message' => $queryException->getMessage(),
                'file'    => $queryException->getFile(),
                'line'    => $queryException->getLine(),
            ]);
            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Teacher $teacher)
    {
        $admin          = Auth::user();
        $ranks          = TeacherRankEnum::toArray();
        $positions      = TeacherPositionEnum::toArray();
        $qualifications = TeacherQualificationEnum::toArray();
        $departments    = [];

        if ($admin->isInstitutionAdmin()) {
            $departments = Department::where('institution_id', $admin->institution_id)->pluck('name', 'id');
        } elseif ($admin->isDepartmentAdmin()) {
            $departments = Department::where('id', $admin->department_id)->pluck('name', 'id');
        }

        return Inertia::render('Admin/Teachers/edit', [
            'teacher'        => new TeacherResource($teacher),
            'ranks'          => $ranks,
            'positions'      => $positions,
            'departments'    => $departments,
            'qualifications' => $qualifications,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TeacherRequest $request, Teacher $teacher)
    {
        $attributes = $request->validated();
        $message    = '';

        $response = Gate::inspect('update', $teacher);

        if (! $response->allowed()) {
            return back()->withErrors(['message' => $response->message()]);
        }

        try {
            $teacher->update($attributes);

            return back()->with('success', 'Teacher successfully updated');
        } catch (QueryException $queryException) {
            Log::channel('teachers')->error('QueryException', [
                'message' => $queryException->getMessage(),
                'file'    => $queryException->getFile(),
                'line'    => $queryException->getLine(),
            ]);
            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        $message  = '';
        $response = Gate::inspect('delete', $teacher);

        if (! $response->allowed()) {
            return back()->withErrors(['message' => $response->message()]);
        }

        try {
            $teacher->delete();

            return back()->with('success', 'Teacher successfully deleted');
        } catch (QueryException $queryException) {
            Log::channel('teachers')->error('QueryException', [
                'message' => $queryException->getMessage(),
                'file'    => $queryException->getFile(),
                'line'    => $queryException->getLine(),
            ]);
            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    public function showWorkload(Teacher $teacher)
    {
        $admin = Auth::user();

        $response = Gate::inspect('view_workload', $teacher);

        if (! $response->allowed()) {
            $message = $response->message();

            return back()->with('error', $message);
        }

        if (! $admin->isSuperAdmin()) {
            $days = $admin->institution->days()->get();
        } else {
            $days = Day::all();
        }

        $allocations = $teacher->allocations()
            ->whereHas('timetable', function ($query) {
                $query->isValidForToday();
            })
            ->with(['day', 'slot', 'course', 'room', 'section.semester:id,name'])
            ->get();

        // 3. Return data to Inertia
        return Inertia::render('Admin/Teachers/workload', [
            'teacher'     => $teacher,
            'days'        => $days,
            'allocations' => $allocations,
        ]);
    }

    public function changeStatus(Teacher $teacher)
    {
        $response = Gate::inspect('change_status', $teacher);

        if (! $response->allowed()) {
            return back()->with('error', $response->message());
        }

        $teacher->update(['is_active' => $teacher->is_active === Day::ACTIVE ? Day::INACTIVE : Day::ACTIVE]);

        return back()->with('success', 'Teacher status successfully changed');
    }

    public function showTeacherWorkload(Request $request, Department $department)
    {
        $admin = Auth::user();

        if ($department->institution_id !== $admin->institution_id) {
            abort(403, 'Unauthorized action.');
        }

        $shiftId = $request->query('shift_id');

        if (is_numeric($shiftId)) {
            $shiftId = (int) $shiftId;
        }

        $workloadData = [];

        // Fetch teachers with their allocations for the specified shift
        $teachers = Teacher::query()
            ->select('id', 'name', 'rank', 'department_id')
            ->where('department_id', $department->id)
            ->where('is_active', 'active')
            ->whereHas('allocations', function ($query) {
                $query->whereHas('timetable', function ($q) {
                    $q->isValidForToday();
                });
            })
            ->with([
                'allocations' => function ($query) {
                    $query
                        ->whereHas('timetable', function ($q) {
                            $q->isValidForToday();
                        })
                        ->with([
                            'course'  => fn ($q) => $q->select('id', 'name', 'display_code', 'credit_hours'),
                            'day'     => fn ($q) => $q->select('id', 'name', 'number'),
                            'room'    => fn ($q) => $q->select('id', 'name'),
                            'slot'    => fn ($q) => $q->select('id', 'code', 'name', 'start_time', 'end_time', 'shift_id')->with('shift:id,name'),
                            'section' => fn ($q) => $q->select('id', 'name', 'semester_id')->with('semester:id,name'),
                        ]);
                },
            ])
            ->get();

        if ($teachers->isEmpty()) {
            return back()->with('error', 'No active teachers found for this department.');
        }

        // Get unique shifts from allocations
        $uniqueShifts = $teachers->pluck('allocations')
            ->flatten()
            ->pluck('slot.shift')
            ->unique('id')
            ->values();

        if ($uniqueShifts->isEmpty()) {
            return back()->with('error', 'No active shifts found for this department.');
        }

        $shiftId = $shiftId ?? $uniqueShifts->first()->id;

        // Fetch all active slots for the shift, ordered by start time
        $slots = Slot::where('shift_id', $shiftId)
            ->orderBy('start_time')
            ->get(['id', 'name', 'code', 'start_time', 'end_time']);

        if ($slots->isEmpty()) {
            return back()->with('error', 'No time slots found for this shift.');
        }

        // Transform data for the table
        $workloadData = [
            'department' => [
                'id'   => $department->id,
                'name' => $department->name,
            ],
            'teachers' => $teachers
                ->map(function ($teacher) use ($slots, $shiftId) {
                    $sections = [];

                    // Group allocations by section and semester
                    foreach ($teacher->allocations as $allocation) {
                        if ($allocation->slot->shift_id === $shiftId) {
                            $sectionKey = $allocation->section->id.'-'.$allocation->section->semester->id;

                            if (! isset($sections[$sectionKey])) {
                                $sections[$sectionKey] = [
                                    'section_name'  => $allocation->section->name,
                                    'semester_name' => $allocation->section->semester->name,
                                    'allocations'   => array_fill_keys($slots->pluck('id')->all(), []),
                                ];
                            }
                            
                            $sections[$sectionKey]['allocations'][$allocation->slot_id][] = $allocation;
                        }
                    }

                    return [
                        'id'       => $teacher->id,
                        'name'     => $teacher->name,
                        'rank'     => $teacher->rank,
                        'sections' => array_values($sections),
                    ];
                })->filter()->values(),
            'slots' => $slots->map(function ($slot) {
                return [
                    'id'         => $slot->id,
                    'name'       => $slot->name,
                    'code'       => $slot->code,
                    'start_time' => $slot->start_time,
                    'end_time'   => $slot->end_time,
                ];
            })->all(),
            'shifts' => $uniqueShifts->map(fn ($shift) => [
                'id'   => $shift->id,
                'name' => $shift->name,
            ])->all(),
            'currentShift' => $shiftId,
            'session'      => date('Y').'-'.(date('Y') + 1), // Current academic year
        ];

        return Inertia::render('Admin/Departments/TeachersWorkload', [
            'workloadData' => $workloadData,
        ]);
    }
}
