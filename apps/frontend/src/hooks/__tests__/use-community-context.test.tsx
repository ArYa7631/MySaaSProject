import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCommunityContext } from '../use-community-context'
import { CommunityService } from '@/services/community.service'
import { Community } from '@mysaasproject/shared'

// Mock the community service
jest.mock('@/services/community.service')
const mockCommunityService = CommunityService as jest.Mocked<typeof CommunityService>

// Mock window.location
const mockLocation = {
  hostname: 'example.com'
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useCommunityContext', () => {
  const mockCommunity: Community = {
    id: 1,
    uuid: 'test-uuid',
    ident: 'test-community',
    domain: 'example.com',
    use_domain: true,
    is_enabled: true,
    locale: 'en',
    currency: 'USD',
    country: 'US',
    ip_address: '127.0.0.1',
    person_id: 'test-person',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.hostname = 'example.com'
  })

  it('should fetch community by domain on mount', async () => {
    mockCommunityService.getCommunityByDomain.mockResolvedValue(mockCommunity)

    const { result } = renderHook(() => useCommunityContext(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.community).toBe(null)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.community).toEqual(mockCommunity)
    expect(mockCommunityService.getCommunityByDomain).toHaveBeenCalledWith('example.com')
  })

  it('should handle domain changes', async () => {
    mockCommunityService.getCommunityByDomain.mockResolvedValue(mockCommunity)

    const { result, rerender } = renderHook(() => useCommunityContext(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.community).toEqual(mockCommunity)
    })

    // Change domain
    mockLocation.hostname = 'newdomain.com'
    const newCommunity = { ...mockCommunity, domain: 'newdomain.com' }
    mockCommunityService.getCommunityByDomain.mockResolvedValue(newCommunity)

    rerender()

    await waitFor(() => {
      expect(result.current.community).toEqual(newCommunity)
    })

    expect(mockCommunityService.getCommunityByDomain).toHaveBeenCalledWith('newdomain.com')
  })

  it('should handle API errors', async () => {
    const error = new Error('Community not found')
    mockCommunityService.getCommunityByDomain.mockRejectedValue(error)

    const { result } = renderHook(() => useCommunityContext(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toEqual(error)
    expect(result.current.community).toBe(null)
  })

  it('should not fetch when domain is not available', () => {
    mockLocation.hostname = ''

    const { result } = renderHook(() => useCommunityContext(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.community).toBe(null)
    expect(mockCommunityService.getCommunityByDomain).not.toHaveBeenCalled()
  })

  it('should provide refetch function', async () => {
    mockCommunityService.getCommunityByDomain.mockResolvedValue(mockCommunity)

    const { result } = renderHook(() => useCommunityContext(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.community).toEqual(mockCommunity)
    })

    // Clear the mock to verify refetch calls it again
    mockCommunityService.getCommunityByDomain.mockClear()

    await result.current.refetch()

    expect(mockCommunityService.getCommunityByDomain).toHaveBeenCalledWith('example.com')
  })

  it('should handle multiple rapid domain changes', async () => {
    mockCommunityService.getCommunityByDomain.mockImplementation((domain) => 
      Promise.resolve({ ...mockCommunity, domain })
    )

    const { result, rerender } = renderHook(() => useCommunityContext(), {
      wrapper: createWrapper()
    })

    // Rapidly change domains
    mockLocation.hostname = 'domain1.com'
    rerender()

    mockLocation.hostname = 'domain2.com'
    rerender()

    mockLocation.hostname = 'domain3.com'
    rerender()

    await waitFor(() => {
      expect(result.current.community?.domain).toBe('domain3.com')
    })

    // Should have been called for each domain change
    expect(mockCommunityService.getCommunityByDomain).toHaveBeenCalledWith('domain1.com')
    expect(mockCommunityService.getCommunityByDomain).toHaveBeenCalledWith('domain2.com')
    expect(mockCommunityService.getCommunityByDomain).toHaveBeenCalledWith('domain3.com')
  })
})
