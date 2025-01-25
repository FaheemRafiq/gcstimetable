<?php

namespace App\Http\Controllers\Admin;

use App\Models\Section;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\SectionRequest;
use Illuminate\Database\QueryException;

class SectionController extends Controller
{
    public const ONLY = ['store', 'update', 'destroy'];

    /**
     * Store a newly created resource in storage.
     */
    public function store(SectionRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Section::class);
        $message    = '';

        try {
            if ($response->allowed()) {
                Section::create($attributes);

                return back()->with('success', 'Section successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('sections')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SectionRequest $request, Section $section)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $section);
        $message    = '';

        try {
            if ($response->allowed()) {
                $section->update($attributes);

                return back()->with('success', 'Section successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('sections')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section)
    {
        $response = Gate::inspect('delete', $section);
        $message  = '';

        try {
            if ($response->allowed()) {
                $section->delete();

                return back()->with('success', 'Section successfully deleted');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('sections')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }
}
