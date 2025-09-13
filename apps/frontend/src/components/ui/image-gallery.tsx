'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search, 
  Trash2, 
  Download, 
  RefreshCw, 
  Image as ImageIcon,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { ImageService, ImageItem } from '@/services/image.service'
import { useToast } from '@/hooks/use-toast'

interface ImageGalleryProps {
  folder?: string
  onImageSelect?: (image: ImageItem) => void
  onImageDelete?: (image: ImageItem) => void
  selectable?: boolean
  className?: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  folder,
  onImageSelect,
  onImageDelete,
  selectable = false,
  className = ''
}) => {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const { toast } = useToast()

  const loadImages = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const imageList = await ImageService.listImages(folder)
      setImages(imageList)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load images'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [folder])

  const handleDeleteImage = async (image: ImageItem) => {
    if (!confirm(`Are you sure you want to delete "${image.filename}"?`)) {
      return
    }

    try {
      await ImageService.deleteImage(image.key)
      setImages(prev => prev.filter(img => img.key !== image.key))
      onImageDelete?.(image)
      
      toast({
        title: 'Image Deleted',
        description: `"${image.filename}" has been deleted successfully.`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleImageClick = (image: ImageItem) => {
    if (selectable) {
      setSelectedImage(image)
      onImageSelect?.(image)
    }
  }

  const handleDownload = (image: ImageItem) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = image.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading images...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Image Gallery
            {folder && (
              <Badge variant="outline" className="ml-2">
                {folder}
              </Badge>
            )}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadImages}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {filteredImages.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No images found matching your search.' : 'No images found.'}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-400 mt-2">
                Upload some images to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <Card 
                key={image.key} 
                className={`relative group cursor-pointer transition-all ${
                  selectedImage?.key === image.key 
                    ? 'ring-2 ring-primary' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleImageClick(image)}
              >
                <CardContent className="p-2">
                  <div className="aspect-square relative overflow-hidden rounded-md">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(image)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteImage(image)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ImageService.formatFileSize(image.size)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(image.last_modified).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredImages.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredImages.length} of {images.length} images
          </div>
        )}
      </CardContent>
    </Card>
  )
}
