<?php

namespace App\Support;

use Illuminate\Contracts\Pagination\Paginator;

/**
 * The pagination block every list endpoint returns alongside its items.
 *
 * Two controllers used to hand-roll this array with different keys; anything
 * that reads `meta` (app/blog/page.tsx reads data.meta) gets one shape now.
 * Laravel's own ResourceCollection produces `links` + `meta` for its own
 * shape, which is why this is only for the endpoints that build JSON
 * themselves instead of returning a resource.
 */
class PaginationMeta
{
    public static function for(Paginator $paginated): array
    {
        return [
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'per_page' => $paginated->perPage(),
            'total' => $paginated->total(),
        ];
    }
}
