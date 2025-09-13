'use client'

import { useState, useCallback, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LandingPageSection, MarketplaceConfiguration, Community } from '@mysaasproject/shared'
import { LandingPageService } from '@/services/landing-page.service'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { useCommunityContext } from '@/hooks/use-community-context'

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
  const { community, isLoading: communityLoading, isError: communityError } = useCommunityContext()

  // UI State
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  // Extract data directly from community object - much more efficient!
  const sections = useMemo(() => {
    const landingPage = community?.landing_page
    if (!landingPage) return []
    
    // Handle both sections array and content array
    const sectionsData = landingPage.sections || landingPage.content
    return Array.isArray(sectionsData) ? sectionsData : []
  }, [community?.landing_page])

  const marketplaceConfig = useMemo(() => {
    return community?.marketplace_configuration || null
  }, [community?.marketplace_configuration])

  // Use community loading and error states
  const isLoading = communityLoading
  const isError = communityError

  // Add section mutation
  const addSectionMutation = useMutation({
    mutationFn: async (section: LandingPageSection) => {
      if (!community?.id) throw new Error('No community found')
      const updatedSections = [...sections, section]
      await LandingPageService.updateSections(community.id, updatedSections)
      // Invalidate community query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['community-by-domain'] })
    },
    onSuccess: () => {
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
      if (!community?.id) throw new Error('No community found')
      const updatedSections = sections.map((section: LandingPageSection) =>
        section.id === id ? { ...section, ...updates } : section
      )
      await LandingPageService.updateSections(community.id, updatedSections)
      queryClient.invalidateQueries({ queryKey: ['community-by-domain'] })
    },
    onSuccess: () => {
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
      if (!community?.id) throw new Error('No community found')
      const updatedSections = sections.filter((section: LandingPageSection) => section.id !== id)
      await LandingPageService.updateSections(community.id, updatedSections)
      queryClient.invalidateQueries({ queryKey: ['community-by-domain'] })
    },
    onSuccess: () => {
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
      if (!community?.id) throw new Error('No community found')
      const reorderedSections = newOrder.map(id =>
        sections.find((section: LandingPageSection) => section.id === id)
      ).filter(Boolean) as LandingPageSection[]
      await LandingPageService.updateSections(community.id, reorderedSections)
      queryClient.invalidateQueries({ queryKey: ['community-by-domain'] })
    },
    onSuccess: () => {
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
      if (!community?.id) throw new Error('No community found')
      if (!marketplaceConfig) throw new Error('No marketplace configuration found')
      const updatedConfig = { ...marketplaceConfig, ...updates }
      await LandingPageService.updateMarketplaceConfiguration(community.id, updatedConfig)
      queryClient.invalidateQueries({ queryKey: ['community-by-domain'] })
    },
    onSuccess: () => {
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
    isLoading,
    isError,

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
