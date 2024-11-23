<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
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
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Exceptions\AllocationException;
use Illuminate\Database\QueryException;
use App\Http\Repositories\SectionRepository;
use App\Http\Resources\AllocationCollection;
use App\Http\Requests\Allocation\AllocationRequest;

class AllocationController extends Controller
{
    public const ONLY = ['create', 'store', 'update', 'destroy'];

    public function __construct(
        protected SectionRepository $sectionRepository
    ) {
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
                'shift.semesters.courses',
                'allocations' => fn ($query) => $query->select('section_id', 'time_table_id')
            ]);
            $removeSections = $timetable->allocations?->groupBy('section_id')->keys()->toArray();

            $slot      = Slot::find($request->slot_id);
            $sections  = $this->sectionRepository->getAllByShiftId($timetable?->shift_id, $request->input('section_id'));
            $courses     = $timetable?->shift?->semesters?->pluck('courses')->flatten();

            $allocations = [];
            if ($request->has('section_id')) {

                $allocations = Allocation::where(['time_table_id' => $timetable->id, 'slot_id' => $request->slot_id, 'section_id' => $request->section_id])->withAll()->latest()->get();
            } elseif (count($removeSections) > 0) {

                // Remove Sections of that timetable when creating new allocation with no section
                $sections = $sections->whereNotIn('id', $removeSections)->values();
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
                    'section_id' => $allocation->section_id,
                    'slot_id' => $allocation->slot_id
                ])->with('success', 'Resource successfully created');
            } else {
                $message = $response->message();
            }

        } catch (AllocationException $exception) {
            $message = 'Constraint violation 👉 '. $exception->getMessage();
        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
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
}
