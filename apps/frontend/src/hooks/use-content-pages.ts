import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { ContentPageService, ContentPage, CreateContentPageData, UpdateContentPageData } from '@/services/content-page.service'
import { LandingPageSection } from '@mysaasproject/shared'

export const useContentPages = (options: {
  activeOnly?: boolean
  endPoint?: string
} = {}) => {
  const { community } = useAuth()
  const { toast } = useToast()

  return useQuery({
    queryKey: ['content-pages', community?.id, options],
    queryFn: () => {
      if (!community?.id) throw new Error('No community found')
      return ContentPageService.getContentPages(community.id, options)
    },
    enabled: !!community?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useContentPage = (pageId: number) => {
  const { community } = useAuth()

  return useQuery({
    queryKey: ['content-page', community?.id, pageId],
    queryFn: () => {
      if (!community?.id) throw new Error('No community found')
      return ContentPageService.getContentPage(community.id, pageId)
    },
    enabled: !!community?.id && !!pageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateContentPage = () => {
  const { community } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContentPageData) => {
      if (!community?.id) throw new Error('No community found')
      return ContentPageService.createContentPage(community.id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] })
      toast({
        title: 'Success',
        description: 'Content page created successfully',
      })
    },
    onError: (error) => {
      console.error('Create content page error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create content page',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateContentPage = () => {
  const { community } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pageId, data }: { pageId: number; data: UpdateContentPageData }) => {
      if (!community?.id) throw new Error('No community found')
      return ContentPageService.updateContentPage(community.id, pageId, data)
    },
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] })
      queryClient.invalidateQueries({ queryKey: ['content-page', community?.id, pageId] })
      toast({
        title: 'Success',
        description: 'Content page updated successfully',
      })
    },
    onError: (error) => {
      console.error('Update content page error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update content page',
        variant: 'destructive',
      })
    },
  })
}

export const useDeleteContentPage = () => {
  const { community } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pageId: number) => {
      if (!community?.id) throw new Error('No community found')
      return ContentPageService.deleteContentPage(community.id, pageId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] })
      toast({
        title: 'Success',
        description: 'Content page deleted successfully',
      })
    },
    onError: (error) => {
      console.error('Delete content page error:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete content page',
        variant: 'destructive',
      })
    },
  })
}

export const useContentPageSections = (pageId: number) => {
  const { data: contentPage, isLoading, isError } = useContentPage(pageId)
  
  const sections: LandingPageSection[] = contentPage?.data?.sections || []
  
  return {
    sections,
    isLoading,
    isError,
    contentPage
  }
}

export const useUpdateContentPageSections = () => {
  const { community } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pageId, sections }: { pageId: number; sections: LandingPageSection[] }) => {
      if (!community?.id) throw new Error('No community found')
      return ContentPageService.updateContentPageSections(community.id, pageId, sections)
    },
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] })
      queryClient.invalidateQueries({ queryKey: ['content-page', community?.id, pageId] })
      toast({
        title: 'Success',
        description: 'Page sections updated successfully',
      })
    },
    onError: (error) => {
      console.error('Update content page sections error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update page sections',
        variant: 'destructive',
      })
    },
  })
}

