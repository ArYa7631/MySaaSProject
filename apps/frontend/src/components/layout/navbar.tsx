'use client'

import { useAuth } from '@/contexts/auth-context'
import { useCommunityContext } from '@/hooks/use-community-context'
import { Button } from '@/components/ui/button'
import { MarketplaceConfiguration } from '@mysaasproject/shared'
import Link from 'next/link'
import { ExternalLink, User } from 'lucide-react'

interface NavbarProps {
  config?: MarketplaceConfiguration | null
}

interface NavigationItem {
  id: string
  name: string
  url: string
  isExternal: boolean
  order: number
}

export const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const { user } = useAuth()
  const { community } = useCommunityContext()

  // Check if this is a super admin domain
  const isSuperAdmin = (config as any)?.is_super_admin || (community as any)?.marketplace_configuration?.is_super_admin || false

  // Get website name - prefer ident, fallback to domain
  const websiteName = community?.ident || community?.domain || 'My Community'

  // Extract navigation items from topbar configuration
  const navigationItems: NavigationItem[] = (() => {
    if (!(community as any)?.topbar) return []
    
    // Use navigation_items if available (new format), otherwise fall back to navigation
    const navItems = (community as any).topbar.navigation_items || []
    
    if (navItems.length > 0) {
      // New format - already converted by backend
      return navItems
        .filter((item: any) => item && item.name && item.url) // Filter out invalid items
        .map((item: any, index: number) => ({
          id: item.id || `item-${index}-${Date.now()}`,
          name: item.name || 'Untitled',
          url: item.url || '#',
          isExternal: Boolean(item.isExternal),
          order: item.order || 0
        }))
        .sort((a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0))
    }
    
    // Fallback to old format if navigation_items is empty
    const navData = (community as any).topbar.navigation
    if (Array.isArray(navData)) {
      return navData
        .filter((item: any) => item && (item.linkTitle || item.name) && (item.linkHref || item.url))
        .map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          name: item.linkTitle || item.name || 'Untitled',
          url: item.linkHref || item.url || '#',
          isExternal: Boolean(item.isExternal || (item.linkHref || item.url)?.startsWith('http')),
          order: item.order || index
        }))
        .sort((a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0))
    } else if (navData?.items) {
      return navData.items
        .filter((item: any) => item && (item.linkTitle || item.name) && (item.linkHref || item.url))
        .map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          name: item.linkTitle || item.name || 'Untitled',
          url: item.linkHref || item.url || '#',
          isExternal: Boolean(item.isExternal || (item.linkHref || item.url)?.startsWith('http')),
          order: item.order || index
        }))
        .sort((a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0))
    }
    return []
  })()

  const handleNavigationClick = (item: NavigationItem) => {
    if (item.isExternal) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
    // For internal links, Next.js Link will handle the navigation
  }

  return (
    <nav 
      className="shadow-sm border-b"
      style={{ 
        backgroundColor: (community as any)?.topbar?.background_color || '#ffffff',
        color: (community as any)?.topbar?.text_color || '#000000'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            {config?.logo && (
              <img 
                src={config.logo} 
                alt={websiteName} 
                className="h-8 w-auto"
              />
            )}
            
            {/* Website Name */}
            <span 
              className="text-xl font-bold"
              style={{ color: (community as any)?.topbar?.text_color || config?.title_color || '#000' }}
            >
              {websiteName}
            </span>
          </div>

          {/* Dynamic Navigation Items */}
          {navigationItems.length > 0 && (
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => {
                // Additional safety check
                if (!item || !item.name || !item.url) {
                  return null
                }
                
                return (
                  <div key={item.id}>
                    {item.isExternal ? (
                      <button
                        onClick={() => handleNavigationClick(item)}
                        className="px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                        style={{ 
                          color: (community as any)?.topbar?.link_color || '#374151',
                          '--hover-color': (community as any)?.topbar?.hover_color || '#111827'
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = (community as any)?.topbar?.hover_color || '#111827'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = (community as any)?.topbar?.link_color || '#374151'
                        }}
                      >
                        {item.name}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    ) : (
                      <Link
                        href={item.url || '#'}
                        className="px-3 py-2 text-sm font-medium transition-colors"
                        style={{ 
                          color: (community as any)?.topbar?.link_color || '#374151',
                          '--hover-color': (community as any)?.topbar?.hover_color || '#111827'
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = (community as any)?.topbar?.hover_color || '#111827'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = (community as any)?.topbar?.link_color || '#374151'
                        }}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Button variant="outline">Admin Dashboard</Button>
                </Link>
                <Link href="/landing">
                  <Button variant="ghost">View Site</Button>
                </Link>
                {/* Always show Create Marketplace button for super admin communities */}
                {isSuperAdmin && (
                  <Link href="/register">
                    <Button>Create Marketplace</Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Show Sign In and Create Marketplace buttons for super admin domains */}
                {isSuperAdmin ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/login">
                      <Button variant="ghost">Sign In</Button>
                    </Link>
                    <Link href="/register">
                      <Button>Create Marketplace</Button>
                    </Link>
                  </div>
                ) : (
                  /* Show login button for community domains when user is not authenticated */
                  <div className="flex items-center space-x-4">
                    <Link href="/login">
                      <Button 
                        variant="outline"
                        style={{ 
                          color: (community as any)?.topbar?.link_color || '#374151',
                          borderColor: (community as any)?.topbar?.link_color || '#374151'
                        }}
                      >
                        Admin Login
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
