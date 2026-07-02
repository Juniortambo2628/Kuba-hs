<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\Image\Enums\Fit;
use Spatie\Image\Image;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ImageOptimizationService
{
    public const PRESET_AVATAR = 'avatar';

    public const PRESET_LOGO = 'logo';

    public const PRESET_BANNER = 'banner';

    public const PRESET_THUMBNAIL = 'thumbnail';

    public const PRESET_CMS = 'cms';

    public const PRESET_CATEGORY = 'category';

    public const PRESET_BOOKING = 'booking';

    public const PRESET_REVIEW = 'review';

    public const PRESET_DOCUMENT = 'document';

    public const PRESET_GENERAL = 'general';

    /**
     * Store an uploaded file and optimize if it is a raster image.
     */
    public function storeAndOptimize(
        UploadedFile $file,
        string $directory,
        string $disk = 'public',
        string $preset = self::PRESET_GENERAL
    ): string {
        $path = $file->store($directory, $disk);
        $fullPath = Storage::disk($disk)->path($path);
        $this->optimizePath($fullPath, $preset, $file->getMimeType());

        return $path;
    }

    /**
     * Optimize an image on disk (no-op for non-images / SVG).
     */
    public function optimizePath(
        string $fullPath,
        string $preset = self::PRESET_GENERAL,
        ?string $mimeType = null
    ): void {
        if (! $this->isOptimizableImage($fullPath, $mimeType)) {
            return;
        }

        try {
            $this->applyPreset(Image::load($fullPath), $preset)->optimize()->save();
        } catch (\Throwable $e) {
            Log::warning('Image optimization failed', [
                'path' => $fullPath,
                'preset' => $preset,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Optimize a Spatie media library item after upload.
     */
    public function optimizeMedia(Media $media, string $preset = self::PRESET_GENERAL): void
    {
        if (! $this->isOptimizableImage($media->getPath(), $media->mime_type)) {
            return;
        }

        try {
            $this->applyPreset(Image::load($media->getPath()), $preset)->optimize()->save();
        } catch (\Throwable $e) {
            Log::warning('Media optimization failed', [
                'media_id' => $media->id,
                'preset' => $preset,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Resolve preset from admin/cms upload type slug.
     */
    public function presetFromAdminType(string $type): string
    {
        return match ($type) {
            'avatar' => self::PRESET_AVATAR,
            'logo' => self::PRESET_LOGO,
            'category_thumbnail' => self::PRESET_CATEGORY,
            'cms' => self::PRESET_CMS,
            default => self::PRESET_CMS,
        };
    }

    /**
     * Resolve preset from media collection name.
     */
    public function presetFromCollection(string $collection, ?string $modelType = null): string
    {
        return match ($collection) {
            'avatars' => self::PRESET_AVATAR,
            'logos' => self::PRESET_LOGO,
            'banners' => self::PRESET_BANNER,
            'thumbnail', 'icons' => self::PRESET_THUMBNAIL,
            'site_settings' => self::PRESET_CMS,
            'issue_images' => self::PRESET_BOOKING,
            'review_images' => self::PRESET_REVIEW,
            'services' => self::PRESET_THUMBNAIL,
            default => self::PRESET_GENERAL,
        };
    }

    private function isOptimizableImage(string $path, ?string $mimeType = null): bool
    {
        if ($mimeType === 'image/svg+xml') {
            return false;
        }

        if ($mimeType !== null) {
            return str_starts_with($mimeType, 'image/') && $mimeType !== 'image/gif';
        }

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'avif'], true);
    }

    private function applyPreset(Image $image, string $preset): Image
    {
        return match ($preset) {
            self::PRESET_AVATAR => $image->fit(Fit::Crop, 400, 400),
            self::PRESET_LOGO => $image->fit(Fit::Contain, 600, 400),
            self::PRESET_BANNER => $image->fit(Fit::Crop, 1200, 600),
            self::PRESET_THUMBNAIL, self::PRESET_CATEGORY => $image->fit(Fit::Crop, 800, 600),
            self::PRESET_CMS => $image->width(1200),
            self::PRESET_BOOKING, self::PRESET_REVIEW => $image->width(1200),
            self::PRESET_DOCUMENT => $image->width(1600),
            default => $image->width(1600),
        };
    }
}
