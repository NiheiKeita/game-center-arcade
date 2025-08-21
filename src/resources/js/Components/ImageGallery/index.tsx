import React, { useState } from 'react'

interface Image {
  id: number;
  image_url: string;
  full_image_url: string;
  caption: string | null;
}

interface Props {
  images: Image[];
  className?: string;
}

export function ImageGallery({ images, className = '' }: Props) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)

  if (!images || images.length === 0) {
    return (
      <div className={`rounded-lg bg-gray-100 p-8 text-center ${className}`}>
        <p className="text-gray-500">画像が登録されていません</p>
      </div>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {images.map((image) => (
          <div
            key={image.id}
            className="group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg">
              <img
                src={image.full_image_url}
                alt={image.caption || ''}
                className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            {image.caption && (
              <p className="mt-2 text-center text-sm text-gray-600">{image.caption}</p>
            )}
          </div>
        ))}
      </div>

      {/* モーダル */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-h-full max-w-4xl p-4">
            <img
              src={selectedImage.full_image_url}
              alt={selectedImage.caption || ''}
              className="max-h-full max-w-full object-contain"
            />
            {selectedImage.caption && (
              <p className="mt-4 text-center text-white">{selectedImage.caption}</p>
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 text-2xl font-bold text-white hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}