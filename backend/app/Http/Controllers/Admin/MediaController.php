<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Spatie\Image\Image;
use Spatie\Image\Enums\Fit;

class MediaController extends Controller
{
    /**
     * Handle FilePond uploads.
     */
    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $type = $request->input('type', 'cms'); // avatar, logo, cms
            
            // Store the file first
            $path = $file->store($type, 'public');
            $fullPath = storage_path('app/public/' . $path);

            // Compress/Resize if it's an image
            if (str_starts_with($file->getMimeType(), 'image/')) {
                try {
                    $image = Image::load($fullPath);
                    
                    if ($type === 'avatar') {
                        $image->fit(Fit::Crop, 300, 300);
                    } else if ($type === 'logo') {
                        $image->fit(Fit::Contain, 600, 400);
                    } else {
                        $image->width(1200);
                    }
                    
                    $image->optimize()->save();
                } catch (\Exception $e) {
                    \Log::error('Image compression failed: ' . $e->getMessage());
                }
            }

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
