<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
    ];

    public function series(): HasMany
    {
        return $this->hasMany(Series::class);
    }

    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class);
    }
}
