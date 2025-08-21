import { useState } from 'react'
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

interface MachineImage {
  id: number;
  image_url: string;
  caption: string | null;
}

interface Machine {
  id: number;
  name: string;
  version: string;
  description: string | null;
  category_id: number;
  series_id: number;
  images: MachineImage[];
}

export interface EditProps {
  machine: Machine;
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
  remove_images: number[];
}

export function useMachineEdit() {
  const { machine, categories, series } = usePage<EditProps>().props
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([])

  const { data, setData, post, processing, errors } = useForm<FormData>({
    category_id: machine.category_id.toString(),
    series_id: machine.series_id.toString(),
    name: machine.name,
    version: machine.version,
    description: machine.description || '',
    images: null,
    captions: [],
    remove_images: []
  })

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

  const removeNewImage = (index: number) => {
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

  const removeExistingImage = (imageId: number) => {
    const newRemovedIds = [...removedImageIds, imageId]
    setRemovedImageIds(newRemovedIds)
    setData('remove_images', newRemovedIds)
  }

  const restoreExistingImage = (imageId: number) => {
    const newRemovedIds = removedImageIds.filter(id => id !== imageId)
    setRemovedImageIds(newRemovedIds)
    setData('remove_images', newRemovedIds)
  }

  const handleCategoryChange = (categoryId: string) => {
    setData((prevData) => ({
      ...prevData,
      category_id: categoryId,
      series_id: '' // カテゴリー変更時はシリーズを「すべて」にリセット
    }))
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
    post(`/admin/machines/${machine.id}`, {
      forceFormData: true,
    })
  }

  return {
    data,
    setData,
    machine,
    categories,
    series,
    imageFiles,
    imagePreviews,
    removedImageIds,
    processing,
    errors,
    handleImageChange,
    handleCategoryChange,
    handleSeriesChange,
    updateCaption,
    removeNewImage,
    removeExistingImage,
    restoreExistingImage,
    submit
  }
}