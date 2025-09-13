'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LandingPageSection, MarketplaceConfiguration } from '@mysaasproject/shared'
import { LandingPageService } from '@/services/landing-page.service'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'

interface UseLandingPageStateReturn {
  // Data
  sections: LandingPageSection[]
  marketplaceConfig: MarketplaceConfiguration | null
  isLoading: boolean
  isError: boolean
  
  // Section Management
  addSection: (section: LandingPageSection) => Promise<void>
  updateSection: (id: string, updates: Partial<LandingPageSection>) => Promise<void>
  deleteSection: (id: string) => Promise<void>
  reorderSections: (newOrder: string[]) => Promise<void>
  
  // Marketplace Configuration
  updateMarketplaceConfig: (updates: Partial<MarketplaceConfiguration>) => Promise<void>
  
  // UI State
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
}

export const useLandingPageState = (): UseLandingPageStateReturn => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()
  
  // UI State
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  // Fetch sections
  const {
    data: sections = [],
    isLoading: sectionsLoading,
    isError: sectionsError,
  } = useQuery({
    queryKey: ['landing-page-sections', user?.community_id || 3],
    queryFn: () => {
      const communityId = user?.community_id || 3 // Use community ID 3 for development
      console.log('Fetching sections for community ID:', communityId)
      return LandingPageService.getSections(communityId)
    },
    enabled: true, // Always enabled for development
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch marketplace configuration
  const {
    data: marketplaceConfig = null,
    isLoading: configLoading,
    isError: configError,
  } = useQuery({
    queryKey: ['marketplace-configuration', user?.community_id || 3],
    queryFn: () => LandingPageService.getMarketplaceConfiguration(user?.community_id || 3),
    enabled: true, // Always enabled for development
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Add section mutation
  const addSectionMutation = useMutation({
    mutationFn: async (section: LandingPageSection) => {
      const communityId = user?.community_id || 3
      console.log('Adding section mutation - Community ID:', communityId)
      console.log('Current sections:', sections)
      console.log('New section:', section)
      const updatedSections = [...sections, section]
      console.log('Updated sections array:', updatedSections)
      return LandingPageService.updateSections(communityId, updatedSections)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-page-sections'] })
      toast({
        title: 'Section Added',
        description: 'New section has been added successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add section. Please try again.',
        variant: 'destructive',
      })
      console.error('Add section error:', error)
    },
  })

  // Update section mutation
  const updateSectionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LandingPageSection> }) => {
      const communityId = user?.community_id || 3
      const updatedSections = sections.map((section: LandingPageSection) =>
        section.id === id ? { ...section, ...updates } : section
      )
      return LandingPageService.updateSections(communityId, updatedSections)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-page-sections'] })
      toast({
        title: 'Section Updated',
        description: 'Section has been updated successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update section. Please try again.',
        variant: 'destructive',
      })
      console.error('Update section error:', error)
    },
  })

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const communityId = user?.community_id || 3
      const updatedSections = sections.filter((section: LandingPageSection) => section.id !== id)
      return LandingPageService.updateSections(communityId, updatedSections)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-page-sections'] })
      setSelectedSectionId(null)
      toast({
        title: 'Section Deleted',
        description: 'Section has been deleted successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete section. Please try again.',
        variant: 'destructive',
      })
      console.error('Delete section error:', error)
    },
  })

  // Reorder sections mutation
  const reorderSectionsMutation = useMutation({
    mutationFn: async (newOrder: string[]) => {
      const communityId = user?.community_id || 3
      const reorderedSections = newOrder.map(id => 
        sections.find((section: LandingPageSection) => section.id === id)
      ).filter(Boolean) as LandingPageSection[]
      return LandingPageService.updateSections(communityId, reorderedSections)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-page-sections'] })
      toast({
        title: 'Sections Reordered',
        description: 'Section order has been updated successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to reorder sections. Please try again.',
        variant: 'destructive',
      })
      console.error('Reorder sections error:', error)
    },
  })

  // Update marketplace configuration mutation
  const updateMarketplaceConfigMutation = useMutation({
    mutationFn: async (updates: Partial<MarketplaceConfiguration>) => {
      const communityId = user?.community_id || 3
      if (!marketplaceConfig) throw new Error('No marketplace configuration found')
      const updatedConfig = { ...marketplaceConfig, ...updates }
      return LandingPageService.updateMarketplaceConfiguration(communityId, updatedConfig)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-configuration'] })
      toast({
        title: 'Configuration Updated',
        description: 'Marketplace configuration has been updated successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update configuration. Please try again.',
        variant: 'destructive',
      })
      console.error('Update marketplace config error:', error)
    },
  })

  // Action handlers
  const addSection = useCallback(async (section: LandingPageSection) => {
    await addSectionMutation.mutateAsync(section)
  }, [addSectionMutation])

  const updateSection = useCallback(async (id: string, updates: Partial<LandingPageSection>) => {
    await updateSectionMutation.mutateAsync({ id, updates })
  }, [updateSectionMutation])

  const deleteSection = useCallback(async (id: string) => {
    await deleteSectionMutation.mutateAsync(id)
  }, [deleteSectionMutation])

  const reorderSections = useCallback(async (newOrder: string[]) => {
    await reorderSectionsMutation.mutateAsync(newOrder)
  }, [reorderSectionsMutation])

  const updateMarketplaceConfig = useCallback(async (updates: Partial<MarketplaceConfiguration>) => {
    await updateMarketplaceConfigMutation.mutateAsync(updates)
  }, [updateMarketplaceConfigMutation])

  return {
    // Data
    sections,
    marketplaceConfig,
    isLoading: sectionsLoading || configLoading,
    isError: sectionsError || configError,
    
    // Section Management
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    
    // Marketplace Configuration
    updateMarketplaceConfig,
    
    // UI State
    isEditing,
    setIsEditing,
    selectedSectionId,
    setSelectedSectionId,
  }
}
