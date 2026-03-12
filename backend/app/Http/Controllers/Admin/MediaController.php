<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Handle FilePond uploads.
     */
    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('cms', 'public');
            return response('/storage/' . $path, 200, ['Content-Type' => 'text/plain']);
        }

        return response('No file uploaded', 400);
    }

    /**
     * Handle FilePond revert/delete.
     */
    public function delete(Request $request)
    {
        $path = str_replace('/storage/', '', $request->getContent());
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response('Deleted', 200);
        }

        return response('File not found', 404);
    }
}
