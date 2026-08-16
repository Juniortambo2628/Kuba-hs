<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFAQRequest;
use App\Models\FAQ;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FAQController extends Controller
{
    public function index() {
        return response()->json(FAQ::orderBy('sort_order')->orderBy('id', 'desc')->get());
    }

    public function store(StoreFAQRequest $request) {
        $validated = $request->validated();

        $faq = FAQ::create($validated);
        Cache::forget('api_faqs_all');

        return response()->json($faq, 201);

    }

    public function show(FAQ $faq) {
        return response()->json($faq);
    }

    public function update(StoreFAQRequest $request, FAQ $faq) {
        $validated = $request->validated();

        $faq->update($validated);
        Cache::forget('api_faqs_all');

        return response()->json($faq);

    }

    public function destroy(FAQ $faq) {
        $faq->delete();
        Cache::forget('api_faqs_all');

        return response()->json(null, 204);

    }

    public function reorder(Request $request) {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:faqs,id',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            FAQ::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('api_faqs_all');

        return response()->json(['message' => 'Reordered successfully']);

    }
}
