<?php

namespace App\Traits;

use Illuminate\Support\Str;

/**
 * Give a model a real slug column instead of a slug derived on read.
 *
 * The slug is filled on save when it is empty, and never rewritten when the
 * row is renamed, so existing URLs keep working. Duplicates get a -2, -3 ...
 * suffix, which is what the derived version could not do: two rows called
 * "Plumbing" used to share one slug and only the first ever resolved.
 */
trait HasSlug
{
    protected static function bootHasSlug(): void
    {
        static::saving(function ($model) {
            if ($model->slug) {
                return;
            }

            $model->slug = $model->uniqueSlug($model->slugFromName());
        });
    }

    protected function slugFromName(): string
    {
        $base = Str::slug((string) ($this->name ?? ''));

        return $base !== '' ? $base : 'item';
    }

    /**
     * The unique index spans every row, including soft-deleted ones, so the
     * duplicate check has to see them too - otherwise a trashed row would
     * still be holding the slug.
     */
    protected function uniqueSlug(string $base): string
    {
        $slug = $base;
        $suffix = 2;

        while ($this->slugTaken($slug)) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    protected function slugTaken(string $slug): bool
    {
        $query = $this->newQueryWithoutScopes()->where('slug', $slug);

        if ($this->exists && $this->getKey()) {
            $query->where($this->getKeyName(), '!=', $this->getKey());
        }

        return $query->exists();
    }
}
