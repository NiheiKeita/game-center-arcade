<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Machine;
use App\Models\MachineImage;
use App\Models\Series;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MachineController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Machine::with(['category', 'series', 'creator', 'images']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('series_id')) {
            $query->where('series_id', $request->series_id);
        }

        $machines = $query->get();
        $categories = Category::all();
        $series = Series::all();

        return Inertia::render('Admin/Machines/Index', [
            'machines' => $machines,
            'categories' => $categories,
            'series' => $series,
            'selectedCategoryId' => $request->category_id,
            'selectedSeriesId' => $request->series_id,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::all();
        $series = Series::all();

        return Inertia::render('Admin/Machines/Create', [
            'categories' => $categories,
            'series' => $series,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'series_id' => 'required|exists:series,id',
            'name' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'captions' => 'nullable|array',
            'captions.*' => 'nullable|string|max:255',
        ]);

        $validated['created_by'] = Auth::guard('admin')->id();

        $machine = Machine::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('images', 'public');
                
                MachineImage::create([
                    'machine_id' => $machine->id,
                    'image_url' => $path,
                    'caption' => $request->captions[$index] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.machines.index')
            ->with('success', '筐体が作成されました。');
    }

    public function show(Machine $machine): Response
    {
        $machine->load(['category', 'series', 'creator', 'images']);

        return Inertia::render('Admin/Machines/Show', [
            'machine' => $machine,
        ]);
    }

    public function edit(Machine $machine): Response
    {
        $categories = Category::all();
        $series = Series::all();
        $machine->load('images');

        return Inertia::render('Admin/Machines/Edit', [
            'machine' => $machine,
            'categories' => $categories,
            'series' => $series,
        ]);
    }

    public function update(Request $request, Machine $machine)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'series_id' => 'required|exists:series,id',
            'name' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'captions' => 'nullable|array',
            'captions.*' => 'nullable|string|max:255',
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'integer|exists:machine_images,id',
        ]);

        $machine->update($validated);

        if ($request->has('remove_images')) {
            foreach ($request->remove_images as $imageId) {
                $image = MachineImage::find($imageId);
                if ($image && $image->machine_id === $machine->id) {
                    Storage::disk('public')->delete($image->image_url);
                    $image->delete();
                }
            }
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('images', 'public');
                
                MachineImage::create([
                    'machine_id' => $machine->id,
                    'image_url' => $path,
                    'caption' => $request->captions[$index] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.machines.index')
            ->with('success', '筐体が更新されました。');
    }

    public function destroy(Machine $machine)
    {
        foreach ($machine->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }

        $machine->delete();

        return redirect()->route('admin.machines.index')
            ->with('success', '筐体が削除されました。');
    }
}
