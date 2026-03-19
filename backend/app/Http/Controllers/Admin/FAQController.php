<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FAQ;
use Illuminate\Http\Request;

class FAQController extends Controller
{
    public function index()
    {
        return response()->json(FAQ::orderBy('order')->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $faq = FAQ::create($validated);
        return response()->json($faq, 201);
    }

    public function show(FAQ $faq)
    {
        return response()->json($faq);
    }

    public function update(Request $request, FAQ $faq)
    {
        $validated = $request->validate([
            'question' => 'sometimes|required|string|max:255',
            'answer' => 'sometimes|required|string',
            'category' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $faq->update($validated);
        return response()->json($faq);
    }

    public function destroy(FAQ $faq)
    {
        $faq->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:faqs,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            FAQ::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Reordered successfully']);
    }
}
