<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        // The Inertia route this used to point at is gone; the dashboard lives
        // on the Next.js origin now.
        $dashboard = config('app.frontend_url').'/dashboard?verified=1';

        if ($request->user()->hasVerifiedEmail()) {
            return redirect($dashboard);
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect($dashboard);
    }
}
