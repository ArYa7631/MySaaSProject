import { apiClientMethods, ApiResponse } from '@/lib/api-client'
import { User, LoginCredentials, RegisterCredentials } from '@mysaasproject/shared'

export interface AuthResponse {
  user: User
  token: string
  community?: any
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordRequest {
  current_password: string
  password: string
  password_confirmation: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  email?: string
  avatar?: File
}

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClientMethods.post<AuthResponse>('/auth/login', credentials)
    return response.data
  }

  // Register new user
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClientMethods.post<AuthResponse>('/auth/register', credentials)
    return response.data
  }

  // Logout user
  static async logout(): Promise<void> {
    await apiClientMethods.post('/auth/logout')
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    const response = await apiClientMethods.get<User>('/auth/me')
    return response.data
  }

  // Refresh token
  static async refreshToken(): Promise<{ token: string }> {
    const response = await apiClientMethods.post<{ token: string }>('/auth/refresh')
    return response.data
  }

  // Request password reset
  static async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    await apiClientMethods.post('/auth/password/reset', data)
  }

  // Confirm password reset
  static async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    await apiClientMethods.post('/auth/password/reset/confirm', data)
  }

  // Change password
  static async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClientMethods.post('/auth/password/change', data)
  }

  // Update profile
  static async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await apiClientMethods.post<User>('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Verify email
  static async verifyEmail(token: string): Promise<void> {
    await apiClientMethods.post('/auth/email/verify', { token })
  }

  // Resend email verification
  static async resendEmailVerification(): Promise<void> {
    await apiClientMethods.post('/auth/email/verify/resend')
  }

  // Delete account
  static async deleteAccount(password: string): Promise<void> {
    await apiClientMethods.post('/auth/account/delete', { password })
  }

  // Get user sessions
  static async getUserSessions(): Promise<any[]> {
    const response = await apiClientMethods.get<any[]>('/auth/sessions')
    return response.data
  }

  // Revoke session
  static async revokeSession(sessionId: string): Promise<void> {
    await apiClientMethods.delete(`/auth/sessions/${sessionId}`)
  }

  // Revoke all sessions
  static async revokeAllSessions(): Promise<void> {
    await apiClientMethods.delete('/auth/sessions')
  }

  // Check if email is available
  static async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await apiClientMethods.get<{ available: boolean }>(`/auth/email/check?email=${encodeURIComponent(email)}`)
    return response.data
  }

  // Check if username is available
  static async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    const response = await apiClientMethods.get<{ available: boolean }>(`/auth/username/check?username=${encodeURIComponent(username)}`)
    return response.data
  }

  // Get user activity
  static async getUserActivity(page: number = 1, perPage: number = 20): Promise<any> {
    const response = await apiClientMethods.get(`/auth/activity?page=${page}&per_page=${perPage}`)
    return response.data
  }

  // Enable two-factor authentication
  static async enableTwoFactor(): Promise<{ qr_code: string; backup_codes: string[] }> {
    const response = await apiClientMethods.post<{ qr_code: string; backup_codes: string[] }>('/auth/2fa/enable')
    return response.data
  }

  // Disable two-factor authentication
  static async disableTwoFactor(password: string): Promise<void> {
    await apiClientMethods.post('/auth/2fa/disable', { password })
  }

  // Verify two-factor authentication
  static async verifyTwoFactor(code: string): Promise<void> {
    await apiClientMethods.post('/auth/2fa/verify', { code })
  }

  // Generate backup codes
  static async generateBackupCodes(): Promise<{ backup_codes: string[] }> {
    const response = await apiClientMethods.post<{ backup_codes: string[] }>('/auth/2fa/backup-codes')
    return response.data
  }
}

export default AuthService
