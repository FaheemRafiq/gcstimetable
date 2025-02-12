<?php

namespace App\Http\Controllers\Admin\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status'           => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        try {
            info('Attempting login for user '.$request->email);

            $request->authenticate();

            $user = Auth::user();

            if ($user->isInstitutionAdmin() && is_null($user->institution_id)) {
                $this->redirectInvalidUser($request);
            }

            if ($user->isDepartmentAdmin() && (is_null($user->department_id) || is_null($user->institution_id))) {
                $this->redirectInvalidUser($request);
            }

            $request->session()->regenerate();

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors(['email' => 'Login failed. Please try again.']);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }

    protected function redirectInvalidUser($request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        throw ValidationException::withMessages([
            'email' => trans('auth.incomplete_management'),
        ]);
    }
}
