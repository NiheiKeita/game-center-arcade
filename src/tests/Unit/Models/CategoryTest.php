<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Machine;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_can_be_created()
    {
        $category = Category::create([
            'name' => 'Test Category',
        ]);

        $this->assertInstanceOf(Category::class, $category);
        $this->assertEquals('Test Category', $category->name);
        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
        ]);
    }

    public function test_category_has_series_relationship()
    {
        $category = Category::create(['name' => 'Test Category']);
        
        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
            'description' => 'Test Description',
        ]);

        $this->assertTrue($category->series()->exists());
        $this->assertEquals(1, $category->series()->count());
        $this->assertEquals('Test Series', $category->series->first()->name);
    }

    public function test_category_has_machines_relationship()
    {
        $category = Category::create(['name' => 'Test Category']);
        
        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
        ]);

        $machine = Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $this->assertTrue($category->machines()->exists());
        $this->assertEquals(1, $category->machines()->count());
        $this->assertEquals('Test Machine', $category->machines->first()->name);
    }

    public function test_category_name_is_required()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Category::create([]);
    }

    public function test_category_name_has_max_length()
    {
        $longName = str_repeat('a', 256);
        
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Category::create([
            'name' => $longName,
        ]);
    }
}