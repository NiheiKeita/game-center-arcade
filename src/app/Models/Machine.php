<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Machine extends Model
{
    protected $fillable = [
        'category_id',
        'series_id',
        'name',
        'version',
        'description',
        'created_by',
    ];

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsTo<Series, $this>
     */
    public function series(): BelongsTo
    {
        return $this->belongsTo(Series::class);
    }

    /**
     * @return BelongsTo<AdminUser, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'created_by');
    }

    /**
     * @return HasMany<MachineImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(MachineImage::class);
    }

    /**
     * @return HasMany<UserCollection, $this>
     */
    public function userCollections(): HasMany
    {
        return $this->hasMany(UserCollection::class);
    }
}
