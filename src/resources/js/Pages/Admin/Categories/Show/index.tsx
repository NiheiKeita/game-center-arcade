import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'

interface Machine {
  id: number;
  name: string;
  version: string;
}

interface Series {
  id: number;
  name: string;
  description: string | null;
  machines: Machine[];
}

interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  series: Series[];
  machines: Machine[];
}

interface Props {
  category: Category;
  [key: string]: any;
}

export default function CategoriesShow() {
  const { category } = usePage<Props>().props

  return (
    <AdminLayout>
      <Head title={`カテゴリー詳細: ${category.name}`} />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                <div className="flex space-x-2">
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <Button>編集</Button>
                  </Link>
                  <Link href="/admin/categories">
                    <Button variant="default">一覧に戻る</Button>
                  </Link>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">カテゴリーID</p>
                  <p className="mt-1">{category.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">カテゴリー名</p>
                  <p className="mt-1">{category.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">シリーズ数</p>
                  <p className="mt-1">{category.series?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">筐体数</p>
                  <p className="mt-1">{category.machines?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">作成日時</p>
                  <p className="mt-1">{new Date(category.created_at).toLocaleString('ja-JP')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">更新日時</p>
                  <p className="mt-1">{new Date(category.updated_at).toLocaleString('ja-JP')}</p>
                </div>
              </div>

              {category.series && category.series.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">シリーズ一覧</h3>
                  <div className="space-y-4">
                    {category.series.map((series) => (
                      <div key={series.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{series.name}</h4>
                          <Link
                            href={`/admin/series/${series.id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            詳細
                          </Link>
                        </div>
                        {series.description && (
                          <p className="mb-2 text-sm text-gray-600">{series.description}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          筐体数: {series.machines?.length || 0}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!category.series || category.series.length === 0) && (
                <div className="py-4 text-center">
                  <p className="text-gray-500">このカテゴリーにはまだシリーズが登録されていません。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}