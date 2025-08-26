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
}

interface UploadedImage {
    id: number;
    filename: string;
    original_name: string;
    url: string;
    caption: string;
}

export function useMachineCreate() {
    const { categories, series: initialSeries } = usePage<CreateProps>().props
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
    const [uploading, setUploading] = useState(false)
    const [availableSeries, setAvailableSeries] = useState<Series[]>(initialSeries)

    const { data, setData, post, processing, errors } = useForm<FormData>({
        category_id: '',
        series_id: '',
        name: '',
        version: '',
        description: ''
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

    // 画像を確実に小さくリサイズする関数
    const resizeImage = (file: File): Promise<File> => {
        console.log('Starting to resize image:', file.name, file.type, `${Math.round(file.size / 1024)}KB`)
        
        return new Promise((resolve) => {
            // HEICファイルの場合は変換をスキップ
            if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().includes('.heic')) {
                console.warn('HEIC format detected, skipping resize')
                resolve(file)
                return
            }

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            
            if (!ctx) {
                console.error('Canvas context not available')
                resolve(file)
                return
            }

            const img = new Image()
            
            // タイムアウト設定
            const timeout = setTimeout(() => {
                console.error('Image loading timeout')
                resolve(file)
            }, 10000) // 10秒でタイムアウト

            const processImage = async () => {
                clearTimeout(timeout)
                console.log('Image loaded successfully:', img.width, 'x', img.height)

                try {
                    // 目標サイズを200KBに設定（さらに小さく）
                    const targetSize = 200 * 1024 // 200KB
                    
                    // 非常に積極的なリサイズ設定
                    const resizeConfigs = [
                        { maxSize: 200, quality: 0.3 },
                        { maxSize: 180, quality: 0.25 },
                        { maxSize: 150, quality: 0.2 },
                        { maxSize: 120, quality: 0.15 },
                        { maxSize: 100, quality: 0.1 },
                        { maxSize: 80, quality: 0.08 },
                        { maxSize: 60, quality: 0.05 },
                    ]
                    
                    for (const config of resizeConfigs) {
                        // アスペクト比を維持しながら最大サイズに収める
                        const aspectRatio = img.width / img.height
                        let newWidth, newHeight
                        
                        if (img.width > img.height) {
                            // 横長
                            newWidth = config.maxSize
                            newHeight = Math.round(newWidth / aspectRatio)
                        } else {
                            // 縦長または正方形
                            newHeight = config.maxSize
                            newWidth = Math.round(newHeight * aspectRatio)
                        }

                        // 最小サイズ制限
                        if (newWidth < 20 || newHeight < 20) {
                            newWidth = Math.max(newWidth, 20)
                            newHeight = Math.max(newHeight, 20)
                        }

                        canvas.width = newWidth
                        canvas.height = newHeight

                        // 背景を白に設定
                        ctx.fillStyle = 'white'
                        ctx.fillRect(0, 0, newWidth, newHeight)
                        
                        // 画像を描画
                        ctx.drawImage(img, 0, 0, newWidth, newHeight)

                        // Blobに変換
                        const blob = await new Promise<Blob | null>((blobResolve) => {
                            canvas.toBlob(blobResolve, 'image/jpeg', config.quality)
                        })

                        if (blob) {
                            const resizedFile = new File([blob], 
                                file.name.replace(/\.[^/.]+$/, '.jpg'),
                                {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                }
                            )
                            
                            console.log(`リサイズ試行: ${newWidth}x${newHeight}, 品質${config.quality} → ${Math.round(resizedFile.size / 1024)}KB`)
                            
                            if (resizedFile.size <= targetSize) {
                                console.log(`✅ 画像リサイズ成功: ${Math.round(file.size / 1024)}KB → ${Math.round(resizedFile.size / 1024)}KB`)
                                resolve(resizedFile)
                                return
                            }
                        }
                    }
                    
                    // 最終手段: 極小サイズで強制的に作成
                    canvas.width = 50
                    canvas.height = 50
                    ctx.fillStyle = 'white'
                    ctx.fillRect(0, 0, 50, 50)
                    ctx.drawImage(img, 0, 0, 50, 50)
                    
                    const finalBlob = await new Promise<Blob | null>((blobResolve) => {
                        canvas.toBlob(blobResolve, 'image/jpeg', 0.1)
                    })
                    
                    if (finalBlob) {
                        const finalFile = new File([finalBlob], 
                            file.name.replace(/\.[^/.]+$/, '.jpg'),
                            {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            }
                        )
                        console.log(`🔥 強制最小リサイズ: ${Math.round(file.size / 1024)}KB → ${Math.round(finalFile.size / 1024)}KB`)
                        resolve(finalFile)
                    } else {
                        console.error('All resize attempts failed')
                        resolve(file)
                    }
                    
                } catch (error) {
                    console.error('Error during image resize:', error)
                    resolve(file)
                }
            }

            img.onload = processImage
            img.onerror = (error) => {
                clearTimeout(timeout)
                console.error('Image load failed:', error)
                resolve(file)
            }

            // FileReaderとObjectURLの両方を試行
            let objectUrl: string | null = null
            
            const tryFileReader = () => {
                console.log('Trying FileReader as fallback...')
                const reader = new FileReader()
                reader.onload = (e) => {
                    if (e.target?.result) {
                        const dataUrl = e.target.result as string
                        img.src = dataUrl
                    } else {
                        clearTimeout(timeout)
                        console.error('FileReader failed to load')
                        resolve(file)
                    }
                }
                reader.onerror = () => {
                    clearTimeout(timeout)
                    console.error('FileReader error')
                    resolve(file)
                }
                reader.readAsDataURL(file)
            }
            
            // まずObjectURLを試行
            try {
                objectUrl = URL.createObjectURL(file)
                
                img.onload = () => {
                    if (objectUrl) URL.revokeObjectURL(objectUrl)
                    processImage()
                }
                
                img.onerror = (error) => {
                    if (objectUrl) URL.revokeObjectURL(objectUrl)
                    console.error('ObjectURL failed, trying FileReader...', error)
                    
                    // ObjectURLが失敗した場合はFileReaderを試行
                    img.onload = processImage
                    img.onerror = (fallbackError) => {
                        clearTimeout(timeout)
                        console.error('Both ObjectURL and FileReader failed:', fallbackError)
                        resolve(file)
                    }
                    tryFileReader()
                }
                
                img.src = objectUrl
                
            } catch (error) {
                console.error('Failed to create ObjectURL, using FileReader:', error)
                img.onload = processImage
                img.onerror = (fallbackError) => {
                    clearTimeout(timeout)
                    console.error('FileReader also failed:', fallbackError)
                    resolve(file)
                }
                tryFileReader()
            }
        })
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        console.log('File input changed, files:', files)
        if (!files) return

        const fileArray = Array.from(files)
        console.log('Original files:', fileArray.map(f => ({ name: f.name, size: Math.round(f.size / 1024) + 'KB' })))

        setUploading(true)

        try {
            // 各ファイルを個別にアップロード
            for (const file of fileArray) {
                console.log('Uploading file:', file.name)
                
                // ファイルをリサイズ（段階的に300KB以下まで）
                const resizedFile = await resizeImage(file)
                console.log('File resized successfully:', resizedFile.name, `${Math.round(resizedFile.size / 1024)}KB`)
                
                // リサイズが失敗している場合（元ファイルと同じサイズ）は処理を停止
                if (resizedFile.size === file.size && file.size > 200 * 1024) {
                    console.error('Resize failed, file size unchanged:', Math.round(file.size / 1024) + 'KB')
                    
                    // 最後の試行: ダミー画像を作成
                    const dummyCanvas = document.createElement('canvas')
                    const dummyCtx = dummyCanvas.getContext('2d')
                    if (dummyCtx) {
                        dummyCanvas.width = 100
                        dummyCanvas.height = 100
                        dummyCtx.fillStyle = '#f0f0f0'
                        dummyCtx.fillRect(0, 0, 100, 100)
                        dummyCtx.fillStyle = '#666'
                        dummyCtx.font = '12px Arial'
                        dummyCtx.textAlign = 'center'
                        dummyCtx.fillText('No Image', 50, 45)
                        dummyCtx.fillText('Available', 50, 60)
                        
                        try {
                            const dummyBlob = await new Promise<Blob | null>((resolve) => {
                                dummyCanvas.toBlob(resolve, 'image/jpeg', 0.8)
                            })
                            
                            if (dummyBlob) {
                                const dummyFile = new File([dummyBlob], 
                                    file.name.replace(/\.[^/.]+$/, '_placeholder.jpg'),
                                    {
                                        type: 'image/jpeg',
                                        lastModified: Date.now()
                                    }
                                )
                                
                                console.log(`ダミー画像を作成: ${Math.round(dummyFile.size / 1024)}KB`)
                                
                                // FormDataを作成してアップロード
                                const dummyFormData = new FormData()
                                dummyFormData.append('image', dummyFile)
                                dummyFormData.append('caption', `元画像: ${file.name} (${Math.round(file.size / 1024)}KB)`)

                                const dummyResponse = await axios.post('/api/temp-images', dummyFormData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    }
                                })

                                setUploadedImages(prev => [...prev, dummyResponse.data])
                                continue
                            }
                        } catch (dummyError) {
                            console.error('ダミー画像の作成にも失敗:', dummyError)
                        }
                    }
                    
                    alert(`画像のリサイズに失敗しました。ファイル: ${file.name} (${Math.round(file.size / 1024)}KB)`)
                    continue // 次のファイルに進む
                }
                
                // 最終チェック: リサイズ後でも200KB以上の場合は警告
                if (resizedFile.size > 200 * 1024) {
                    console.warn('Resized file still large:', Math.round(resizedFile.size / 1024) + 'KB')
                }

                // FormDataを作成
                const formData = new FormData()
                formData.append('image', resizedFile)
                formData.append('caption', '') // デフォルトは空のキャプション

                // APIにアップロード
                const response = await axios.post('/api/temp-images', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })

                console.log('Upload response:', response.data)

                // アップロード済み画像リストに追加
                setUploadedImages(prev => [...prev, response.data])
            }

            console.log('All files uploaded successfully')
        } catch (error: any) {
            console.error('Error uploading images:', error)
            // エラーメッセージを表示
            if (error.response?.status === 413) {
                alert('ファイルサイズが大きすぎます。より小さな画像を選択してください。')
            } else {
                alert('画像のアップロードに失敗しました。再試行してください。')
            }
        } finally {
            setUploading(false)
        }
    }

    const updateCaption = async (index: number, caption: string) => {
        const imageToUpdate = uploadedImages[index]
        if (!imageToUpdate) return

        try {
            // サーバー側でキャプションを更新（今回は省略、必要に応じて実装）
            // await axios.put(`/api/temp-images/${imageToUpdate.id}`, { caption })

            // ローカル状態を更新
            setUploadedImages(prev => 
                prev.map((img, i) => 
                    i === index ? { ...img, caption } : img
                )
            )
        } catch (error) {
            console.error('Error updating caption:', error)
        }
    }

    const removeImage = async (index: number) => {
        const imageToRemove = uploadedImages[index]
        if (!imageToRemove) return

        try {
            // サーバー側から一時画像を削除
            await axios.delete(`/api/temp-images/${imageToRemove.id}`)
            
            // ローカル状態から削除
            setUploadedImages(prev => prev.filter((_, i) => i !== index))
            
            console.log('Image removed successfully:', imageToRemove.filename)
        } catch (error) {
            console.error('Error removing image:', error)
        }
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
        console.log('Uploaded images count:', uploadedImages.length)

        // データをオブジェクトとして準備
        const submitData: any = {
            category_id: data.category_id,
            series_id: data.series_id,
            name: data.name,
            version: data.version,
            description: data.description,
        }

        // 一時アップロード画像のIDを追加
        if (uploadedImages.length > 0) {
            submitData.temp_image_ids = uploadedImages.map(img => img.id)
            console.log('Added temp image IDs:', submitData.temp_image_ids)
        }

        // Inertiaのpostメソッドを使用
        post(route('admin.machines.store'), submitData)
    }

    return {
        data,
        setData,
        categories,
        series: availableSeries,
        uploadedImages,
        uploading,
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
