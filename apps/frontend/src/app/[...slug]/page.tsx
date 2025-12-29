'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useCommunityContext } from '@/hooks/use-community-context'
import { RenderSections } from '@/components/sections/render-sections'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LandingPageSection } from '@mysaasproject/shared'

interface ContentPage {
  id: number
  title: string
  end_point: string
  data: {
    sections?: LandingPageSection[]
  }
  meta_data: {
    title?: string
    description?: string
    keywords?: string[]
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DynamicContentPage() {
  const params = useParams()
  const { community, isLoading: communityLoading, isError: communityError } = useCommunityContext()
  
  const [contentPage, setContentPage] = useState<ContentPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Construct the endpoint from the slug
  const endpoint = params.slug ? `/${Array.isArray(params.slug) ? params.slug.join('/') : params.slug}` : '/'

  useEffect(() => {
    if (community && !communityLoading) {
      loadContentPage()
    }
  }, [community, endpoint, communityLoading])

  const loadContentPage = async () => {
    if (!community?.id) return
    
    setIsLoading(true)
    setIsError(false)
    
    try {
      const apiBaseUrl = '/api/v1'
      const response = await fetch(`${apiBaseUrl}/communities/${community.id}/content_pages?end_point=${encodeURIComponent(endpoint)}&active_only=true`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const pages = data.data || []
        
        if (pages.length > 0) {
          setContentPage(pages[0])
        } else {
          setIsError(true)
        }
      } else {
        throw new Error('Failed to load content page')
      }
    } catch (error) {
      console.error('Error loading content page:', error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Set page metadata
  useEffect(() => {
    if (contentPage) {
      document.title = contentPage.meta_data?.title || contentPage.title
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription && contentPage.meta_data?.description) {
        metaDescription.setAttribute('content', contentPage.meta_data.description)
      }
      
      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaKeywords && contentPage.meta_data?.keywords?.length) {
        metaKeywords.setAttribute('content', contentPage.meta_data.keywords.join(', '))
      }
    }
  }, [contentPage])

  if (communityLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  if (communityError || isError || !contentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-4">
            The page you're looking for doesn't exist or is not active.
          </p>
          <a 
            href="/landing" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  const sections = contentPage.data?.sections || []
  const marketplaceConfig = community?.marketplace_configuration

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar config={marketplaceConfig} />
        <main>
          {/* Page Header */}
          <div className="bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {contentPage.title}
              </h1>
              {contentPage.meta_data?.description && (
                <p className="text-lg text-gray-600">
                  {contentPage.meta_data.description}
                </p>
              )}
            </div>
          </div>

          {/* Page Sections */}
          <RenderSections 
            sections={Array.isArray(sections) ? sections : []} 
            marketplaceConfig={marketplaceConfig} 
          />
        </main>
        <Footer config={marketplaceConfig} />
      </div>
    </ErrorBoundary>
  )
}
