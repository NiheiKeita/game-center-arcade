<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdminUser::firstOrCreate(
            ['email' => 'keita.nihei.1996.05.29@gmail.com'],
            [
                'name' => 'Keita Nihei',
                'email' => 'keita.nihei.1996.05.29@gmail.com',
                'password' => Hash::make('pass'),
            ]
        );
    }
}
