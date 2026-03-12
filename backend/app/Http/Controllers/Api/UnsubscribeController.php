<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UnsubscribeController extends Controller
{
    public function unsubscribe(Request $request)
    {
        $email = $request->query('email');
        
        if (!$email) {
            return response()->json(['message' => 'Email is required.'], 400);
        }

        $user = User::where('email', $email)->first();

        if ($user) {
            $user->update(['unsubscribed_from_emails' => true]);
        }

        return view('emails.unsubscribed', ['email' => $email]);
    }
}
