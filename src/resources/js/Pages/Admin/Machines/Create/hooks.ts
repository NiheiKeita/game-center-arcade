import { useState, useEffect } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import axios from 'axios'

interface Category {
  id: number;
  name: string;
}

interface Series {
  id: number;
  name: string;
}

export interface CreateProps {
  categories: Category[];
  series: Series[];
  [key: string]: any;
}

interface FormData {
  category_id: string;
  series_id: string;
  name: string;
  version: string;
  description: string;
  images: FileList | null;
  captions: string[];
}

export function useMachineCreate() {
  const { categories, series: initialSeries } = usePage<CreateProps>().props
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [availableSeries, setAvailableSeries] = useState<Series[]>(initialSeries)

  const { data, setData, post, processing, errors } = useForm<FormData>({
    category_id: '',
    series_id: '',
    name: '',
    version: '',
    description: '',
    images: null,
    captions: []
  })

  // カテゴリー選択時にシリーズを取得
  useEffect(() => {
    if (data.category_id) {
      axios.get(`/api/series/by-category/${data.category_id}`)
        .then(response => {
          setAvailableSeries(response.data)
          // カテゴリー変更時はシリーズ選択をリセット（「すべて」の状態に戻す）
          setData(prevData => ({ ...prevData, series_id: '' }))
        })
        .catch(error => {
          console.error('シリーズの取得に失敗しました:', error)
          setAvailableSeries([])
        })
    } else {
      setAvailableSeries(initialSeries)
      setData(prevData => ({ ...prevData, series_id: '' }))
    }
  }, [data.category_id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    setImageFiles(fileArray)

    const previews = fileArray.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => {
      prev.forEach(url => URL.revokeObjectURL(url))
      return previews
    })

    setData('images', files)
    setData('captions', fileArray.map(() => ''))
  }

  const updateCaption = (index: number, caption: string) => {
    const newCaptions = [...data.captions]
    newCaptions[index] = caption
    setData('captions', newCaptions)
  }

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    const newCaptions = data.captions.filter((_, i) => i !== index)

    URL.revokeObjectURL(imagePreviews[index])
    
    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
    setData('captions', newCaptions)

    const dt = new DataTransfer()
    newFiles.forEach(file => dt.items.add(file))
    setData('images', dt.files)
  }

  const handleCategoryChange = (categoryId: string) => {
    setData('category_id', categoryId)
  }

  const handleSeriesChange = async (seriesId: string) => {
    if (!seriesId) {
      setData('series_id', '')
      return
    }
    
    try {
      // シリーズ情報を取得してカテゴリーを自動選択
      const response = await axios.get(`/api/series/${seriesId}`)
      const seriesData = response.data
      
      if (seriesData?.category_id) {
        // 一度にsetDataを呼び出してカテゴリーとシリーズを設定
        setData((prevData) => ({
          ...prevData,
          category_id: seriesData.category_id.toString(),
          series_id: seriesId
        }))
        
        // カテゴリーが変更されたので、利用可能なシリーズも更新
        const seriesResponse = await axios.get(`/api/series/by-category/${seriesData.category_id}`)
        setAvailableSeries(seriesResponse.data)
      } else {
        setData('series_id', seriesId)
      }
    } catch (error) {
      console.error('シリーズ情報の取得に失敗しました:', error)
      setData('series_id', seriesId)
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/admin/machines')
  }

  return {
    data,
    setData,
    categories,
    series: availableSeries,
    imageFiles,
    imagePreviews,
    processing,
    errors,
    handleImageChange,
    handleCategoryChange,
    handleSeriesChange,
    updateCaption,
    removeImage,
    submit
  }
}