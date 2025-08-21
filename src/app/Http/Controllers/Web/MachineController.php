<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Machine;
use App\Models\Series;
use Illuminate\Http\Request;
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

        $machines = $query->paginate(12);
        $categories = Category::all();
        
        // カテゴリーが選択されている場合は、そのカテゴリーのシリーズのみを取得
        if ($request->has('category_id') && $request->category_id) {
            $series = Series::where('category_id', $request->category_id)->get();
        } else {
            $series = Series::all();
        }

        return Inertia::render('Web/Machines/Index', [
            'machines' => $machines,
            'categories' => $categories,
            'series' => $series,
            'selectedCategoryId' => $request->category_id,
            'selectedSeriesId' => $request->series_id,
        ]);
    }

    public function show(Machine $machine): Response
    {
        $machine->load(['category', 'series', 'creator', 'images']);

        return Inertia::render('Web/Machines/Show', [
            'machine' => $machine,
        ]);
    }
}
