import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '../page'
import { AuthProvider } from '@/contexts/auth-context'

// Mock the auth context
jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockUseAuth = require('@/contexts/auth-context').useAuth

const renderDashboardPage = () => {
  return render(
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  )
}

describe('DashboardPage', () => {
  const mockLogout = jest.fn()
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock Next.js router
    jest.doMock('next/navigation', () => ({
      useRouter: () => mockRouter,
    }))
  })

  describe('when user is authenticated', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    }

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        logout: mockLogout,
        loading: false,
      })
    })

    it('should render dashboard content', () => {
      renderDashboardPage()
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Welcome to your dashboard!')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should display user information', () => {
      renderDashboardPage()
      
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('Account Information')).toBeInTheDocument()
    })

    it('should render logout button', () => {
      renderDashboardPage()
      
      expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
    })

    it('should call logout when sign out button is clicked', async () => {
      const user = userEvent.setup()
      mockLogout.mockResolvedValue(undefined)
      
      renderDashboardPage()
      
      const logoutButton = screen.getByRole('button', { name: 'Sign out' })
      await user.click(logoutButton)
      
      expect(mockLogout).toHaveBeenCalled()
    })

    it('should display account creation date', () => {
      renderDashboardPage()
      
      expect(screen.getByText('Account created:')).toBeInTheDocument()
      expect(screen.getByText('January 1, 2023')).toBeInTheDocument()
    })

    it('should display last updated date', () => {
      renderDashboardPage()
      
      expect(screen.getByText('Last updated:')).toBeInTheDocument()
      expect(screen.getByText('January 1, 2023')).toBeInTheDocument()
    })
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
        loading: false,
      })
    })

    it('should redirect to login page', () => {
      renderDashboardPage()
      
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('when loading', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
        loading: true,
      })
    })

    it('should show loading spinner', () => {
      renderDashboardPage()
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('should handle logout error gracefully', async () => {
      const user = userEvent.setup()
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      }

      mockUseAuth.mockReturnValue({
        user: mockUser,
        logout: mockLogout,
        loading: false,
      })

      mockLogout.mockRejectedValue(new Error('Logout failed'))
      
      renderDashboardPage()
      
      const logoutButton = screen.getByRole('button', { name: 'Sign out' })
      await user.click(logoutButton)
      
      expect(mockLogout).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
    }

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        logout: mockLogout,
        loading: false,
      })
    })

    it('should have proper heading structure', () => {
      renderDashboardPage()
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
    })

    it('should have accessible button labels', () => {
      renderDashboardPage()
      
      const logoutButton = screen.getByRole('button', { name: 'Sign out' })
      expect(logoutButton).toBeInTheDocument()
    })

    it('should have proper form labels', () => {
      renderDashboardPage()
      
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Account created:')).toBeInTheDocument()
      expect(screen.getByText('Last updated:')).toBeInTheDocument()
    })
  })
})
