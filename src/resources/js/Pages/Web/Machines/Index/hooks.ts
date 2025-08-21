import { usePage } from '@inertiajs/react'

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

interface MachineImage {
  id: number;
  image_url: string;
  full_image_url: string;
  caption: string | null;
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
  created_at: string;
  updated_at: string;
}

interface PaginatedMachines {
  data: Machine[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface IndexProps {
  machines: PaginatedMachines;
  categories: Category[];
  series: Series[];
  selectedCategoryId?: number;
  selectedSeriesId?: number;
  [key: string]: any;
}

export function useMachinesIndex() {
  const { machines, categories, series, selectedCategoryId, selectedSeriesId } = usePage<IndexProps>().props

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams()
    if (categoryId) params.set('category_id', categoryId)
    // カテゴリー変更時はシリーズ選択をリセット（selectedSeriesIdは含めない）
    
    const url = params.toString() ? `/machines?${params.toString()}` : '/machines'
    window.location.href = url
  }

  const handleSeriesChange = async (seriesId: string) => {
    if (!seriesId) {
      // シリーズが選択解除された場合
      const params = new URLSearchParams()
      if (selectedCategoryId) params.set('category_id', selectedCategoryId.toString())
      
      const url = params.toString() ? `/machines?${params.toString()}` : '/machines'
      window.location.href = url
      return
    }

    try {
      // シリーズ情報を取得してカテゴリーIDも取得
      const response = await fetch(`/api/series/${seriesId}`)
      const seriesData = await response.json()
      
      const params = new URLSearchParams()
      if (seriesData?.category_id) {
        params.set('category_id', seriesData.category_id.toString())
      }
      params.set('series_id', seriesId)
      
      const url = `/machines?${params.toString()}`
      window.location.href = url
    } catch (error) {
      console.error('シリーズ情報の取得に失敗しました:', error)
      // エラー時は従来通りの動作
      const params = new URLSearchParams()
      if (selectedCategoryId) params.set('category_id', selectedCategoryId.toString())
      if (seriesId) params.set('series_id', seriesId)
      
      const url = params.toString() ? `/machines?${params.toString()}` : '/machines'
      window.location.href = url
    }
  }

  return {
    machines,
    categories,
    series,
    selectedCategoryId,
    selectedSeriesId,
    handleCategoryChange,
    handleSeriesChange
  }
}