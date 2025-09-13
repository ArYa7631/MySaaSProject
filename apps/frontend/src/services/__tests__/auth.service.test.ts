import AuthService from '../auth.service'
import { apiClientMethods } from '@/lib/api-client'

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  apiClientMethods: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockApiClient = apiClientMethods as jest.Mocked<typeof apiClientMethods>

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockResponse = {
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          },
          token: 'mock-token',
          community: {
            id: 1,
            name: 'Test Community',
          },
        },
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await AuthService.login(credentials)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle login error', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrong-password',
      }

      const error = new Error('Invalid credentials')
      mockApiClient.post.mockRejectedValue(error)

      await expect(AuthService.login(credentials)).rejects.toThrow('Invalid credentials')
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      const credentials = {
        email: 'new@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        name: 'New Community',
        domain: 'new-community',
      }

      const mockResponse = {
        data: {
          user: {
            id: 2,
            email: 'new@example.com',
            first_name: 'New',
            last_name: 'User',
          },
          token: 'mock-token',
          community: {
            id: 2,
            name: 'New Community',
          },
        },
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await AuthService.register(credentials)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', credentials)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockApiClient.post.mockResolvedValue({})

      await AuthService.logout()

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout')
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      }

      const mockResponse = {
        data: mockUser,
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await AuthService.getCurrentUser()

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        data: {
          token: 'new-token',
        },
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await AuthService.refreshToken()

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/refresh')
      expect(result).toEqual({ token: 'new-token' })
    })
  })

  describe('requestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      const data = {
        email: 'test@example.com',
      }

      mockApiClient.post.mockResolvedValue({})

      await AuthService.requestPasswordReset(data)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/password/reset', data)
    })
  })

  describe('confirmPasswordReset', () => {
    it('should confirm password reset successfully', async () => {
      const data = {
        token: 'reset-token',
        password: 'new-password',
        password_confirmation: 'new-password',
      }

      mockApiClient.post.mockResolvedValue({})

      await AuthService.confirmPasswordReset(data)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/password/reset/confirm', data)
    })
  })

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const data = {
        current_password: 'old-password',
        password: 'new-password',
        password_confirmation: 'new-password',
      }

      mockApiClient.post.mockResolvedValue({})

      await AuthService.changePassword(data)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/password/change', data)
    })
  })

  describe('updateProfile', () => {
    it('should update profile with text data successfully', async () => {
      const data = {
        first_name: 'Updated',
        last_name: 'Name',
        email: 'updated@example.com',
      }

      const mockUser = {
        id: 1,
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'Name',
      }

      const mockResponse = {
        data: mockUser,
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await AuthService.updateProfile(data)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/profile', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      expect(result).toEqual(mockUser)
    })

    it('should update profile with file successfully', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const data = {
        first_name: 'Updated',
        avatar: file,
      }

      const mockUser = {
        id: 1,
        first_name: 'Updated',
        avatar_url: 'https://example.com/avatar.jpg',
      }

      const mockResponse = {
        data: mockUser,
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await AuthService.updateProfile(data)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/profile', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      expect(result).toEqual(mockUser)
    })
  })

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const token = 'verification-token'

      mockApiClient.post.mockResolvedValue({})

      await AuthService.verifyEmail(token)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/email/verify', { token })
    })
  })

  describe('resendEmailVerification', () => {
    it('should resend email verification successfully', async () => {
      mockApiClient.post.mockResolvedValue({})

      await AuthService.resendEmailVerification()

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/email/verify/resend')
    })
  })

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const password = 'password123'

      mockApiClient.post.mockResolvedValue({})

      await AuthService.deleteAccount(password)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/account/delete', { password })
    })
  })

  describe('getUserSessions', () => {
    it('should get user sessions successfully', async () => {
      const mockSessions = [
        { id: 1, device: 'Chrome', location: 'New York' },
        { id: 2, device: 'Firefox', location: 'London' },
      ]

      const mockResponse = {
        data: mockSessions,
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await AuthService.getUserSessions()

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/sessions')
      expect(result).toEqual(mockSessions)
    })
  })

  describe('revokeSession', () => {
    it('should revoke session successfully', async () => {
      const sessionId = 'session-123'

      mockApiClient.delete.mockResolvedValue({})

      await AuthService.revokeSession(sessionId)

      expect(mockApiClient.delete).toHaveBeenCalledWith('/auth/sessions/session-123')
    })
  })

  describe('revokeAllSessions', () => {
    it('should revoke all sessions successfully', async () => {
      mockApiClient.delete.mockResolvedValue({})

      await AuthService.revokeAllSessions()

      expect(mockApiClient.delete).toHaveBeenCalledWith('/auth/sessions')
    })
  })

  describe('checkEmailAvailability', () => {
    it('should check email availability successfully', async () => {
      const email = 'test@example.com'
      const mockResponse = {
        data: { available: true },
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await AuthService.checkEmailAvailability(email)

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/email/check?email=test%40example.com')
      expect(result).toEqual({ available: true })
    })
  })

  describe('checkUsernameAvailability', () => {
    it('should check username availability successfully', async () => {
      const username = 'testuser'
      const mockResponse = {
        data: { available: false },
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await AuthService.checkUsernameAvailability(username)

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/username/check?username=testuser')
      expect(result).toEqual({ available: false })
    })
  })

  describe('getUserActivity', () => {
    it('should get user activity successfully', async () => {
      const mockActivity = [
        { id: 1, action: 'login', timestamp: '2023-01-01T00:00:00Z' },
        { id: 2, action: 'logout', timestamp: '2023-01-01T01:00:00Z' },
      ]

      const mockResponse = {
        data: mockActivity,
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await AuthService.getUserActivity(1, 20)

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/activity?page=1&per_page=20')
      expect(result).toEqual(mockActivity)
    })
  })

  describe('enableTwoFactor', () => {
    it('should enable two-factor authentication successfully', async () => {
      const mockResponse = {
        data: {
          qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
          backup_codes: ['123456', '789012', '345678'],
        },
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await AuthService.enableTwoFactor()

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/2fa/enable')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('disableTwoFactor', () => {
    it('should disable two-factor authentication successfully', async () => {
      const password = 'password123'

      mockApiClient.post.mockResolvedValue({})

      await AuthService.disableTwoFactor(password)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/2fa/disable', { password })
    })
  })

  describe('verifyTwoFactor', () => {
    it('should verify two-factor authentication successfully', async () => {
      const code = '123456'

      mockApiClient.post.mockResolvedValue({})

      await AuthService.verifyTwoFactor(code)

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/2fa/verify', { code })
    })
  })

  describe('generateBackupCodes', () => {
    it('should generate backup codes successfully', async () => {
      const mockResponse = {
        data: {
          backup_codes: ['123456', '789012', '345678', '901234', '567890'],
        },
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await AuthService.generateBackupCodes()

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/2fa/backup-codes')
      expect(result).toEqual(mockResponse.data)
    })
  })
})
