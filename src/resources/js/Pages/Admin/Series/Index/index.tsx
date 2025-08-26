import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'

interface Category {
  id: number;
  name: string;
}

interface SeriesItem {
  id: number;
  name: string;
  description: string | null;
  machines_count: number;
  category: Category;
  created_at: string;
  updated_at: string;
}

interface Props {
  series: SeriesItem[];
  categories: Category[];
  selectedCategoryId?: number;
  [key: string]: any;
}

export default function SeriesIndex() {
  const { series, categories, selectedCategoryId } = usePage<Props>().props

  const handleCategoryChange = (categoryId: string) => {
    const url = categoryId ? `/admin/series?category_id=${categoryId}` : '/admin/series'
    window.location.href = url
  }

  return (
    <AdminLayout>
      <Head title="シリーズ管理" />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">シリーズ一覧</h2>
                <Link href="/admin/series/create">
                  <Button>新規シリーズ作成</Button>
                </Link>
              </div>

              <div className="mb-6 max-w-md">
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

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        シリーズ名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        カテゴリー
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        筐体数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        説明
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        作成日時
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {series.map((seriesItem) => (
                      <tr key={seriesItem.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {seriesItem.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {seriesItem.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {seriesItem.category.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {seriesItem.machines_count}
                        </td>
                        <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                          {seriesItem.description || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {new Date(seriesItem.created_at).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="space-x-2 whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <Link
                            href={`/admin/series/${seriesItem.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            詳細
                          </Link>
                          <Link
                            href={`/admin/series/${seriesItem.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            編集
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {series.length === 0 && (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">シリーズが登録されていません。</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}