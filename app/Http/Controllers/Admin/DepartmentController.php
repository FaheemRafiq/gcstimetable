<?php

namespace App\Http\Controllers\Admin;

use App\Models\Slot;
use Inertia\Inertia;
use App\Models\Teacher;
use App\Models\Department;
use App\Models\Institution;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Request;
use App\Http\Requests\DepartmentRequest;
use App\Http\Resources\DepartmentResource;

class DepartmentController extends Controller
{
    public const ONLY = ['index', 'show', 'create', 'store', 'update', 'destroy'];

    public function index()
    {
        $admin = Auth::user();
        try {
            $departments  = [];
            $queryBuilder = Department::query()->with('institution:id,name');
            $per_page     = Request::input('per_page', config('providers.pagination.per_page'));
            $search       = Request::input('s');

            if (! $admin->isSuperAdmin()) {
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
        $response     = Gate::inspect('create', Department::class);
        $message      = '';
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

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
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

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Displays a table of teachers with their workload for the specified department,
     * shift, and day.
     *
     * @return \Illuminate\Http\Response
     */
    public function showTeacherWorkload(Department $department)
    {
        $gateResponse = Gate::inspect('view_teachers_workload', $department);

        if (! $gateResponse->allowed()) {
            return back()->with('error', $gateResponse->message());
        }

        $admin = Auth::user();

        if ($department->institution_id !== $admin->institution_id) {
            abort(403, 'Unauthorized action.');
        }

        $shiftId = Request::query('shift_id');

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
