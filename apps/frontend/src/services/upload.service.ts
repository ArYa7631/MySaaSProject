import { apiClientMethods } from '@/lib/api-client'

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadedFile {
  id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  thumbnail_url?: string
  created_at: string
  metadata?: Record<string, any>
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void
  onSuccess?: (file: UploadedFile) => void
  onError?: (error: Error) => void
  maxSize?: number // in bytes
  allowedTypes?: string[]
  folder?: string
  metadata?: Record<string, any>
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
}

export class UploadService {
  // Validate file before upload
  static validateFile(
    file: File,
    options: {
      maxSize?: number
      allowedTypes?: string[]
    } = {}
  ): FileValidationResult {
    const errors: string[] = []
    const { maxSize, allowedTypes } = options

    // Check file size
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      errors.push(`File size must be less than ${maxSizeMB}MB`)
    }

    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const mimeType = file.type.toLowerCase()
      
      const isValidType = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.substring(1)
        }
        return mimeType === type || mimeType.startsWith(type + '/')
      })

      if (!isValidType) {
        errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Upload single file
  static async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadedFile> {
    const { onProgress, onSuccess, onError, folder, metadata } = options

    try {
      // Validate file
      const validation = this.validateFile(file, {
        maxSize: options.maxSize,
        allowedTypes: options.allowedTypes,
      })

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      
      if (folder) {
        formData.append('folder', folder)
      }
      
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata))
      }

      // Upload file
      const response = await apiClientMethods.post<UploadedFile>(
        '/upload/file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress: UploadProgress = {
                loaded: progressEvent.loaded,
                total: progressEvent.total,
                percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
              }
              onProgress(progress)
            }
          },
        }
      )

      const uploadedFile = response.data
      onSuccess?.(uploadedFile)
      return uploadedFile
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      onError?.(new Error(errorMessage))
      throw error
    }
  }

  // Upload multiple files
  static async uploadFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, options))
    return Promise.all(uploadPromises)
  }

  // Upload image with thumbnail generation
  static async uploadImage(
    file: File,
    options: UploadOptions & {
      generateThumbnail?: boolean
      thumbnailSize?: { width: number; height: number }
      quality?: number
    } = {}
  ): Promise<UploadedFile> {
    const { generateThumbnail = true, thumbnailSize, quality } = options

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    
    if (generateThumbnail) {
      formData.append('generate_thumbnail', 'true')
      if (thumbnailSize) {
        formData.append('thumbnail_width', thumbnailSize.width.toString())
        formData.append('thumbnail_height', thumbnailSize.height.toString())
      }
      if (quality) {
        formData.append('quality', quality.toString())
      }
    }

    if (options.folder) {
      formData.append('folder', options.folder)
    }

    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata))
    }

    const response = await apiClientMethods.post<UploadedFile>(
      '/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options.onProgress ? (progressEvent) => {
          if (progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            }
            options.onProgress!(progress)
          }
        } : undefined,
      }
    )

    const uploadedFile = response.data
    options.onSuccess?.(uploadedFile)
    return uploadedFile
  }

  // Upload document
  static async uploadDocument(
    file: File,
    options: UploadOptions & {
      extractText?: boolean
      generatePreview?: boolean
    } = {}
  ): Promise<UploadedFile> {
    const { extractText = false, generatePreview = true } = options

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'document')
    formData.append('extract_text', extractText.toString())
    formData.append('generate_preview', generatePreview.toString())

    if (options.folder) {
      formData.append('folder', options.folder)
    }

    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata))
    }

    const response = await apiClientMethods.post<UploadedFile>(
      '/upload/document',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options.onProgress ? (progressEvent) => {
          if (progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            }
            options.onProgress!(progress)
          }
        } : undefined,
      }
    )

    const uploadedFile = response.data
    options.onSuccess?.(uploadedFile)
    return uploadedFile
  }

  // Delete uploaded file
  static async deleteFile(fileId: string): Promise<void> {
    await apiClientMethods.delete(`/upload/files/${fileId}`)
  }

  // Get file info
  static async getFileInfo(fileId: string): Promise<UploadedFile> {
    const response = await apiClientMethods.get<UploadedFile>(`/upload/files/${fileId}`)
    return response.data
  }

  // Get user's uploaded files
  static async getUserFiles(
    page: number = 1,
    perPage: number = 20,
    filters: {
      type?: string
      folder?: string
      search?: string
    } = {}
  ): Promise<{ data: UploadedFile[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value))
      }
    })

    const response = await apiClientMethods.get<{ data: UploadedFile[]; pagination: any }>(
      `/upload/files?${params}`
    )
    return response.data
  }

  // Create folder
  static async createFolder(name: string, parentFolder?: string): Promise<{ id: string; name: string; path: string }> {
    const response = await apiClientMethods.post('/upload/folders', {
      name,
      parent_folder: parentFolder,
    })
    return response.data
  }

  // Get folders
  static async getFolders(parentFolder?: string): Promise<Array<{ id: string; name: string; path: string }>> {
    const params = parentFolder ? `?parent_folder=${encodeURIComponent(parentFolder)}` : ''
    const response = await apiClientMethods.get(`/upload/folders${params}`)
    return response.data
  }

  // Delete folder
  static async deleteFolder(folderId: string): Promise<void> {
    await apiClientMethods.delete(`/upload/folders/${folderId}`)
  }
}

export default UploadService
