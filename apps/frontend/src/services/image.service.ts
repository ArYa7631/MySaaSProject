import { apiClientMethods } from '@/lib/api-client'

export interface ImageUploadResponse {
  url: string
  key: string
  filename: string
  content_type: string
  size: number
}

export interface ImageItem {
  key: string
  url: string
  filename: string
  size: number
  last_modified: string
}

export class ImageService {
  // Upload image to S3
  static async uploadImage(file: File, folder?: string): Promise<ImageUploadResponse> {
    const formData = new FormData()
    formData.append('image', file)
    if (folder) {
      formData.append('folder', folder)
    }

    const response = await apiClientMethods.post<ImageUploadResponse>('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }

  // Delete image from S3
  static async deleteImage(key: string): Promise<void> {
    await apiClientMethods.delete(`/images/${encodeURIComponent(key)}`)
  }

  // List images from S3
  static async listImages(folder?: string): Promise<ImageItem[]> {
    const params = folder ? { folder } : {}
    const response = await apiClientMethods.get<ImageItem[]>('/images', { params })
    return response.data
  }

  // Get presigned URL for private images
  static async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const response = await apiClientMethods.get<{ url: string }>('/images/presigned-url', {
      params: { key, expires_in: expiresIn }
    })
    return response.data.url
  }

  // Validate file type
  static isValidImageType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    return allowedTypes.includes(file.type)
  }

  // Validate file size (max 10MB)
  static isValidImageSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
  }

  // Format file size for display
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file extension
  static getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  }

  // Generate thumbnail URL (if your S3 has image processing)
  static getThumbnailUrl(url: string, width: number = 200, height: number = 200): string {
    // This is a placeholder - you might want to use AWS CloudFront or Lambda for image resizing
    return url
  }
}
