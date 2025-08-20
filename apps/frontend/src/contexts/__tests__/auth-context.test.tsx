import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../auth-context'
import { createApiClient } from '@mysaasproject/shared'

// Mock the shared package
jest.mock('@mysaasproject/shared', () => ({
  createApiClient: jest.fn(),
}))

const mockApiClient = {
  post: jest.fn(),
  delete: jest.fn(),
}

;(createApiClient as jest.Mock).mockReturnValue(mockApiClient)

// Test component to access auth context
const TestComponent = () => {
  const { user, login, register, logout, loading } = useAuth()
  
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
        Login
      </button>
      <button onClick={() => register({ email: 'test@example.com', password: 'password', password_confirmation: 'password' })}>
        Register
      </button>
      <button onClick={() => logout()}>
        Logout
      </button>
    </div>
  )
}

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should start with no user and loading true', () => {
      renderWithAuth(<TestComponent />)
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      expect(screen.getByTestId('loading')).toHaveTextContent('loading')
    })

    it('should load user from localStorage if available', async () => {
      const mockUser = { id: 1, email: 'test@example.com', created_at: '2023-01-01', updated_at: '2023-01-01' }
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      renderWithAuth(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      })
      
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })

  describe('login', () => {
    it('should successfully login user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', created_at: '2023-01-01', updated_at: '2023-01-01' }
      const mockResponse = { data: { user: mockUser } }
      
      mockApiClient.post.mockResolvedValue(mockResponse)
      
      renderWithAuth(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      })
      
      const loginButton = screen.getByText('Login')
      await act(async () => {
        await userEvent.click(loginButton)
      })
      
      await waitFor(() => {
        expect(mockApiClient.post).toHaveBeenCalledWith('/api/auth/sign_in', {
          user: { email: 'test@example.com', password: 'password' }
        })
      })
      
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
    })

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: {
            status: {
              message: 'Invalid credentials'
            }
          }
        }
      }
      
      mockApiClient.post.mockRejectedValue(mockError)
      
      renderWithAuth(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      })
      
      const loginButton = screen.getByText('Login')
      
      await expect(act(async () => {
        await userEvent.click(loginButton)
      })).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('should successfully register user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', created_at: '2023-01-01', updated_at: '2023-01-01' }
      const mockResponse = { data: { user: mockUser } }
      
      mockApiClient.post.mockResolvedValue(mockResponse)
      
      renderWithAuth(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      })
      
      const registerButton = screen.getByText('Register')
      await act(async () => {
        await userEvent.click(registerButton)
      })
      
      await waitFor(() => {
        expect(mockApiClient.post).toHaveBeenCalledWith('/api/auth/sign_up', {
          user: { email: 'test@example.com', password: 'password', password_confirmation: 'password' }
        })
      })
      
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
    })

    it('should handle registration error with validation errors', async () => {
      const mockError = {
        response: {
          data: {
            errors: {
              email: ['has already been taken'],
              password: ['is too short']
            }
          }
        }
      }
      
      mockApiClient.post.mockRejectedValue(mockError)
      
      renderWithAuth(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      })
      
      const registerButton = screen.getByText('Register')
      
      await expect(act(async () => {
        await userEvent.click(registerButton)
      })).rejects.toThrow('has already been taken, is too short')
    })
  })

  describe('logout', () => {
    it('should successfully logout user', async () => {
      mockApiClient.delete.mockResolvedValue({})
      
      renderWithAuth(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      })
      
      const logoutButton = screen.getByText('Logout')
      await act(async () => {
        await userEvent.click(logoutButton)
      })
      
      await waitFor(() => {
        expect(mockApiClient.delete).toHaveBeenCalledWith('/api/auth/sign_out')
      })
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })

    it('should handle logout error gracefully', async () => {
      mockApiClient.delete.mockRejectedValue(new Error('Network error'))
      
      renderWithAuth(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      })
      
      const logoutButton = screen.getByText('Logout')
      await act(async () => {
        await userEvent.click(logoutButton)
      })
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })
  })
})
