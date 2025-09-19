'use client'

import { RenderSections } from '@/components/sections/render-sections'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LandingPageSkeleton } from '@/components/ui/loading-skeleton'
import { useLandingPageState } from '@/hooks/use-landing-page-state'
import { useCommunityContext } from '@/hooks/use-community-context'

export const LandingPageContent: React.FC = () => {
  const { sections, marketplaceConfig, isLoading, isError, ...nitesh } = useLandingPageState()
  const { community, isLoading: communityLoading, isError: communityError } = useCommunityContext()

  if (isLoading || communityLoading) {
    return <LandingPageSkeleton />
  }

  if (isError || communityError || !community) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h2>
          <p className="text-gray-600">
            {!community ? 'Community not found for this domain' : 'Failed to load landing page content'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar config={marketplaceConfig} />
        <main>
          <RenderSections sections={Array.isArray(sections) ? sections : []} />
        </main>
        <Footer config={marketplaceConfig} />
      </div>
    </ErrorBoundary>
  )
}
