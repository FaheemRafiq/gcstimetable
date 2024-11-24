<?php

namespace App\Http\Controllers\Admin;

use App\Models\Semester;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\SemesterRequest;
use Illuminate\Database\QueryException;
use App\Http\Resources\SemesterCollection;
use App\Http\Requests\UpdateSemesterRequest;

class SemesterController extends Controller
{
    public const ONLY = ['store', 'update', 'destroy'];

    /**
     * Store a newly created resource in storage.
     */
    public function store(SemesterRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Semester::class);
        $message    = '';
        try {

            if ($response->allowed()) {
                Semester::create($attributes);

                return back()->with('success', 'Semester successfully created');
            } else {
                $message = $response->message();
            }

        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('semesters')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SemesterRequest $request, Semester $semester)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $semester);
        $message    = '';
        try {

            if ($response->allowed()) {
                $semester->update($attributes);

                return back()->with('success', 'Semester successfully updated');
            } else {
                $message = $response->message();
            }

        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('semesters')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Semester $semester)
    {
        $response = Gate::inspect('delete', $semester);
        $message  = '';
        try {

            if ($response->allowed()) {
                $semester->delete();

                return back()->with('success', 'Semester successfully deleted');
            } else {
                $message = $response->message();
            }

        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('semesters')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->with('error', $message);
    }
}
