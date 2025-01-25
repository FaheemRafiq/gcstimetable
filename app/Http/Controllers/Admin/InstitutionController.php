<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RoleEnum;
use App\Models\Institution;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;
use App\Http\Requests\InstitutionRequest;
use App\Http\Resources\InstitutionResource;

class InstitutionController extends Controller
{
    public const ONLY = ['index', 'show', 'store', 'update', 'destroy'];

    public function __construct()
    {
        $this->middleware('role:'.RoleEnum::SUPER_ADMIN->value);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        try {
            $institutions = Institution::orderBy('name', 'asc')->get();

            return inertia()->render('Admin/Institutions/index', [
                'institutions' => InstitutionResource::collection($institutions),
            ]);
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('institutions')->error('QueryException', $logData);

            return back()->withErrors(['message' => 'Database error 👉 Something went wrong!']);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(InstitutionRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Institution::class);
        $message    = '';

        try {
            if ($response->allowed()) {
                Institution::create($attributes);

                return back()->with('success', 'Institution successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('institutions')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Display the specified resource.
     *
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function show(Institution $institution)
    {
        $response = Gate::inspect('view', $institution);
        $message  = '';

        if ($response->allowed()) {
            return inertia()->render('Admin/Institutions/show', [
                'institution' => new InstitutionResource($institution),
            ]);
        } else {
            $message = $response->message();
        }

        return back()->with('error', $message);
    }

    /**
     * Update the specified resource in storage.
     *
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(InstitutionRequest $request, Institution $institution)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $institution);
        $message    = '';

        try {
            if ($response->allowed()) {
                $institution->update($attributes);

                return back()->with('success', 'Resource successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('institutions')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     *
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Institution $institution)
    {
        $response = Gate::inspect('delete', $institution);
        $message  = '';

        try {
            if ($response->allowed()) {
                $institution->delete();

                return back()->with('success', 'Resource successfully deleted');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('institutions')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->with('error', $message);
    }
}
