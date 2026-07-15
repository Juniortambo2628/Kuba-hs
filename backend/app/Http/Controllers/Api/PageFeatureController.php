<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageFeatureResource;
use App\Models\PageFeature;

use Illuminate\Http\Request;

class PageFeatureController extends Controller
{
    public function index(Request $request)
    {
        $query = PageFeature::where('is_active', true);

        if ($request->has('page')) {
            $query->where('page_name', $request->query('page'));
        }

        $features = $query->orderBy('order_index')->get();

        return PageFeatureResource::collection($features);
    }
}
