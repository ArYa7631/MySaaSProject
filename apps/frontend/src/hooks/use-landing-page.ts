import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { LandingPageService } from '@/services/landing-page.service'

export function useLandingPageSections() {
  const { community } = useAuth()

  return useQuery({
    queryKey: ['landing-page-sections', community?.id],
    queryFn: () => community ? LandingPageService.getSections(community.id) : [],
    enabled: !!community,
  })
}

export function useMarketplaceConfiguration() {
  const { community } = useAuth()

  return useQuery({
    queryKey: ['marketplace-configuration', community?.id || 3],
    queryFn: () => {
      const communityId = community?.id || 3 // Use community ID 3 for development
      return LandingPageService.getMarketplaceConfiguration(communityId)
    },
    enabled: true, // Always enabled for development
  })
}
