import React from 'react'
import { Link } from '@inertiajs/react'

interface MachineImage {
  id: number;
  image_url: string;
  full_image_url: string;
  caption: string | null;
}

interface Category {
  id: number;
  name: string;
}

interface Series {
  id: number;
  name: string;
}

interface Creator {
  id: number;
  name: string;
}

interface Machine {
  id: number;
  name: string;
  version: string;
  description: string | null;
  category: Category;
  series: Series;
  creator: Creator;
  images: MachineImage[];
}

interface Props {
  machine: Machine;
  showActions?: boolean;
  className?: string;
}

export function MachineCard({ machine, showActions = true, className = '' }: Props) {
  const mainImage = machine.images && machine.images.length > 0 ? machine.images[0] : null

  return (
    <div className={`overflow-hidden rounded-lg bg-white shadow-md ${className}`}>
      <div className="aspect-w-16 aspect-h-9">
        {mainImage ? (
          <img
            src={mainImage.full_image_url}
            alt={machine.name}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-gray-200">
            <span className="text-gray-400">画像なし</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{machine.name}</h3>
        <p className="mb-1 text-sm text-gray-600">バージョン: {machine.version}</p>
        <p className="mb-1 text-sm text-gray-600">カテゴリー: {machine.category.name}</p>
        <p className="mb-1 text-sm text-gray-600">シリーズ: {machine.series.name}</p>
        <p className="mb-3 text-sm text-gray-600">作成者: {machine.creator.name}</p>
        
        {machine.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-700">{machine.description}</p>
        )}
        
        {machine.images && machine.images.length > 1 && (
          <p className="mb-3 text-xs text-gray-500">
            +{machine.images.length - 1}枚の画像
          </p>
        )}
        
        {showActions && (
          <div className="flex space-x-2">
            <Link
              href={`/admin/machines/${machine.id}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              詳細
            </Link>
            <Link
              href={`/admin/machines/${machine.id}/edit`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              編集
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}