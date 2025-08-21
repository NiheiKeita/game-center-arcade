import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'
import { useMachineCreate } from './hooks'

export default function MachineCreate() {
  const {
    data,
    setData,
    categories,
    series,
    imagePreviews,
    processing,
    errors,
    handleImageChange,
    updateCaption,
    removeImage,
    submit
  } = useMachineCreate()

  return (
    <AdminLayout>
      <Head title="筐体作成" />

      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">筐体作成</h1>
              <p className="mt-2 text-gray-600">新しい筐体情報を登録します</p>
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
                  onChange={(e) => setData('category_id', e.target.value)}
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
                  onChange={(e) => setData('series_id', e.target.value)}
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
                画像
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
                        alt={`プレビュー ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
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
                {processing ? '作成中...' : '筐体を作成'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}