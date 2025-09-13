'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { ImageGallery } from '@/components/ui/image-gallery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Image as ImageIcon } from 'lucide-react'
import { ImageUploadResponse, ImageItem } from '@/services/image.service'

interface GalleryProps {
  id: string
  title?: string
  images: Array<{ url: string; alt?: string }>
  isEditing?: boolean
  onUpdate?: (images: Array<{ url: string; alt?: string }>) => void
}

export const Gallery: React.FC<GalleryProps> = ({
  title,
  images,
  isEditing = false,
  onUpdate,
}) => {
  const [showImageManager, setShowImageManager] = useState(false)

  const handleImageUpload = (response: ImageUploadResponse) => {
    const newImage = {
      url: response.url,
      alt: response.filename
    }
    const updatedImages = [...images, newImage]
    onUpdate?.(updatedImages)
  }

  const handleImageSelect = (image: ImageItem) => {
    const newImage = {
      url: image.url,
      alt: image.filename
    }
    const updatedImages = [...images, newImage]
    onUpdate?.(updatedImages)
    setShowImageManager(false)
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    onUpdate?.(updatedImages)
  }

  if (isEditing) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title || 'Gallery'}
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowImageManager(!showImageManager)}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Manage Images
            </Button>
          </div>

          {showImageManager && (
            <div className="mb-8">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload New</TabsTrigger>
                  <TabsTrigger value="gallery">Select Existing</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-4">
                  <ImageUpload
                    onUploadSuccess={handleImageUpload}
                    folder="gallery"
                    maxFiles={10}
                  />
                </TabsContent>
                <TabsContent value="gallery" className="mt-4">
                  <ImageGallery
                    folder="gallery"
                    onImageSelect={handleImageSelect}
                    selectable={true}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Current Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Images ({images.length})</h3>
            {images.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No images added yet</p>
                <p className="text-sm text-gray-400">Upload or select images to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={image.url}
                        alt={image.alt || `Gallery image ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 truncate" title={image.alt}>
                      {image.alt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Public view (non-editing)
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
        )}
        {images.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
              <ImageIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No images to display</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Images will appear here once uploaded</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <p className="text-white font-medium text-sm truncate" title={image.alt}>
                      {image.alt || `Gallery image ${index + 1}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
