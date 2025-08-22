<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class TempImage extends Model
{
    protected $fillable = [
        'filename',
        'original_name',
        'path',
        'caption',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * 期限切れの一時画像を削除するスコープ
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    /**
     * 一時画像を永続画像に移動
     */
    public function moveToPermanent(string $directory = 'images'): string
    {
        $oldPath = $this->path;
        $newPath = $directory . '/' . $this->filename;

        // ファイルを移動
        \Storage::disk('public')->move($oldPath, $newPath);

        return $newPath;
    }
}