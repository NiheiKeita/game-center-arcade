import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'
import { ImageGallery } from '@/Components/ImageGallery'
import { useMachineShow } from './hooks'

export default function MachineShow() {
  const { machine, formatDate, handleDelete } = useMachineShow()

  return (
    <AdminLayout>
      <Head title={`${machine.name} - 筐体詳細`} />

      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{machine.name}</h1>
              <p className="mt-2 text-gray-600">筐体詳細情報</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/admin/machines" className="text-blue-600 hover:text-blue-800">
                ← 筐体一覧に戻る
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {machine.category.name}
                </span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {machine.series.name}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                  Ver. {machine.version}
                </span>
              </div>

              {machine.description && (
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">説明</h2>
                  <div className="rounded-lg bg-gray-50 p-6">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {machine.description}
                    </p>
                  </div>
                </div>
              )}

              {machine.images && machine.images.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    画像ギャラリー ({machine.images.length}枚)
                  </h2>
                  <ImageGallery images={machine.images} />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">基本情報</h2>
              
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">筐体名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{machine.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">バージョン</dt>
                  <dd className="mt-1 text-sm text-gray-900">{machine.version}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">カテゴリー</dt>
                  <dd className="mt-1 text-sm text-gray-900">{machine.category.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">シリーズ</dt>
                  <dd className="mt-1 text-sm text-gray-900">{machine.series.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">登録者</dt>
                  <dd className="mt-1 text-sm text-gray-900">{machine.creator.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">作成日時</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(machine.created_at)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">更新日時</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(machine.updated_at)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 space-y-3">
              <Link href={`/admin/machines/${machine.id}/edit`} className="block">
                <Button className="w-full" variant="default">
                  編集
                </Button>
              </Link>
              
              <Button 
                onClick={handleDelete}
                className="w-full"
                variant="destructive"
              >
                削除
              </Button>
              
              <Link href={`/machines/${machine.id}`} target="_blank" className="block">
                <Button className="w-full" variant="outline">
                  フロント画面で確認
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}