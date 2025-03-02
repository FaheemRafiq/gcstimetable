<?php

namespace App\Http\Controllers\Admin;

use App\Models\Day;
use Inertia\Inertia;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;

class DayController extends Controller
{
    /**
     * Displays a list of all days for an institution, or all days if user is super admin.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        try {
            // Authorization check
            $this->authorize('viewAny', Day::class);

            $admin = Auth::user();
            $days  = collect(); // Default empty collection

            if ($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin()) {
                // Fetch days via institution relationship
                $days = $admin->institution?->days()
                    ->get() ?? collect();
            } else {
                // Fetch institutions and selected institution_id
                $institutions   = Institution::select('id', 'name')->get();
                $institution_id = request()->input('institution_id', $institutions->first()?->id);

                // Fetch days via relationship
                $institution = Institution::with('days')->find($institution_id);

                if ($institution) {
                    $days = $institution->days ?? collect();
                }
            }

            return Inertia::render('Admin/Days/index', [
                'days'         => $days,
                'institutions' => $institutions ?? [],
            ]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error fetching days', ['error' => $e->getMessage()]);

            return back()->with('error', 'An unexpected error occurred. Please try again.');
        }
    }

    /**
     * Change the status of a given day for an institution.
     *
     * This method checks the user's authorization to change the day status
     * and logs the attempt. It validates the request data, ensuring the
     * 'is_active' field is appropriately set. If the user is a super admin,
     * it also validates the 'institution_id'. It then updates the status of
     * the day in the institution's pivot table. Handles validation,
     * authorization, and general exceptions, logging errors and returning
     * appropriate responses.
     *
     * @param  \Illuminate\Http\Request  $request  The HTTP request object containing the 'is_active' status and optionally 'institution_id'.
     * @param  \App\Models\Day  $day  The day model whose status is to be changed.
     * @return \Illuminate\Http\RedirectResponse Redirects back with success or error messages based on the operation outcome.
     *
     * @throws \Illuminate\Validation\ValidationException If validation fails.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized to change the day status.
     */
    public function change_status(Request $request, Day $day)
    {
        try {
            // Check authorization
            $this->authorize('change_status', $day);

            Log::channel('days')->info('Day status update attempt', [
                'day_id'    => $day->id,
                'is_active' => $request->is_active,
            ]);

            // Validation rules
            $rules = [
                'is_active'      => ['required', Rule::in([Day::ACTIVE, Day::INACTIVE])],
                'institution_id' => ['required', Rule::exists('institutions', 'id')],
            ];

            $validated = $request->validate($rules);

            $institution_id = $validated['institution_id'];

            // Find the pivot record using Eloquent relationship
            $dayInstitution = $day->institutions()->where('institution_id', $institution_id)->first();

            if (! $dayInstitution) {
                return back()->with('error', 'Day not found for the given institution.');
            }

            // Update the pivot record
            $day->institutions()->updateExistingPivot($institution_id, ['is_active' => $validated['is_active']]);

            return back()->with('success', 'Day status updated successfully.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->validator);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error updating day status', ['error' => $e->getMessage()]);

            return back()->with('error', 'An unexpected error occurred. Please try again.');
        }
    }
}
