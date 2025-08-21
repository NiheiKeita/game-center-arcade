import React from 'react'
import { Head, Link } from '@inertiajs/react'
import WebLayout from '@/Layouts/WebLayout'
import { MachineCard } from '@/Components/MachineCard'
import { useMachinesIndex } from './hooks'

export default function MachinesIndex() {
  const {
    machines,
    categories,
    series,
    selectedCategoryId,
    selectedSeriesId,
    handleCategoryChange,
    handleSeriesChange
  } = useMachinesIndex()

  return (
    <WebLayout>
      <Head title="筐体一覧" />
      
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">筐体一覧</h1>
            <p className="text-gray-600">
              登録されている筐体情報を閲覧できます
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-4">
            <div className="min-w-48 flex-1">
              <select
                value={selectedCategoryId?.toString() || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-3"
              >
                <option value="">すべてのカテゴリー</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-48 flex-1">
              <select
                value={selectedSeriesId?.toString() || ''}
                onChange={(e) => handleSeriesChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-3"
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

          {machines.data && machines.data.length > 0 ? (
            <>
              <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {machines.data.map((machine) => (
                  <Link key={machine.id} href={`/machines/${machine.id}`}>
                    <MachineCard machine={machine} showActions={false} className="transition-transform hover:scale-105" />
                  </Link>
                ))}
              </div>

              {machines.last_page > 1 && (
                <div className="flex justify-center">
                  <nav className="flex space-x-2">
                    {machines.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          link.active
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">🎮</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                筐体が見つかりませんでした
              </h3>
              <p className="mb-6 text-gray-600">
                条件を変更して再度検索してみてください
              </p>
              <Link 
                href="/machines" 
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                検索条件クリア
              </Link>
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  )
}