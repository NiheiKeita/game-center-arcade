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

    // リサイズ機能の有効/無効を制御する変数
    const [enableResize, setEnableResize] = useState(true)

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

    // ImageBitmapを使用した確実なリサイズ関数
    const resizeImage = (file: File): Promise<File> => {
        console.log('Starting to resize image:', file.name, file.type, `${Math.round(file.size / 1024)}KB`)
        console.log('Resize enabled:', enableResize)

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            // リサイズが無効の場合は元ファイルをそのまま返す
            if (!enableResize) {
                console.log('Resize disabled, using original file')
                resolve(file)
                return
            }

            // HEICファイルの場合は変換をスキップ
            if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().includes('.heic')) {
                console.warn('HEIC format detected, skipping resize')
                resolve(file)
                return
            }

            try {
                // ImageBitmapを使用してより確実に画像を読み込み
                console.log('Creating ImageBitmap...')
                const imageBitmap = await createImageBitmap(file)
                console.log('ImageBitmap created successfully:', imageBitmap.width, 'x', imageBitmap.height)

                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')

                if (!ctx) {
                    console.error('Canvas context not available')
                    imageBitmap.close()
                    resolve(file)
                    return
                }

                // 目標サイズを1MBに設定（品質重視）
                const targetSize = 1024 * 1024 // 1MB

                // 品質重視のリサイズ設定
                const resizeConfigs = [
                    { maxSize: 800, quality: 0.8 },
                    { maxSize: 600, quality: 0.75 },
                    { maxSize: 500, quality: 0.7 },
                    { maxSize: 400, quality: 0.65 },
                    { maxSize: 300, quality: 0.6 },
                    { maxSize: 250, quality: 0.55 },
                    { maxSize: 200, quality: 0.5 },
                ]

                for (const config of resizeConfigs) {
                    // アスペクト比を維持しながら最大サイズに収める
                    const aspectRatio = imageBitmap.width / imageBitmap.height
                    let newWidth, newHeight

                    if (imageBitmap.width > imageBitmap.height) {
                        // 横長
                        newWidth = config.maxSize
                        newHeight = Math.round(newWidth / aspectRatio)
                    } else {
                        // 縦長または正方形
                        newHeight = config.maxSize
                        newWidth = Math.round(newHeight * aspectRatio)
                    }

                    // 最小サイズ制限（品質保持のため）
                    if (newWidth < 100 || newHeight < 100) {
                        newWidth = Math.max(newWidth, 100)
                        newHeight = Math.max(newHeight, 100)
                    }

                    canvas.width = newWidth
                    canvas.height = newHeight

                    // 背景を白に設定
                    ctx.fillStyle = 'white'
                    ctx.fillRect(0, 0, newWidth, newHeight)

                    // ImageBitmapを描画
                    ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight)

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
                            imageBitmap.close()
                            resolve(resizedFile)
                            return
                        }
                    }
                }

                // 最終手段: より大きなサイズで品質を保持
                canvas.width = 150
                canvas.height = 150
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, 150, 150)
                ctx.drawImage(imageBitmap, 0, 0, 150, 150)

                const finalBlob = await new Promise<Blob | null>((blobResolve) => {
                    canvas.toBlob(blobResolve, 'image/jpeg', 0.4)
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
                    imageBitmap.close()
                    resolve(finalFile)
                } else {
                    console.error('All resize attempts failed')
                    imageBitmap.close()
                    resolve(file)
                }

            } catch (error) {
                console.error('ImageBitmap creation failed:', error)
                resolve(file)
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

                // ファイルをリサイズ（段階的に1MB以下まで）
                const resizedFile = await resizeImage(file)
                console.log('File resized successfully:', resizedFile.name, `${Math.round(resizedFile.size / 1024)}KB`)

                // リサイズが失敗している場合（元ファイルと同じサイズ）は処理を停止
                if (resizedFile.size === file.size && file.size > 1024 * 1024) {
                    console.error('Resize failed, file size unchanged:', Math.round(file.size / 1024) + 'KB')
                    alert(`画像のリサイズに失敗しました。ファイル: ${file.name} (${Math.round(file.size / 1024)}KB)`)
                    continue // 次のファイルに進む
                }

                // 最終チェック: リサイズ後でも1MB以上の場合は警告
                if (resizedFile.size > 1024 * 1024) {
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
        enableResize,
        setEnableResize,
        handleImageChange,
        handleCategoryChange,
        handleSeriesChange,
        updateCaption,
        removeImage,
        submit
    }
}
