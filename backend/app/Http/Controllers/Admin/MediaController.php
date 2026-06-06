<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ImageOptimizationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function __construct(
        private readonly ImageOptimizationService $images
    ) {}

    /**
     * Handle FilePond uploads.
     */
    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            $type = $request->input('type', 'cms');
            $preset = $this->images->presetFromAdminType($type);
            $path = $this->images->storeAndOptimize(
                $request->file('file'),
                $type,
                'public',
                $preset
            );

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
