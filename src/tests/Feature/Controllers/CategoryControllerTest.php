<?php

namespace Tests\Feature\Controllers;

use App\Models\Category;
use App\Models\Series;
use App\Models\Machine;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_displays_categories_with_counts()
    {
        $category = Category::create(['name' => 'Test Category']);

        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
        ]);

        Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $response = $this->get(route('admin.categories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Categories/Index')
                ->has('categories', 1)
                ->where('categories.0.name', 'Test Category')
                ->where('categories.0.series_count', 1)
                ->where('categories.0.machines_count', 1));
    }

    public function test_create_displays_create_form()
    {
        $response = $this->get(route('admin.categories.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Categories/Create'));
    }

    public function test_store_creates_new_category()
    {
        $categoryData = [
            'name' => 'New Category',
        ];

        $response = $this->post(route('admin.categories.store'), $categoryData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'カテゴリーが作成されました。');

        $this->assertDatabaseHas('categories', [
            'name' => 'New Category',
        ]);
    }

    public function test_store_validates_required_fields()
    {
        $response = $this->post(route('admin.categories.store'), []);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_store_validates_name_max_length()
    {
        $longName = str_repeat('a', 256);

        $response = $this->post(route('admin.categories.store'), [
            'name' => $longName,
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_show_displays_category_with_relations()
    {
        $category = Category::create(['name' => 'Test Category']);

        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
        ]);

        Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $response = $this->get(route('admin.categories.show', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Categories/Show')
                ->where('category.name', 'Test Category')
                ->has('category.series', 1)
                ->has('category.machines', 1));
    }

    public function test_edit_displays_edit_form()
    {
        $category = Category::create(['name' => 'Test Category']);

        $response = $this->get(route('admin.categories.edit', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Categories/Edit')
                ->where('category.name', 'Test Category'));
    }

    public function test_update_modifies_existing_category()
    {
        $category = Category::create(['name' => 'Old Name']);

        $updateData = [
            'name' => 'Updated Name',
        ];

        $response = $this->put(route('admin.categories.update', $category), $updateData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'カテゴリーが更新されました。');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_destroy_deletes_category()
    {
        $category = Category::create(['name' => 'Test Category']);

        $response = $this->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'カテゴリーが削除されました。');

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }
}
