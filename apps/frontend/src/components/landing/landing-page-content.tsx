'use client'

import { RenderSections } from '@/components/sections/render-sections'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useLandingPageState } from '@/hooks/use-landing-page-state'

export const LandingPageContent: React.FC = () => {
  const { sections, marketplaceConfig, isLoading, isError } = useLandingPageState()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h2>
          <p className="text-gray-600">Failed to load landing page content</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar config={marketplaceConfig} />
        <main>
          <RenderSections sections={sections || []} />
        </main>
        <Footer config={marketplaceConfig} />
      </div>
    </ErrorBoundary>
  )
}
