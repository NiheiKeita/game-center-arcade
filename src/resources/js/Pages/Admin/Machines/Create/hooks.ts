import { useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'

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
  const { categories, series } = usePage<CreateProps>().props
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const { data, setData, post, processing, errors } = useForm<FormData>({
    category_id: '',
    series_id: '',
    name: '',
    version: '',
    description: '',
    images: null,
    captions: []
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/admin/machines')
  }

  return {
    data,
    setData,
    categories,
    series,
    imageFiles,
    imagePreviews,
    processing,
    errors,
    handleImageChange,
    updateCaption,
    removeImage,
    submit
  }
}