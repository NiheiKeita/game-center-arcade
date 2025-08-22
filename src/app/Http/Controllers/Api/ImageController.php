<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * 画像を一時アップロード
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB
            'caption' => 'nullable|string|max:255',
        ]);

        $file = $request->file('image');
        $path = $file->store('temp-images', 'public');

        if ($path === false) {
            return response()->json(['error' => 'Failed to store file'], 500);
        }

        $tempImage = TempImage::create([
            'filename' => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'caption' => $request->input('caption', ''),
            'expires_at' => now()->addHours(24), // 24時間後に期限切れ
        ]);

        return response()->json([
            'id' => $tempImage->id,
            'filename' => $tempImage->filename,
            'original_name' => $tempImage->original_name,
            'url' => asset('storage/' . $path),
            'caption' => $tempImage->caption,
        ]);
    }

    /**
     * 一時アップロード画像を削除
     */
    public function destroy(TempImage $tempImage): JsonResponse
    {
        // ファイルを削除
        if (Storage::disk('public')->exists($tempImage->path)) {
            Storage::disk('public')->delete($tempImage->path);
        }

        // レコードを削除
        $tempImage->delete();

        return response()->json(['success' => true]);
    }
}
