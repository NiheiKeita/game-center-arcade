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

        // カテゴリーが選択されている場合は、そのカテゴリーのシリーズのみを取得
        if ($request->has('category_id') && $request->category_id) {
            $series = Series::where('category_id', $request->category_id)->get();
        } else {
            $series = Series::all();
        }

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

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'series_id' => 'required|exists:series,id',
            'name' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'nullable|string',
            'temp_image_ids' => 'nullable|array',
            'temp_image_ids.*' => 'exists:temp_images,id',
        ]);

        $adminId = Auth::guard('admin')->id();
        if ($adminId !== null && is_array($validated)) {
            $validated['created_by'] = $adminId;
        }

        if (!is_array($validated)) {
            throw new \InvalidArgumentException('Validation data must be an array');
        }

        /** @var array<string, mixed> $validatedData */
        $validatedData = $validated;
        $machine = Machine::create($validatedData);

        \Log::info('Machine created with ID: ' . $machine->id);

        // 一時画像を永続化
        $tempImageIds = $request->input('temp_image_ids');
        \Log::info('=== MACHINE CREATION DEBUG ===');
        \Log::info('Request temp_image_ids: ' . json_encode($tempImageIds));
        \Log::info('Request all inputs: ' . json_encode($request->all()));
        
        if (is_array($tempImageIds) && !empty($tempImageIds)) {
            \Log::info('Processing temp images: ' . json_encode($tempImageIds));

            foreach ($tempImageIds as $tempImageId) {
                /** @var \App\Models\TempImage|null $tempImage */
                $tempImage = \App\Models\TempImage::find($tempImageId);

                if ($tempImage instanceof \App\Models\TempImage) {
                    try {
                        // ファイルを永続ディレクトリに移動
                        $newPath = $tempImage->moveToPermanent('images');

                        // MachineImageレコード作成
                        $imageRecord = MachineImage::create([
                            'machine_id' => $machine->id,
                            'image_url' => $newPath,
                            'caption' => $tempImage->caption,
                        ]);

                        \Log::info('MachineImage created with ID: ' . $imageRecord->id);

                        // 一時画像レコードを削除
                        $tempImage->delete();
                    } catch (\Exception $e) {
                        \Log::error('Failed to process temp image: ' . $e->getMessage());
                    }
                }
            }
        } else {
            \Log::info('No temp images to process');
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

    public function update(Request $request, Machine $machine): \Illuminate\Http\RedirectResponse
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

        if (!is_array($validated)) {
            throw new \InvalidArgumentException('Validation data must be an array');
        }

        /** @var array<string, mixed> $validatedData */
        $validatedData = $validated;
        $machine->update($validatedData);

        $removeImages = $request->input('remove_images');
        if (is_array($removeImages)) {
            foreach ($removeImages as $imageId) {
                /** @var MachineImage|null $image */
                $image = MachineImage::find($imageId);
                if ($image && $image->machine_id === $machine->id) {
                    if ($image->image_url) {
                        Storage::disk('public')->delete($image->image_url);
                    }
                    $image->delete();
                }
            }
        }

        if ($request->hasFile('images')) {
            $captions = $request->input('captions');
            $captionsArray = is_array($captions) ? $captions : [];

            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('images', 'public');

                MachineImage::create([
                    'machine_id' => $machine->id,
                    'image_url' => $path,
                    'caption' => $captionsArray[$index] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.machines.index')
            ->with('success', '筐体が更新されました。');
    }

    public function destroy(Machine $machine): \Illuminate\Http\RedirectResponse
    {
        /** @var \App\Models\MachineImage $image */
        foreach ($machine->images as $image) {
            if ($image->image_url) {
                Storage::disk('public')->delete($image->image_url);
            }
        }

        $machine->delete();

        return redirect()->route('admin.machines.index')
            ->with('success', '筐体が削除されました。');
    }
}
