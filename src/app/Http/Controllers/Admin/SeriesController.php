<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Series;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeriesController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Series::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $series = $query->withCount('machines')->get();
        $categories = Category::all();

        return Inertia::render('Admin/Series/Index', [
            'series' => $series,
            'categories' => $categories,
            'selectedCategoryId' => $request->category_id,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::all();

        return Inertia::render('Admin/Series/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Series::create($validated);

        return redirect()->route('admin.series.index')
            ->with('success', 'シリーズが作成されました。');
    }

    public function show(Series $series): Response
    {
        $series->load(['category', 'machines.images']);

        return Inertia::render('Admin/Series/Show', [
            'series' => $series,
        ]);
    }

    public function edit(Series $series): Response
    {
        $categories = Category::all();

        return Inertia::render('Admin/Series/Edit', [
            'series' => $series,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Series $series)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $series->update($validated);

        return redirect()->route('admin.series.index')
            ->with('success', 'シリーズが更新されました。');
    }

    public function destroy(Series $series)
    {
        $series->delete();

        return redirect()->route('admin.series.index')
            ->with('success', 'シリーズが削除されました。');
    }
}
