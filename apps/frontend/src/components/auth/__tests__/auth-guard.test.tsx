import { render, screen } from '@testing-library/react'
import { AuthGuard } from '../auth-guard'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

// Mock the auth context
jest.mock('@/contexts/auth-context')
jest.mock('next/navigation')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockPush = jest.fn()

describe('AuthGuard', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })
    mockPush.mockClear()
  })

  it('shows loading state when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      community: null,
      loading: true,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    )

    expect(screen.getByText('Authenticating...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      community: null,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/admin/settings',
        search: '?tab=general',
        origin: 'http://localhost:3000',
      },
      writable: true,
    })

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    )

    expect(mockPush).toHaveBeenCalledWith(
      'http://localhost:3000/login?redirect=%2Fadmin%2Fsettings%3Ftab%3Dgeneral'
    )
    expect(screen.getByText('Redirecting to login...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    const mockUser = { id: 1, email: 'test@example.com' }
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      community: null,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('uses custom redirect URL when provided', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      community: null,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/admin',
        search: '',
        origin: 'http://localhost:3000',
      },
      writable: true,
    })

    render(
      <AuthGuard redirectTo="/signin">
        <div>Protected Content</div>
      </AuthGuard>
    )

    expect(mockPush).toHaveBeenCalledWith(
      'http://localhost:3000/signin?redirect=%2Fadmin'
    )
  })
})

