'use client'

import { RenderSections } from '@/components/sections/render-sections'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/ui/error-boundary'
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

interface ContentPagePreviewProps {
  contentPage: ContentPage
  sections: LandingPageSection[]
}

export const ContentPagePreview: React.FC<ContentPagePreviewProps> = ({
  contentPage,
  sections
}) => {
  // Mock marketplace config for preview
  const mockMarketplaceConfig = {
    logo: null,
    title: 'Your Site',
    title_color: '#000000',
    global_bg_color: '#ffffff',
    global_text_color: '#000000',
    global_highlight_color: '#3b82f6'
  }

  return (
    <ErrorBoundary>
      <div className="border rounded-lg overflow-hidden bg-white">
        {/* Preview Header */}
        <div className="bg-gray-50 px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm text-gray-600">
              Preview: {contentPage.end_point}
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="min-h-screen">
          <Navbar config={mockMarketplaceConfig} />
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
              marketplaceConfig={mockMarketplaceConfig} 
            />
          </main>
          <Footer config={mockMarketplaceConfig} />
        </div>
      </div>
    </ErrorBoundary>
  )
}

