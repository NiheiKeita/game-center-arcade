<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Machine;
use App\Models\MachineImage;
use App\Models\Series;
use App\Models\UserCollection;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MachineTest extends TestCase
{
    use RefreshDatabase;

    private function createTestData()
    {
        $category = Category::create(['name' => 'Test Category']);
        $series = Series::create([
            'category_id' => $category->id,
            'name' => 'Test Series',
        ]);

        return [$category, $series];
    }

    public function test_machine_can_be_created()
    {
        [$category, $series] = $this->createTestData();

        $machine = Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'description' => 'Test Description',
            'created_by' => 1,
        ]);

        $this->assertInstanceOf(Machine::class, $machine);
        $this->assertEquals('Test Machine', $machine->name);
        $this->assertEquals('1.0', $machine->version);
        $this->assertEquals('Test Description', $machine->description);
    }

    public function test_machine_belongs_to_category()
    {
        [$category, $series] = $this->createTestData();

        $machine = Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $this->assertInstanceOf(Category::class, $machine->category);
        $this->assertEquals('Test Category', $machine->category->name);
    }

    public function test_machine_belongs_to_series()
    {
        [$category, $series] = $this->createTestData();

        $machine = Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $this->assertInstanceOf(Series::class, $machine->series);
        $this->assertEquals('Test Series', $machine->series->name);
    }

    public function test_machine_has_many_images()
    {
        [$category, $series] = $this->createTestData();

        $machine = Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $image1 = MachineImage::create([
            'machine_id' => $machine->id,
            'image_url' => 'test1.jpg',
            'caption' => 'Test Image 1',
        ]);

        $image2 = MachineImage::create([
            'machine_id' => $machine->id,
            'image_url' => 'test2.jpg',
            'caption' => 'Test Image 2',
        ]);

        $this->assertEquals(2, $machine->images()->count());
        $this->assertTrue($machine->images->contains($image1));
        $this->assertTrue($machine->images->contains($image2));
    }

    public function test_machine_has_many_user_collections()
    {
        [$category, $series] = $this->createTestData();

        $machine = Machine::create([
            'category_id' => $category->id,
            'series_id' => $series->id,
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);

        $collection = UserCollection::create([
            'user_id' => 1,
            'machine_id' => $machine->id,
            'comment' => 'Test Comment',
        ]);

        $this->assertEquals(1, $machine->userCollections()->count());
        $this->assertTrue($machine->userCollections->contains($collection));
    }

    public function test_machine_required_fields()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Machine::create([
            'name' => 'Test Machine',
            'version' => '1.0',
            // category_id and series_id are missing
        ]);
    }

    public function test_machine_foreign_key_constraints()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Machine::create([
            'category_id' => 999, // non-existent category
            'series_id' => 999, // non-existent series
            'name' => 'Test Machine',
            'version' => '1.0',
            'created_by' => 1,
        ]);
    }
}
