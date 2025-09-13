import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLandingPageState } from '../use-landing-page-state'
import { createMockUser, createMockLandingPageSection, createMockMarketplaceConfiguration } from '@/utils/test-utils'

// Mock the services
jest.mock('@/services/landing-page.service', () => ({
  landingPageService: {
    getSections: jest.fn(),
    getMarketplaceConfiguration: jest.fn(),
    updateSections: jest.fn(),
    updateMarketplaceConfiguration: jest.fn(),
  },
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    user: createMockUser(),
    community: null,
    isLoading: false,
  }),
}))

const mockLandingPageService = require('@/services/landing-page.service').landingPageService

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

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useLandingPageState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch sections successfully', async () => {
    const mockSections = [
      createMockLandingPageSection({ id: 'section-1' }),
      createMockLandingPageSection({ id: 'section-2' }),
    ]

    mockLandingPageService.getSections.mockResolvedValue(mockSections)

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.sections).toEqual(mockSections)
    expect(mockLandingPageService.getSections).toHaveBeenCalledWith(1)
  })

  it('should fetch marketplace configuration successfully', async () => {
    const mockConfig = createMockMarketplaceConfiguration()

    mockLandingPageService.getMarketplaceConfiguration.mockResolvedValue(mockConfig)

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.marketplaceConfig).toEqual(mockConfig)
    expect(mockLandingPageService.getMarketplaceConfiguration).toHaveBeenCalledWith(1)
  })

  it('should handle loading state', () => {
    mockLandingPageService.getSections.mockImplementation(() => new Promise(() => {}))
    mockLandingPageService.getMarketplaceConfiguration.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    expect(result.current.isLoading).toBe(true)
  })

  it('should handle error state', async () => {
    const error = new Error('Failed to fetch sections')
    mockLandingPageService.getSections.mockRejectedValue(error)

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })

  it('should add section successfully', async () => {
    const mockSections = [createMockLandingPageSection({ id: 'section-1' })]
    const newSection = createMockLandingPageSection({ id: 'section-2' })

    mockLandingPageService.getSections.mockResolvedValue(mockSections)
    mockLandingPageService.updateSections.mockResolvedValue(undefined)

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await result.current.addSection(newSection)

    expect(mockLandingPageService.updateSections).toHaveBeenCalledWith(1, [
      ...mockSections,
      newSection,
    ])
  })

  it('should update section successfully', async () => {
    const mockSections = [createMockLandingPageSection({ id: 'section-1' })]
    const updates = { description: 'Updated description' }

    mockLandingPageService.getSections.mockResolvedValue(mockSections)
    mockLandingPageService.updateSections.mockResolvedValue(undefined)

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await result.current.updateSection('section-1', updates)

    expect(mockLandingPageService.updateSections).toHaveBeenCalledWith(1, [
      { ...mockSections[0], ...updates },
    ])
  })

  it('should delete section successfully', async () => {
    const mockSections = [
      createMockLandingPageSection({ id: 'section-1' }),
      createMockLandingPageSection({ id: 'section-2' }),
    ]

    mockLandingPageService.getSections.mockResolvedValue(mockSections)
    mockLandingPageService.updateSections.mockResolvedValue(undefined)

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await result.current.deleteSection('section-1')

    expect(mockLandingPageService.updateSections).toHaveBeenCalledWith(1, [mockSections[1]])
  })

  it('should reorder sections successfully', async () => {
    const mockSections = [
      createMockLandingPageSection({ id: 'section-1' }),
      createMockLandingPageSection({ id: 'section-2' }),
    ]

    mockLandingPageService.getSections.mockResolvedValue(mockSections)
    mockLandingPageService.updateSections.mockResolvedValue(undefined)

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await result.current.reorderSections(['section-2', 'section-1'])

    expect(mockLandingPageService.updateSections).toHaveBeenCalledWith(1, [
      mockSections[1],
      mockSections[0],
    ])
  })

  it('should update marketplace configuration successfully', async () => {
    const mockConfig = createMockMarketplaceConfiguration()
    const updates = { title: 'Updated Title' }

    mockLandingPageService.getMarketplaceConfiguration.mockResolvedValue(mockConfig)
    mockLandingPageService.updateMarketplaceConfiguration.mockResolvedValue({
      ...mockConfig,
      ...updates,
    })

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await result.current.updateMarketplaceConfig(updates)

    expect(mockLandingPageService.updateMarketplaceConfiguration).toHaveBeenCalledWith(1, {
      ...mockConfig,
      ...updates,
    })
  })

  it('should handle UI state correctly', () => {
    mockLandingPageService.getSections.mockResolvedValue([])
    mockLandingPageService.getMarketplaceConfiguration.mockResolvedValue(null)

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    expect(result.current.isEditing).toBe(false)
    expect(result.current.selectedSectionId).toBe(null)

    result.current.setIsEditing(true)
    expect(result.current.isEditing).toBe(true)

    result.current.setSelectedSectionId('section-1')
    expect(result.current.selectedSectionId).toBe('section-1')
  })

  it('should not fetch data when user has no community_id', () => {
    jest.doMock('@/contexts/auth-context', () => ({
      useAuth: () => ({
        user: { ...createMockUser(), community_id: undefined },
        community: null,
        isLoading: false,
      }),
    }))

    const { result } = renderHook(() => useLandingPageState(), { wrapper })

    expect(result.current.isLoading).toBe(false)
    expect(mockLandingPageService.getSections).not.toHaveBeenCalled()
    expect(mockLandingPageService.getMarketplaceConfiguration).not.toHaveBeenCalled()
  })
})
