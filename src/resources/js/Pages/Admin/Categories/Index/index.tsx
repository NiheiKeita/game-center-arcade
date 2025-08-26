import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'

interface Category {
  id: number;
  name: string;
  series_count: number;
  machines_count: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  categories: Category[];
  [key: string]: any;
}

export default function CategoriesIndex() {
  const { categories } = usePage<Props>().props

  return (
    <AdminLayout>
      <Head title="カテゴリー管理" />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">カテゴリー一覧</h2>
                <Link href="/admin/categories/create">
                  <Button>新規カテゴリー作成</Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        カテゴリー名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        シリーズ数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        筐体数
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
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {category.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {category.series_count}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {category.machines_count}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {new Date(category.created_at).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="space-x-2 whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            詳細
                          </Link>
                          <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            編集
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {categories.length === 0 && (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">カテゴリーが登録されていません。</p>
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