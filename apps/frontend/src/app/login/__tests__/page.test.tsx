import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../page'
import { AuthProvider } from '@/contexts/auth-context'

// Mock the auth context
jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockUseAuth = require('@/contexts/auth-context').useAuth

const renderLoginPage = () => {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  )
}

describe('LoginPage', () => {
  const mockLogin = jest.fn()
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      login: mockLogin,
    })
    
    // Mock Next.js router
    jest.doMock('next/navigation', () => ({
      useRouter: () => mockRouter,
    }))
  })

  describe('rendering', () => {
    it('should render login form', () => {
      renderLoginPage()
      
      expect(screen.getByText('Sign in')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    })

    it('should render sign up link', () => {
      renderLoginPage()
      
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument()
    })
  })

  describe('form validation', () => {
    it('should show error for invalid email', async () => {
      const user = userEvent.setup()
      renderLoginPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await act(async () => {
        await user.type(emailInput, 'invalid-email')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)
      })
      
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    })

    it('should show error for short password', async () => {
      const user = userEvent.setup()
      renderLoginPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, '123')
        await user.click(submitButton)
      })
      
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })

    it('should show error for empty fields', async () => {
      const user = userEvent.setup()
      renderLoginPage()
      
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await act(async () => {
        await user.click(submitButton)
      })
      
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should call login with valid credentials', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue(undefined)
      
      renderLoginPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)
      })
      
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      let resolveLogin: () => void
      mockLogin.mockImplementation(() => new Promise(resolve => {
        resolveLogin = resolve
      }))
      
      renderLoginPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)
      })
      
      expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled()
      
      // Resolve the promise
      act(() => {
        resolveLogin!()
      })
    })

    it('should show error message on login failure', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Invalid credentials'
      mockLogin.mockRejectedValue(new Error(errorMessage))
      
      renderLoginPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)
      })
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should clear error message on new submission', async () => {
      const user = userEvent.setup()
      mockLogin
        .mockRejectedValueOnce(new Error('Invalid credentials'))
        .mockResolvedValueOnce(undefined)
      
      renderLoginPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      
      // First submission - fails
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'wrongpassword')
        await user.click(submitButton)
      })
      
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
      
      // Clear form and submit again - succeeds
      await act(async () => {
        await user.clear(emailInput)
        await user.clear(passwordInput)
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)
      })
      
      await waitFor(() => {
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
      })
    })
  })

  describe('navigation', () => {
    it('should have correct link to register page', () => {
      renderLoginPage()
      
      const signUpLink = screen.getByRole('link', { name: 'Sign up' })
      expect(signUpLink).toHaveAttribute('href', '/register')
    })
  })
})
