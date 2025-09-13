import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/auth-context'
import { QueryProvider } from '@/providers/query-provider'

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  initialAuthState?: {
    user?: any
    community?: any
    isLoading?: boolean
  }
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  })

const AllTheProviders = ({ 
  children, 
  queryClient = createTestQueryClient(),
  initialAuthState = {}
}: { 
  children: React.ReactNode
  queryClient?: QueryClient
  initialAuthState?: any
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialAuthState={initialAuthState}>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, initialAuthState, ...renderOptions } = options

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient} initialAuthState={initialAuthState}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  community_id: 1,
  ...overrides,
})

export const createMockCommunity = (overrides = {}) => ({
  id: 1,
  uuid: 'test-uuid',
  ident: 'test-community',
  domain: 'test.com',
  is_enabled: true,
  person_id: 'test-person',
  ...overrides,
})

export const createMockLandingPageSection = (overrides = {}) => ({
  id: 'section-1',
  name: 'HeroSection',
  description: 'Test section',
  content: {
    title: 'Test Title',
    description: 'Test Description',
    primaryButton: {
      text: 'Get Started',
      url: '/signup',
    },
  },
  ...overrides,
})

export const createMockMarketplaceConfiguration = (overrides = {}) => ({
  id: 1,
  community_id: 1,
  global_text_color: '#000000',
  global_bg_color: '#ffffff',
  global_highlight_color: '#3b82f6',
  logo: 'https://example.com/logo.png',
  title: 'Test Community',
  title_color: '#000000',
  is_enabled: true,
  ...overrides,
})

// Common test helpers
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0))

export const mockApiResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
})

export const mockApiError = (message: string, status = 400) => {
  const error = new Error(message)
  ;(error as any).response = {
    data: { message },
    status,
    statusText: 'Bad Request',
  }
  return error
}

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.IntersectionObserver = mockIntersectionObserver
}

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn()
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.ResizeObserver = mockResizeObserver
}

// Mock window.matchMedia
export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Test environment setup
export const setupTestEnvironment = () => {
  mockIntersectionObserver()
  mockResizeObserver()
  mockMatchMedia()
  
  const localStorageMock = mockLocalStorage()
  const sessionStorageMock = mockSessionStorage()
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
  
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
  })
  
  return {
    localStorage: localStorageMock,
    sessionStorage: sessionStorageMock,
  }
}
