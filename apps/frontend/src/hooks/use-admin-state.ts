'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Community } from '@mysaasproject/shared'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

interface UseAdminStateReturn {
  // Data
  community: Community | null
  isLoading: boolean
  isError: boolean
  
  // UI State
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Modal States
  showSectionBuilder: boolean
  setShowSectionBuilder: (show: boolean) => void
  showSettingsModal: boolean
  setShowSettingsModal: (show: boolean) => void
  
  // Selected Items
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
  
  // Actions
  refreshData: () => void
}

export const useAdminState = (): UseAdminStateReturn => {
  const queryClient = useQueryClient()
  const { user, community } = useAuth()
  const { toast } = useToast()
  
  // UI State
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Modal States
  const [showSectionBuilder, setShowSectionBuilder] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  
  // Selected Items
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  // Fetch community data if not available
  const {
    data: communityData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['community', user?.community_id],
    queryFn: async () => {
      if (!user?.community_id) return null
      // This would be replaced with actual API call
      return community
    },
    enabled: !!user?.community_id && !community,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Refresh data mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ['landing-page-sections'] })
      await queryClient.invalidateQueries({ queryKey: ['marketplace-configuration'] })
      await queryClient.invalidateQueries({ queryKey: ['community'] })
    },
    onSuccess: () => {
      toast({
        title: 'Data Refreshed',
        description: 'All data has been refreshed successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to refresh data. Please try again.',
        variant: 'destructive',
      })
      console.error('Refresh data error:', error)
    },
  })

  const refreshData = useCallback(async () => {
    await refreshMutation.mutateAsync()
  }, [refreshMutation])

  return {
    // Data
    community: community || communityData,
    isLoading,
    isError,
    
    // UI State
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    
    // Modal States
    showSectionBuilder,
    setShowSectionBuilder,
    showSettingsModal,
    setShowSettingsModal,
    
    // Selected Items
    selectedSectionId,
    setSelectedSectionId,
    
    // Actions
    refreshData,
  }
}
