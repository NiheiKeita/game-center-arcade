import React from 'react'
import { Head, Link } from '@inertiajs/react'
import WebLayout from '@/Layouts/WebLayout'
import { ImageGallery } from '@/Components/ImageGallery'
import { useMachinesShow } from './hooks'

export default function MachinesShow() {
  const { machine, formatDate } = useMachinesShow()

  return (
    <WebLayout>
      <Head title={`${machine.name} - 筐体詳細`} />
      
      <div className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              href="/machines"
              className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              ← 筐体一覧に戻る
            </Link>
            
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {machine.name}
            </h1>
            
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
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {machine.images && machine.images.length > 0 ? (
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    画像ギャラリー ({machine.images.length}枚)
                  </h2>
                  <ImageGallery images={machine.images} />
                </div>
              ) : (
                <div className="mb-8">
                  <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <div className="mb-2 text-4xl">🎮</div>
                      <p className="text-gray-500">画像が登録されていません</p>
                    </div>
                  </div>
                </div>
              )}

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
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg bg-gray-50 p-6">
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
                    <dt className="text-sm font-medium text-gray-500">登録日時</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(machine.created_at)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6">
                <Link
                  href={`/machines?category_id=${machine.category.id}`}
                  className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  同じカテゴリーの筐体を見る
                </Link>
                
                <Link
                  href={`/machines?series_id=${machine.series.id}`}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  同じシリーズの筐体を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  )
}