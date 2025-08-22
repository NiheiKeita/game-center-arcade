<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Machine;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SeriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_series_can_be_created()
    {
        $category = Category::create(['name' => 'Test Category']);
        
        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
            'description' => 'Test Description',
        ]);

        $this->assertInstanceOf(Series::class, $series);
        $this->assertEquals('Test Series', $series->name);
        $this->assertEquals('Test Description', $series->description);
        $this->assertEquals($category->id, $series->category_id);
    }

    public function test_series_belongs_to_category()
    {
        $category = Category::create(['name' => 'Test Category']);
        
        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
        ]);

        $this->assertInstanceOf(Category::class, $series->category);
        $this->assertEquals('Test Category', $series->category->name);
    }

    public function test_series_has_many_machines()
    {
        $category = Category::create(['name' => 'Test Category']);
        
        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
        ]);

        $machine1 = Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Machine 1',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $machine2 = Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Machine 2',
            'version' => '2.0',
            'created_by' => 1,
        ]);

        $this->assertEquals(2, $series->machines()->count());
        $this->assertTrue($series->machines->contains($machine1));
        $this->assertTrue($series->machines->contains($machine2));
    }

    public function test_series_required_fields()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Series::create([
            'name' => 'Test Series',
            // category_id is missing
        ]);
    }

    public function test_series_category_id_must_exist()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Series::create([
            'category_id' => 999, // non-existent category
            'name' => 'Test Series',
        ]);
    }
}