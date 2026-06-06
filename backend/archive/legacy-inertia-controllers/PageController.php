<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('About');
    }

    public function services()
    {
        return Inertia::render('Services/Index', [
            'categories' => ServiceCategory::with('services')->orderBy('sort_order')->get()
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($validated);

        return back()->with('success', 'Your message has been sent successfully. We will get back to you soon!');
    }
}
