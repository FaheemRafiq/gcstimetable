<?php

namespace App\Exceptions;

use Throwable;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e): void {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        // dd($exception);
        if ($exception instanceof ModelNotFoundException) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        if ($exception instanceof AuthorizationException) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $httpException = $exception instanceof HttpException;
        $statusCode    = $httpException
            ? $exception->getStatusCode()
            : 500; // Default to 500 for any unexpected exception

        if ($httpException && in_array($statusCode, [403, 404, 500, 503])) {
            // Determine if the user is logged in
            $isLoggedIn = Auth::check();

            // detemine if User Logged in or Not..
            return Inertia::render('ErrorPage', ['statusCode' => $statusCode, 'isLoggedIn' => $isLoggedIn])
                ->toResponse($request)
                ->setStatusCode($statusCode);
        }

        return parent::render($request, $exception);
    }
}
