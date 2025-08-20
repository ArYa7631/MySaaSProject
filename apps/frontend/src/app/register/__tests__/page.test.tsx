import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '../page'
import { AuthProvider } from '@/contexts/auth-context'

// Mock the auth context
jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockUseAuth = require('@/contexts/auth-context').useAuth

const renderRegisterPage = () => {
  return render(
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>
  )
}

describe('RegisterPage', () => {
  const mockRegister = jest.fn()
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      register: mockRegister,
    })
    
    // Mock Next.js router
    jest.doMock('next/navigation', () => ({
      useRouter: () => mockRouter,
    }))
  })

  describe('rendering', () => {
    it('should render registration form', () => {
      renderRegisterPage()
      
      expect(screen.getByText('Create account')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
    })

    it('should render sign in link', () => {
      renderRegisterPage()
      
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument()
    })
  })

  describe('form validation', () => {
    it('should show error for invalid email', async () => {
      const user = userEvent.setup()
      renderRegisterPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create account' })
      
      await act(async () => {
        await user.type(emailInput, 'invalid-email')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)
      })
      
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    })

    it('should show error for short password', async () => {
      const user = userEvent.setup()
      renderRegisterPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create account' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, '123')
        await user.type(confirmPasswordInput, '123')
        await user.click(submitButton)
      })
      
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })

    it('should show error for password mismatch', async () => {
      const user = userEvent.setup()
      renderRegisterPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create account' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'differentpassword')
        await user.click(submitButton)
      })
      
      expect(screen.getByText('Passwords must match')).toBeInTheDocument()
    })

    it('should show error for empty fields', async () => {
      const user = userEvent.setup()
      renderRegisterPage()
      
      const submitButton = screen.getByRole('button', { name: 'Create account' })
      
      await act(async () => {
        await user.click(submitButton)
      })
      
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should call register with valid credentials', async () => {
      const user = userEvent.setup()
      mockRegister.mockResolvedValue(undefined)
      
      renderRegisterPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create account' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)
      })
      
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      let resolveRegister: () => void
      mockRegister.mockImplementation(() => new Promise(resolve => {
        resolveRegister = resolve
      }))
      
      renderRegisterPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create account' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)
      })
      
      expect(screen.getByRole('button', { name: 'Creating account...' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Creating account...' })).toBeDisabled()
      
      // Resolve the promise
      act(() => {
        resolveRegister!()
      })
    })

    it('should show error message on registration failure', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Email has already been taken'
      mockRegister.mockRejectedValue(new Error(errorMessage))
      
      renderRegisterPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create account' })
      
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)
      })
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should clear error message on new submission', async () => {
      const user = userEvent.setup()
      mockRegister
        .mockRejectedValueOnce(new Error('Email has already been taken'))
        .mockResolvedValueOnce(undefined)
      
      renderRegisterPage()
      
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create account' })
      
      // First submission - fails
      await act(async () => {
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)
      })
      
      await waitFor(() => {
        expect(screen.getByText('Email has already been taken')).toBeInTheDocument()
      })
      
      // Clear form and submit again - succeeds
      await act(async () => {
        await user.clear(emailInput)
        await user.clear(passwordInput)
        await user.clear(confirmPasswordInput)
        await user.type(emailInput, 'new@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(confirmPasswordInput, 'password123')
        await user.click(submitButton)
      })
      
      await waitFor(() => {
        expect(screen.queryByText('Email has already been taken')).not.toBeInTheDocument()
      })
    })
  })

  describe('navigation', () => {
    it('should have correct link to login page', () => {
      renderRegisterPage()
      
      const signInLink = screen.getByRole('link', { name: 'Sign in' })
      expect(signInLink).toHaveAttribute('href', '/login')
    })
  })
})
