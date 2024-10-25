<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Slot;
use Inertia\Inertia;
use App\Models\Section;
use App\Models\TimeTable;
use App\Models\Allocation;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\AllocationException;
use Illuminate\Database\QueryException;
use App\Http\Repositories\SectionRepository;
use App\Http\Resources\AllocationCollection;
use App\Http\Requests\UpdateAllocationRequest;
use App\Http\Requests\Allocation\StoreAllocationRequest;

class AllocationController extends Controller
{
    public function __construct(
        protected SectionRepository $sectionRepository
    ) {
    }


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $allocations = Allocation::all();

            if ($request->wantsJson()) {
                return response()->json(new AllocationCollection($allocations));
            } else {
                return Inertia::render('AllocationForm', [
                    'allocations' => new AllocationCollection($allocations),
                ]);
            }

        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'slot_id'          => 'required',
            'time_table_id'     => 'required'
        ]);

        try {

            $timetable = TimeTable::with('shift')->findOrFail($request->time_table_id);
            $shift     = $timetable->shift;

            $timetable->load([
                'shift.institution.days',
                'shift.institution.rooms' => function ($query) use ($shift) {
                    $query->select('rooms.id', 'rooms.name', 'rooms.type', 'rooms.institution_id')
                    ->where(function ($query) use ($shift) {
                        $query->where('rooms.type', $shift->program_type)
                            ->orWhere('rooms.type', 'BOTH');
                    })
                    ->available();
                },
                'shift.institution.teachers'  => function ($query) {
                    $query->select('teachers.id', 'teachers.name', 'teachers.email', 'teachers.department_id');
                },
                'shift.semesters.courses'
            ]);

            $slot      = Slot::find($request->slot_id);
            $sections  = $this->sectionRepository->getAllByShiftId($timetable?->shift_id, $request->input('section_id'));
            // dd($sections, $timetable->id, $request->section_id);
            $courses     = $timetable?->shift?->semesters?->pluck('courses')->flatten();

            $allocations = [];
            if ($request->has('section_id')) {
                $allocations = Allocation::where(['time_table_id' => $timetable->id, 'slot_id' => $request->slot_id, 'section_id' => $request->section_id])->latest()->get();
            }

            // Remove the semesters relationship from the timetable object
            $timetable?->shift?->setRelation('semesters', collect());


            return Inertia::render('Admin/Allocations/create', [
                'props' => [
                    'timetable' => $timetable,
                    'slot' => $slot,
                    'sections' => $sections,
                    'courses' => $courses,
                    'allocations' => $allocations,
                    'haveSection' => $request->has('section_id')
                ],
            ]);

        } catch (QueryException $exception) {
            return back()->with('error', 'Database error'.$exception->getMessage());
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAllocationRequest $request)
    {
        $attributes = $request->validated();
        Log::channel('allocations')->info('CreateAllocation_Request', $attributes);

        $message    = '';
        try {

            $allocation = Allocation::create($attributes);

            return redirect()->route('allocations.create', [
                'time_table_id' => $allocation->time_table_id,
                'section_id' => $allocation->section_id,
                'slot_id' => $allocation->slot_id
            ])->with('success', 'Resource successfully created');

        } catch (AllocationException $exception) {
            $message = 'Constraint violation 👉 '.$exception->getMessage();
        } catch (QueryException $exception) {
            $message = 'Database error 👉 '.$exception->getMessage();
        } catch (Exception $exception) {
            $message = 'Something went wrong! Please contact Support.';
        }

        Log::channel('allocations')->info($message);

        return back()->with('error', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(Allocation $allocation)
    {
        if (! $allocation) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json($allocation);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Allocation $allocation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAllocationRequest $request, Allocation $allocation)
    {
        try {
            $allocation->update($request->all());

            return back()->with('success', 'Resource successfully updated');

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
        try {
            $allocation->delete();

            return response()->json(['allocation' => $allocation,  'message' => 'Resource successfully deleted'], 200);
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }
}
