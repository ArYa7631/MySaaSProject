'use client'

import { useState, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react'
import { ImageService, ImageUploadResponse } from '@/services/image.service'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'

interface ImageUploadProps {
  onUploadSuccess?: (response: ImageUploadResponse) => void
  onUploadError?: (error: string) => void
  folder?: string
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  className?: string
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  folder,
  maxFiles = 1,
  maxSizeMB = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  className = ''
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<ImageUploadResponse[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([])
    
    // Check if user is authenticated
    if (!user) {
      const errorMessage = 'You must be logged in to upload images'
      setErrors([errorMessage])
      onUploadError?.(errorMessage)
      toast({
        title: 'Authentication Required',
        description: errorMessage,
        variant: 'destructive',
      })
      return
    }
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectionErrors = rejectedFiles.map(rejection => {
        if (rejection.errors[0]?.code === 'file-too-large') {
          return `File ${rejection.file.name} is too large. Maximum size is ${maxSizeMB}MB.`
        }
        if (rejection.errors[0]?.code === 'file-invalid-type') {
          return `File ${rejection.file.name} has an invalid type.`
        }
        return `File ${rejection.file.name} was rejected.`
      })
      setErrors(rejectionErrors)
      return
    }

    // Validate files
    const validFiles = acceptedFiles.filter(file => {
      if (!ImageService.isValidImageType(file)) {
        setErrors(prev => [...prev, `File ${file.name} has an invalid type.`])
        return false
      }
      if (!ImageService.isValidImageSize(file, maxSizeMB)) {
        setErrors(prev => [...prev, `File ${file.name} is too large. Maximum size is ${maxSizeMB}MB.`])
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        // Simulate progress for multiple files
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 100)

        try {
          const response = await ImageService.uploadImage(file, folder)
          clearInterval(progressInterval)
          setUploadProgress(100)
          
          // Only add to uploaded images if response is valid
          if (response && response.url) {
            setUploadedImages(prev => [...prev, response])
            onUploadSuccess?.(response)
            
            toast({
              title: 'Upload Successful',
              description: `Image ${file.name} uploaded successfully.`,
            })
          } else {
            throw new Error('Invalid response from server')
          }
          
          return response
        } catch (error) {
          clearInterval(progressInterval)
          const errorMessage = error instanceof Error ? error.message : 'Upload failed'
          setErrors(prev => [...prev, `Failed to upload ${file.name}: ${errorMessage}`])
          onUploadError?.(errorMessage)
          
          toast({
            title: 'Upload Failed',
            description: `Failed to upload ${file.name}: ${errorMessage}`,
            variant: 'destructive',
          })
          
          throw error
        }
      })

      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [folder, maxSizeMB, onUploadSuccess, onUploadError, toast, user])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    disabled: uploading || !user
  })

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const clearErrors = () => {
    setErrors([])
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Uploading...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className={`h-12 w-12 mx-auto ${!user ? 'text-gray-300' : 'text-gray-400'}`} />
                <div>
                  <p className="text-lg font-medium">
                    {!user 
                      ? 'Login Required' 
                      : isDragActive 
                        ? 'Drop images here' 
                        : 'Upload Images'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {!user 
                      ? 'You must be logged in to upload images'
                      : 'Drag and drop images here, or click to select files'
                    }
                  </p>
                  {user && (
                    <p className="text-xs text-gray-400 mt-1">
                      Supports: JPEG, PNG, GIF, WebP (max {maxSizeMB}MB each)
                    </p>
                  )}
                </div>
                {user && (
                  <Button variant="outline" disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="aspect-square relative overflow-hidden rounded-md">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearErrors}
              className="mt-2"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
