<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    public function index()
    {
        return EmailTemplate::all();
    }

    public function show(EmailTemplate $emailTemplate)
    {
        return $emailTemplate;
    }

    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $emailTemplate->update($validated);

        return response()->json([
            'message' => 'Email template updated successfully',
            'template' => $emailTemplate
        ]);
    }
}
