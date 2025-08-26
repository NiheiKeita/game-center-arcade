import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'
import { useAdminMachinesIndex } from './hooks'

export default function MachinesIndex() {
  const {
    machines,
    categories,
    series,
    selectedCategoryId,
    selectedSeriesId,
    handleCategoryChange,
    handleSeriesChange
  } = useAdminMachinesIndex()

  return (
    <AdminLayout>
      <Head title="筐体管理" />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">筐体一覧</h2>
                <Link href="/admin/machines/create">
                  <Button>新規筐体作成</Button>
                </Link>
              </div>

              <div className="mb-6 grid max-w-2xl grid-cols-2 gap-4">
                <div>
                  <select
                    value={selectedCategoryId?.toString() || ''}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">すべてのカテゴリー</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedSeriesId?.toString() || ''}
                    onChange={(e) => handleSeriesChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">すべてのシリーズ</option>
                    {series.map(seriesItem => (
                      <option key={seriesItem.id} value={seriesItem.id.toString()}>
                        {seriesItem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {machines.map((machine) => (
                  <div key={machine.id} className="rounded-lg bg-gray-50 p-4">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      {machine.images.length > 0 ? (
                        <img
                          src={machine.images[0].full_image_url}
                          alt={machine.name}
                          className="h-48 w-full rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-48 w-full items-center justify-center rounded bg-gray-200">
                          <span className="text-gray-400">画像なし</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="mb-2 text-lg font-semibold">{machine.name}</h3>
                    <p className="mb-1 text-sm text-gray-600">バージョン: {machine.version}</p>
                    <p className="mb-1 text-sm text-gray-600">カテゴリー: {machine.category.name}</p>
                    <p className="mb-1 text-sm text-gray-600">シリーズ: {machine.series.name}</p>
                    <p className="mb-3 text-sm text-gray-600">作成者: {machine.creator.name}</p>
                    
                    {machine.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-gray-700">{machine.description}</p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/machines/${machine.id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        詳細
                      </Link>
                      <Link
                        href={`/admin/machines/${machine.id}/edit`}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        編集
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {machines.length === 0 && (
                <div className="py-4 text-center">
                  <p className="text-gray-500">筐体が登録されていません。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}