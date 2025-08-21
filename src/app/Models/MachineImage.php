<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MachineImage extends Model
{
    protected $fillable = [
        'machine_id',
        'image_url',
        'caption',
    ];

    protected $appends = ['full_image_url'];

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function getFullImageUrlAttribute(): string
    {
        if ($this->image_url) {
            return asset('storage/' . $this->image_url);
        }
        return '';
    }
}
