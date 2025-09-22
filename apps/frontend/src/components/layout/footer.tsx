'use client'

import { useCommunityContext } from '@/hooks/use-community-context'
import { MarketplaceConfiguration } from '@mysaasproject/shared'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

interface FooterProps {
  config?: MarketplaceConfiguration | null
}

interface NavigationItem {
  id: string
  name: string
  url: string
  isExternal: boolean
  order: number
}

interface FooterSection {
  id: string
  label: string
  links: NavigationItem[]
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  const { community } = useCommunityContext()

  // Extract footer sections from footer configuration
  const footerSections: FooterSection[] = (() => {
    if (!community?.footer?.sections) return []
    
    const sections = community.footer.sections || []
    console.log('Footer - raw sections:', sections)
    
    const processedSections = sections
      .filter(section => section && section.label && section.links)
      .map((section, sectionIndex) => ({
        id: section.id || `section-${sectionIndex}-${Date.now()}`,
        label: section.label || 'Untitled Section',
        links: (section.links || [])
          .filter(link => link && link.name && link.url)
          .map((link, linkIndex) => ({
            id: link.id || `link-${sectionIndex}-${linkIndex}-${Date.now()}`,
            name: link.name || 'Untitled Link',
            url: link.url || '#',
            isExternal: Boolean(link.isExternal),
            order: link.order || 0
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      }))
    
    console.log('Footer - processed sections:', processedSections)
    return processedSections
  })()

  const handleLinkClick = (link: NavigationItem) => {
    if (link.isExternal) {
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
    // For internal links, Next.js Link will handle the navigation
  }

  return (
    <footer 
      className="text-white"
      style={{ 
        backgroundColor: community?.footer?.background_color || '#111827',
        color: community?.footer?.text_color || '#ffffff'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              {config?.logo ? (
                <img 
                  src={config.logo} 
                  alt={config.title || 'Logo'} 
                  className="h-8 w-auto mr-3"
                />
              ) : (
                <span 
                  className="text-xl font-bold mr-3"
                  style={{ color: community?.footer?.text_color || config?.title_color || '#fff' }}
                >
                  {config?.title || 'My Community'}
                </span>
              )}
            </div>
            <p 
              className="mb-4"
              style={{ color: community?.footer?.text_color || '#9ca3af' }}
            >
              Build and manage your community with powerful tools and beautiful landing pages.
            </p>
          </div>

          {/* Dynamic Footer Sections */}
          {footerSections.length > 0 ? (
            footerSections.map((section) => {
              if (!section || !section.label) return null
              
              return (
                <div key={section.id}>
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: community?.footer?.text_color || '#ffffff' }}
                  >
                    {section.label}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => {
                      if (!link || !link.name || !link.url) return null
                      
                      return (
                        <li key={link.id}>
                          {link.isExternal ? (
                            <button
                              onClick={() => handleLinkClick(link)}
                              className="transition-colors flex items-center gap-1"
                              style={{ 
                                color: community?.footer?.link_color || '#9ca3af'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = community?.footer?.hover_color || '#ffffff'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = community?.footer?.link_color || '#9ca3af'
                              }}
                            >
                              {link.name}
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          ) : (
                            <Link 
                              href={link.url || '#'} 
                              className="transition-colors"
                              style={{ 
                                color: community?.footer?.link_color || '#9ca3af'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = community?.footer?.hover_color || '#ffffff'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = community?.footer?.link_color || '#9ca3af'
                              }}
                            >
                              {link.name}
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })
          ) : (
            // Default footer sections if no custom sections are configured
            <>
              <div>
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: community?.footer?.text_color || '#ffffff' }}
                >
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/landing" 
                      className="transition-colors"
                      style={{ 
                        color: community?.footer?.link_color || '#9ca3af'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = community?.footer?.hover_color || '#ffffff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = community?.footer?.link_color || '#9ca3af'
                      }}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/admin" 
                      className="transition-colors"
                      style={{ 
                        color: community?.footer?.link_color || '#9ca3af'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = community?.footer?.hover_color || '#ffffff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = community?.footer?.link_color || '#9ca3af'
                      }}
                    >
                      Admin
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/login" 
                      className="transition-colors"
                      style={{ 
                        color: community?.footer?.link_color || '#9ca3af'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = community?.footer?.hover_color || '#ffffff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = community?.footer?.link_color || '#9ca3af'
                      }}
                    >
                      Sign In
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: community?.footer?.text_color || '#ffffff' }}
                >
                  Support
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/help" 
                      className="transition-colors"
                      style={{ 
                        color: community?.footer?.link_color || '#9ca3af'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = community?.footer?.hover_color || '#ffffff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = community?.footer?.link_color || '#9ca3af'
                      }}
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact" 
                      className="transition-colors"
                      style={{ 
                        color: community?.footer?.link_color || '#9ca3af'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = community?.footer?.hover_color || '#ffffff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = community?.footer?.link_color || '#9ca3af'
                      }}
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div 
          className="border-t mt-8 pt-8 text-center"
          style={{ borderColor: community?.footer?.text_color || '#374151' }}
        >
          <p style={{ color: community?.footer?.text_color || '#9ca3af' }}>
            © {new Date().getFullYear()} {config?.title || 'My Community'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
