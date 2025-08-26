import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'
import { useMachineEdit } from './hooks'

export default function MachineEdit() {
  const {
    data,
    setData,
    machine,
    categories,
    series,
    imagePreviews,
    removedImageIds,
    processing,
    errors,
    handleImageChange,
    handleCategoryChange,
    handleSeriesChange,
    updateCaption,
    removeNewImage,
    removeExistingImage,
    restoreExistingImage,
    submit
  } = useMachineEdit()

  return (
    <AdminLayout>
      <Head title={`${machine.name} - 筐体編集`} />

      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">筐体編集</h1>
              <p className="mt-2 text-gray-600">{machine.name} の情報を編集します</p>
            </div>
            <Link href="/admin/machines" className="text-blue-600 hover:text-blue-800">
              ← 筐体一覧に戻る
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <form onSubmit={submit} encType="multipart/form-data">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  カテゴリー <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.category_id}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">カテゴリーを選択</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  シリーズ <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.series_id}
                  onChange={(e) => handleSeriesChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">シリーズを選択</option>
                  {series.map(seriesItem => (
                    <option key={seriesItem.id} value={seriesItem.id}>
                      {seriesItem.name}
                    </option>
                  ))}
                </select>
                {errors.series_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.series_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  筐体名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  バージョン <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.version}
                  onChange={(e) => setData('version', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                {errors.version && (
                  <p className="mt-1 text-sm text-red-600">{errors.version}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="筐体の説明を入力してください..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                既存の画像
              </label>
              {machine.images && machine.images.length > 0 ? (
                <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {machine.images.map((image) => (
                    <div 
                      key={image.id} 
                      className={`relative ${removedImageIds.includes(image.id) ? 'opacity-50' : ''}`}
                    >
                      <img
                        src={image.full_image_url}
                        alt={image.caption || '筐体画像'}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      {removedImageIds.includes(image.id) ? (
                        <button
                          type="button"
                          onClick={() => restoreExistingImage(image.id)}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
                        >
                          ↶
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{image.caption || 'キャプションなし'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">既存の画像はありません</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                新しい画像を追加
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
              
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`新規プレビュー ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        ×
                      </button>
                      <input
                        type="text"
                        value={data.captions[index] || ''}
                        onChange={(e) => updateCaption(index, e.target.value)}
                        placeholder="キャプション（任意）"
                        className="mt-2 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Link href="/admin/machines">
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                {processing ? '更新中...' : '筐体を更新'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}