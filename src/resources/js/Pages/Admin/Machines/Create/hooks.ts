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

    const { data, setData, processing, errors } = useForm<FormData>({
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

    // 画像をリサイズする関数
    const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            img.onload = () => {
                // アスペクト比を維持しながらリサイズ
                let { width, height } = img
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height)
                    width = Math.floor(width * ratio)
                    height = Math.floor(height * ratio)
                }

                canvas.width = width
                canvas.height = height

                // 画像を描画
                ctx?.drawImage(img, 0, 0, width, height)

                // Blobに変換
                canvas.toBlob((blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        })
                        console.log(`画像をリサイズしました: ${Math.round(file.size / 1024)}KB → ${Math.round(resizedFile.size / 1024)}KB`)
                        resolve(resizedFile)
                    } else {
                        resolve(file)
                    }
                }, file.type, quality)
            }

            img.src = URL.createObjectURL(file)
        })
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        console.log('File input changed, files:', files)
        if (!files) return

        const fileArray = Array.from(files)
        console.log('Original files:', fileArray.map(f => ({ name: f.name, size: Math.round(f.size / 1024) + 'KB' })))

        // 画像をリサイズ
        const resizedFiles = await Promise.all(
            fileArray.map(file => resizeImage(file, 800, 600, 0.8))
        )

        setImageFiles(resizedFiles)
        console.log('Resized files:', resizedFiles.map(f => ({ name: f.name, size: Math.round(f.size / 1024) + 'KB' })))

        const previews = resizedFiles.map(file => URL.createObjectURL(file))
        setImagePreviews(prev => {
            prev.forEach(url => URL.revokeObjectURL(url))
            return previews
        })

        setData('captions', resizedFiles.map(() => ''))
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
        console.log('Submitting form with data:', data)
        console.log('Images in data:', data.images)
        console.log('Image files count:', imageFiles.length)

        // FormDataを直接作成して送信
        const formData = new FormData()
        
        // テキストフィールドを追加
        formData.append('category_id', data.category_id)
        formData.append('series_id', data.series_id)
        formData.append('name', data.name)
        formData.append('version', data.version)
        formData.append('description', data.description)
        
        // 画像ファイルを追加
        if (imageFiles.length > 0) {
            imageFiles.forEach((file, index) => {
                formData.append('images[]', file)  // 配列形式で追加
                formData.append(`captions[${index}]`, data.captions[index] || '')
            })
            console.log('Added', imageFiles.length, 'images to FormData')
        }

        // FormDataの内容をログ出力（デバッグ用）
        console.log('FormData contents:')
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1])
        }

        // Axiosで直接送信
        const submitFormData = async () => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            console.log('CSRF Token:', csrfToken)
            
            try {
                await axios.post('/admin/machines', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRF-TOKEN': csrfToken
                    }
                })
                console.log('Form submission successful')
                // 成功時は一覧ページにリダイレクト
                window.location.href = '/admin/machines'
            } catch (error: any) {
                console.log('Form submission errors:', error)
                if (error.response) {
                    console.log('Error response:', error.response.data)
                    console.log('Error status:', error.response.status)
                }
            }
        }

        submitFormData()
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
