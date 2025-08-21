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

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }
}
