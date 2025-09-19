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

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken')
    return !!token
  }

  // Upload image to S3
  static async uploadImage(file: File, folder?: string): Promise<ImageUploadResponse> {
    try {
      // Check authentication first
      if (!this.isAuthenticated()) {
        throw new Error('You must be logged in to upload images. Please log in and try again.')
      }

      const formData = new FormData()
      formData.append('image', file)
      if (folder) {
        formData.append('folder', folder)
      }


      const response = await apiClientMethods.post<ImageUploadResponse>('/images/upload', formData)

      // The backend returns { status: "success", data: { ... } }
      // apiClientMethods.post extracts response.data, so we get { status: "success", data: { ... } }
      if (!response || response.status !== 'success' || !response.data) {
        console.error('Invalid response structure:', response)
        throw new Error('Invalid response from server')
      }

      return response.data
    } catch (error) {
      console.error('Image upload error:', error)
      
      // Check if it's an Axios error with response data
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        
        // Check for HTML response (indicates server error or wrong endpoint)
        const contentType = axiosError.response?.headers?.['content-type']
        if (contentType?.includes('text/html')) {
          throw new Error(`Server returned HTML instead of JSON (Status: ${axiosError.response?.status}). Check if the backend is running.`)
        }
        
        // Handle specific HTTP status codes
        if (axiosError.response?.status === 401) {
          throw new Error('Authentication required. Please log in and try again.')
        } else if (axiosError.response?.status === 404) {
          throw new Error('Upload endpoint not found. Please check the API configuration.')
        } else if (axiosError.response?.status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        throw new Error('Network error. Please check your connection and try again.')
      }
      
      if (error instanceof Error) {
        throw new Error(`Upload failed: ${error.message}`)
      }
      throw new Error('Upload failed: Unknown error')
    }
  }

  // Delete image from S3
  static async deleteImage(key: string): Promise<void> {
    await apiClientMethods.delete(`/images/${encodeURIComponent(key)}`)
  }

  // List images from S3
  static async listImages(folder?: string): Promise<ImageItem[]> {
    try {
      const params = folder ? { folder } : {}
      const response = await apiClientMethods.get<ImageItem[]>('/images', { params })
      return response.data || []
    } catch (error) {
      console.error('Error listing images:', error)
      throw new Error('Failed to load images')
    }
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

}
