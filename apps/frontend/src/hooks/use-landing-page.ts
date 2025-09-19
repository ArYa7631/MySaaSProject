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

export function useMarketplaceConfiguration(community?: any) {
  const { community: authCommunity } = useAuth()
  const targetCommunity = community || authCommunity

  return useQuery({
    queryKey: ['marketplace-configuration', targetCommunity?.id],
    queryFn: () => {
      if (!targetCommunity?.id) {
        throw new Error('No community found')
      }
      return LandingPageService.getMarketplaceConfiguration(targetCommunity.id)
    },
    enabled: !!targetCommunity?.id,
  })
}
