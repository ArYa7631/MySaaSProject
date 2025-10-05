import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useToast } from '@/hooks/use-toast'

// API Configuration
// For production with relative URLs: NEXT_PUBLIC_API_URL should be '/api/v1'
// For development: defaults to 'http://localhost:3001/api/v1'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
const API_TIMEOUT = 30000 // 30 seconds

// Request/Response interceptors
const requestInterceptor = (config: AxiosRequestConfig) => {
  // Debug: Log the full URL being constructed
  console.log('API Request - Base URL:', config.baseURL)
  console.log('API Request - URL path:', config.url)
  console.log('API Request - Full URL:', `${config.baseURL}${config.url}`)
  
  // Don't set Content-Type for FormData - let browser handle it
  if (config.data instanceof FormData) {
    delete config.headers?.['Content-Type']
  }
  
  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  // Add community ID if available
  if (typeof window !== 'undefined') {
    const communityId = localStorage.getItem('communityId')
    if (communityId) {
      config.headers = {
        ...config.headers,
        'X-Community-ID': communityId,
      }
    }
  }

  return config
}

const responseInterceptor = (response: AxiosResponse) => {
  // Log response for debugging
  console.debug(`API Request completed:`, response.config.url)
  console.debug('Response status:', response.status)
  console.debug('Response headers:', response.headers)
  console.debug('Response data type:', typeof response.data)
  console.debug('Response data preview:', response.data)
  return response
}

const errorInterceptor = (error: AxiosError) => {
  const { response, request, config } = error

  // Log error details
  console.error('API Error:', {
    url: config?.url,
    method: config?.method,
    status: response?.status,
    message: error.message,
  })
  
  // Log detailed error information
  if (response) {
    console.error('Error response data:', response.data)
    console.error('Error response headers:', response.headers)
    console.error('Error response status text:', response.statusText)
  }

  // Handle different error types
  if (response) {
    // Server responded with error status
    const { status, data } = response

    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
          localStorage.removeItem('communityData')
          window.location.href = '/login'
        }
        break

      case 403:
        // Forbidden
        console.error('Access Denied: You do not have permission to perform this action.')
        break

      case 404:
        // Not found
        console.error('Not Found: The requested resource was not found.')
        break

      case 422:
        // Validation error
        const validationErrors = (data as any)?.errors || (data as any)?.message
        if (validationErrors) {
          console.error('Validation Error:', Array.isArray(validationErrors) 
            ? validationErrors.join(', ') 
            : validationErrors)
        }
        break

      case 500:
        // Server error
        console.error('Server Error: An unexpected error occurred. Please try again later.')
        break

      default:
        // Other errors
        const errorMessage = (data as any)?.message || 'An error occurred'
        console.error('Error:', errorMessage)
    }
  } else if (request) {
    // Network error
    console.error('Network Error: Unable to connect to the server. Please check your internet connection.')
  } else {
    // Other error
    console.error('Error:', error.message || 'An unexpected error occurred')
  }

  return Promise.reject(error)
}

// Create API client instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,  // Include credentials for CORS
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptors
apiClient.interceptors.request.use(requestInterceptor as any)
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor)

// API Response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
  status: number
}

// API Client methods
export const apiClientMethods = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then(response => response.data),

  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then(response => response.data),

  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then(response => response.data),

  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then(response => response.data),

  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then(response => response.data),

  // Upload file
  upload: <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    }).then(response => response.data)
  },
}

export default apiClient
