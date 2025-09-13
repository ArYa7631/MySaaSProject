import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Community } from '@mysaasproject/shared'
import { CommunityService } from '@/services/community.service'

interface UseCommunityContextReturn {
  community: Community | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export const useCommunityContext = (): UseCommunityContextReturn => {
  const [currentDomain, setCurrentDomain] = useState<string | null>(null)

  // Get current domain
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const domain = window.location.hostname
      setCurrentDomain(domain)
    }
  }, [])

  // Fetch community by domain
  const {
    data: community = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['community-by-domain', currentDomain],
    queryFn: async () => {
      if (!currentDomain) return null
      return CommunityService.getCommunityByDomain(currentDomain)
    },
    enabled: !!currentDomain,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })

  return {
    community,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  }
}
