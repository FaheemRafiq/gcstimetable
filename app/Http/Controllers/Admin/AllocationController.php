<?php

namespace App\Http\Controllers\Admin;

use App\Models\Slot;
use Inertia\Inertia;
use App\Models\TimeTable;
use App\Models\Allocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Exceptions\AllocationException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;
use App\Http\Repositories\SectionRepository;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Allocation\AllocationRequest;

class AllocationController extends Controller
{
    public const ONLY = ['create', 'store', 'update', 'destroy'];

    public function __construct(
        protected SectionRepository $sectionRepository
    ) {}

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'slot_id'       => 'required',
            'time_table_id' => 'required',
        ]);

        try {
            $timetable = TimeTable::with('shift')->findOrFail($request->time_table_id);
            $shift     = $timetable->shift;

            $timetable->load([
                'shift.institution.days',
                'shift.institution.rooms' => function ($query) use ($shift): void {
                    $query->select('rooms.id', 'rooms.name', 'rooms.type', 'rooms.institution_id')
                        ->where(function ($query) use ($shift): void {
                            $query->where('rooms.type', $shift->program_type)
                                ->orWhere('rooms.type', 'BOTH');
                        })
                        ->available();
                },
                'shift.institution.teachers' => function ($query): void {
                    $query->select('teachers.id', 'teachers.name', 'teachers.email', 'teachers.department_id');
                },
                'shift.institution.courses' => function ($query): void {
                    $query->with('semesters:id,name');
                },
                'allocations' => fn ($query) => $query->select('section_id', 'time_table_id'),
            ]);
            $removeSections = $timetable->allocations?->groupBy('section_id')->keys()->toArray();

            $slot     = Slot::find($request->slot_id);
            $sections = $this->sectionRepository->getAllByShiftId($timetable?->shift_id, $request->input('section_id'));
            $courses  = $timetable?->shift?->institution?->courses;

            $allocations = [];

            if ($request->has('section_id')) {
                $allocations = Allocation::where(['time_table_id' => $timetable->id, 'slot_id' => $request->slot_id, 'section_id' => $request->section_id])->withAll()->latest()->get();
            } elseif (count($removeSections) > 0) {
                // Remove Sections of that timetable when creating new allocation with no section
                $sections = $sections->whereNotIn('id', $removeSections)->values();
            }

            // Remove the semesters relationship from the timetable object
            $timetable?->shift?->setRelation('semesters', collect());

            return Inertia::render('Admin/Allocations/create_claude', [
                'props' => [
                    'timetable'   => $timetable,
                    'slot'        => $slot,
                    'sections'    => $sections,
                    'courses'     => $courses,
                    'allocations' => $allocations,
                    'haveSection' => $request->has('section_id'),
                ],
            ]);
        } catch (QueryException $queryException) {
            return back()->with('error', 'Database error'.$queryException->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AllocationRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Allocation::class);
        $message    = '';
        try {
            if ($response->allowed()) {
                $allocation = Allocation::create($attributes);

                return redirect()->route('allocations.create', [
                    'time_table_id' => $allocation->time_table_id,
                    'section_id'    => $allocation->section_id,
                    'slot_id'       => $allocation->slot_id,
                ])->with('success', 'Resource successfully created');
            } else {
                $message = $response->message();
            }
        } catch (AllocationException $exception) {
            $message = 'Constraint violation 👉 '.$exception->getMessage();
        } catch (QueryException $exception) {
            $logData = ['message' => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('allocations')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AllocationRequest $request, Allocation $allocation)
    {
        $attributes = $request->validated();

        $response = Gate::inspect('update', $allocation);

        try {
            if ($response->allowed()) {
                $allocation->update($attributes);

                return back()->with('success', 'Resource successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (AllocationException $exception) {
            $message = 'Constraint violation 👉 '.$exception->getMessage();
        } catch (QueryException $exception) {
            $message = 'Database error 👉 '.$exception->getMessage();
        }

        return back()->with('message', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Allocation $allocation)
    {
        $response = Gate::inspect('delete', $allocation);

        if ($response->allowed()) {
            $allocation->delete();

            return back()->with('success', 'Resource successfully deleted');
        }

        return back()->withErrors(['message' => $response->message()]);
    }

    public function bulkStore(Request $request)
    {
        $input = $request->all();

        $gateResponse = Gate::inspect('create', Allocation::class);

        if (! $gateResponse->allowed()) {
            return response()->json(['message' => $gateResponse->message()], 403);
        }

        $validator = Validator::make($input, [
            'time_table_id'                 => 'required|exists:time_tables,id',
            'slot_id'                       => 'required|exists:slots,id',
            'section_id'                    => 'required|exists:sections,id',
            'allocations_data'              => 'required|array|min:1',
            'allocations_data.*.day_id'     => 'required|exists:days,id',
            'allocations_data.*.room_id'    => 'nullable|exists:rooms,id',
            'allocations_data.*.teacher_id' => 'nullable|exists:teachers,id',
            'allocations_data.*.course_id'  => 'nullable|exists:courses,id',
        ], [
            'allocations_data.required' => 'Please select at least one day',
            'allocations_data.array'    => 'Please select at least one day',
            'allocations_data.min'      => 'Please select at least one day',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'message' => $validator->errors()->first()], 422);
        }

        $potentialSuccessAllocations = [];
        $failedAllocations           = [];

        DB::beginTransaction();

        try {
            foreach ($input['allocations_data'] as $allocation) {
                $data = [
                    'section_id'    => $input['section_id'],
                    'slot_id'       => $input['slot_id'],
                    'time_table_id' => $input['time_table_id'],
                    'course_id'     => $allocation['course_id'],
                    'teacher_id'    => $allocation['teacher_id'],
                    'room_id'       => $allocation['room_id'],
                    'day_id'        => $allocation['day_id'],
                ];

                try {
                    Log::channel('allocations')->info('bulkStore', $data);

                    $allocationRecord = null;

                    if (isset($allocation['allocation_id'])) {
                        $allocationRecord = Allocation::find($allocation['allocation_id']);

                        if ($allocationRecord) {
                            $allocationRecord->update($data);
                        }

                        $potentialSuccessAllocations[] = [
                            'allocation' => $allocationRecord->fresh(),
                            'message'    => 'Allocation successfully updated.',
                        ];
                    } else {
                        $allocationRecord = Allocation::create($data);

                        $potentialSuccessAllocations[] = [
                            'allocation' => $allocationRecord,
                            'message'    => 'Allocation successfully created.',
                        ];
                    }
                } catch (AllocationException $exception) {
                    $failedAllocations[] = [
                        'day_id'  => $allocation['day_id'],
                        'message' => 'Constraint violation 👉 '.$exception->getMessage(),
                    ];
                } catch (QueryException $exception) {
                    $failedAllocations[] = [
                        'day_id'  => $allocation['day_id'],
                        'message' => 'Database error 👉 '.$exception->getMessage(),
                    ];
                } catch (ValidationException $exception) {
                    $failedAllocations[] = [
                        'day_id'  => $allocation['day_id'],
                        'message' => 'Validation error 👉 '.$exception->getMessage(),
                    ];
                } catch (\Exception $exception) {
                    $failedAllocations[] = [
                        'day_id'  => $allocation['day_id'],
                        'message' => $exception->getMessage(),
                    ];
                }
            }

            if (! empty($failedAllocations)) {
                // If any failures exist, rollback the transaction and return the failures
                DB::rollBack();

                usort($failedAllocations, fn ($a, $b) => $a['day_id'] <=> $b['day_id']);

                return response()->json([
                    'failed'  => $failedAllocations,
                    'message' => 'Some allocations failed, so no records were created or updated.',
                ], 422);
            }

            // If everything was successful, commit the transaction
            DB::commit();

            usort($potentialSuccessAllocations, fn ($a, $b) => $a['allocation']['day_id'] <=> $b['allocation']['day_id']);

            return response()->json([
                'success' => $potentialSuccessAllocations,
                'message' => 'All allocations were successfully processed.',
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::channel('allocations')->error('bulkStore', ['message' => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()]);

            return response()->json([
                'message' => 'Unexpected error: '.$exception->getMessage(),
            ], 500);
        }
    }

    public function bulkDestroy(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'allocations_data' => 'required|array|min:1',
            'allocations_data.*.allocation_id' => 'required|integer|exists:allocations,id',
        ], [
            'allocations_data.required' => 'Please select at least one allocation',
            'allocations_data.array' => 'Please select at least one allocation',
            'allocations_data.min' => 'Please select at least one allocation',
            'allocations_data.*.allocation_id.required' => 'Please select at least one allocation',
            'allocations_data.*.allocation_id.integer' => 'Please select at least one allocation',
            'allocations_data.*.allocation_id.exists' => 'Please select at least one allocation',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'message' => $validator->errors()->first()], 422);
        }

        DB::beginTransaction();

        try {
            foreach ($request['allocations_data'] as $allocation) {
                $allocation = Allocation::find($allocation['allocation_id']);

                $gateResponse = Gate::inspect('delete', $allocation);

                if(!$gateResponse->allowed()){
                    throw new AllocationException($gateResponse->message());
                }

                $allocation->delete();
            }

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::channel('allocations')->error('destroyBulk', ['message' => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()]);

            return response()->json([
                'message' => 'Unexpected error: '.$exception->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'All allocations were successfully deleted.',
        ], 200);
    }
}
