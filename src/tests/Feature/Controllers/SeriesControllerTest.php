<?php

namespace Tests\Feature\Controllers;

use App\Models\Category;
use App\Models\Series;
use App\Models\Machine;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SeriesControllerTest extends TestCase
{
    use RefreshDatabase;

    private function createTestCategory()
    {
        return Category::create(['name' => 'Test Category']);
    }

    public function test_index_displays_series_with_category_filter()
    {
        $category1 = Category::create(['name' => 'Category 1']);
        $category2 = Category::create(['name' => 'Category 2']);

        Series::create([
            'category_id' => $category1->id,
            'name' => 'Series 1',
        ]);

        Series::create([
            'category_id' => $category2->id,
            'name' => 'Series 2',
        ]);

        // Test without filter
        $response = $this->get(route('admin.series.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Series/Index')
                ->has('series', 2)
                ->has('categories', 2));

        // Test with category filter
        $response = $this->get(route('admin.series.index', ['category_id' => $category1->id]));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Series/Index')
                ->has('series', 1)
                ->where('series.0.name', 'Series 1')
                ->where('selectedCategoryId', $category1->id));
    }

    public function test_create_displays_create_form_with_categories()
    {
        $this->createTestCategory();

        $response = $this->get(route('admin.series.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Series/Create')
                ->has('categories', 1));
    }

    public function test_store_creates_new_series()
    {
        $category = $this->createTestCategory();

        $seriesData = [
            'category_id' => $category->id,
            'name' => 'New Series',
            'description' => 'Test Description',
        ];

        $response = $this->post(route('admin.series.store'), $seriesData);

        $response->assertRedirect(route('admin.series.index'));
        $response->assertSessionHas('success', 'シリーズが作成されました。');

        $this->assertDatabaseHas('series', [
            'category_id' => $category->id,
            'name' => 'New Series',
            'description' => 'Test Description',
        ]);
    }

    public function test_store_validates_required_fields()
    {
        $response = $this->post(route('admin.series.store'), []);

        $response->assertSessionHasErrors(['category_id', 'name']);
    }

    public function test_store_validates_category_exists()
    {
        $response = $this->post(route('admin.series.store'), [
            'category_id' => 999, // non-existent category
            'name' => 'Test Series',
        ]);

        $response->assertSessionHasErrors(['category_id']);
    }

    public function test_show_displays_series_with_machines()
    {
        $category = $this->createTestCategory();

        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
            'description' => 'Test Description',
        ]);

        Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $response = $this->get(route('admin.series.show', $series));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Series/Show')
                ->where('series.name', 'Test Series')
                ->where('series.description', 'Test Description')
                ->has('series.machines', 1));
    }

    public function test_edit_displays_edit_form()
    {
        $category = $this->createTestCategory();

        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
        ]);

        $response = $this->get(route('admin.series.edit', $series));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Series/Edit')
                ->where('series.name', 'Test Series')
                ->has('categories', 1));
    }

    public function test_update_modifies_existing_series()
    {
        $category = $this->createTestCategory();

        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Old Name',
        ]);

        $updateData = [
            'category_id' => $category->id,
            'name' => 'Updated Name',
            'description' => 'Updated Description',
        ];

        $response = $this->put(route('admin.series.update', $series), $updateData);

        $response->assertRedirect(route('admin.series.index'));
        $response->assertSessionHas('success', 'シリーズが更新されました。');

        $this->assertDatabaseHas('series', [
            'id' => $series->id,
            'name' => 'Updated Name',
            'description' => 'Updated Description',
        ]);
    }

    public function test_destroy_deletes_series()
    {
        $category = $this->createTestCategory();

        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
        ]);

        $response = $this->delete(route('admin.series.destroy', $series));

        $response->assertRedirect(route('admin.series.index'));
        $response->assertSessionHas('success', 'シリーズが削除されました。');

        $this->assertDatabaseMissing('series', [
            'id' => $series->id,
        ]);
    }
}
