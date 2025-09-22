import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { NavigationService, NavigationItem, FooterSection } from '@/services/navigation.service'

export const useTopbarNavigation = () => {
  const { community } = useAuth()

  return useQuery({
    queryKey: ['topbar-navigation', community?.id],
    queryFn: () => {
      if (!community?.id) throw new Error('No community found')
      return NavigationService.getTopbar(community.id)
    },
    enabled: !!community?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useFooterNavigation = () => {
  const { community } = useAuth()

  return useQuery({
    queryKey: ['footer-navigation', community?.id],
    queryFn: () => {
      if (!community?.id) throw new Error('No community found')
      return NavigationService.getFooter(community.id)
    },
    enabled: !!community?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateTopbarNavigation = () => {
  const { community } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items: NavigationItem[]) => {
      if (!community?.id) throw new Error('No community found')
      console.log('Updating topbar navigation for community:', community.id, 'with items:', items)
      return NavigationService.updateTopbarNavigation(community.id, items)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topbar-navigation'] })
      queryClient.invalidateQueries({ queryKey: ['community-by-domain'] })
      toast({
        title: 'Success',
        description: 'Topbar navigation updated successfully',
      })
    },
    onError: (error) => {
      console.error('Update topbar navigation error:', error)
      toast({
        title: 'Error',
        description: `Failed to update topbar navigation: ${error.message}`,
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateFooterNavigation = () => {
  const { community } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sections: FooterSection[]) => {
      if (!community?.id) throw new Error('No community found')
      return NavigationService.updateFooterSections(community.id, sections)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-navigation'] })
      queryClient.invalidateQueries({ queryKey: ['community-by-domain'] })
      toast({
        title: 'Success',
        description: 'Footer navigation updated successfully',
      })
    },
    onError: (error) => {
      console.error('Update footer navigation error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update footer navigation',
        variant: 'destructive',
      })
    },
  })
}

// Helper hooks for extracting navigation data
export const useTopbarItems = (): NavigationItem[] => {
  const { data: topbarData } = useTopbarNavigation()
  
  if (!topbarData) return []
  
  // Use navigation_items if available (new format), otherwise fall back to navigation
  const navItems = topbarData.navigation_items || []
  
  if (navItems.length > 0) {
    // New format - already converted by backend
    return navItems.sort((a, b) => (a.order || 0) - (b.order || 0))
  }
  
  // Fallback to old format if navigation_items is empty
  const navData = topbarData.navigation
  if (Array.isArray(navData)) {
    return navData.sort((a, b) => (a.order || 0) - (b.order || 0))
  } else if (navData?.items) {
    return navData.items.sort((a, b) => (a.order || 0) - (b.order || 0))
  }
  
  return []
}

export const useFooterSections = (): FooterSection[] => {
  const { data: footerData } = useFooterNavigation()
  
  if (!footerData?.sections) return []
  return footerData.sections || []
}
