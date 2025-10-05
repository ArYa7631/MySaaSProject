'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useCommunityContext } from '@/hooks/use-community-context'
import { Button } from '@/components/ui/button'
import { MarketplaceConfiguration } from '@mysaasproject/shared'
import Link from 'next/link'
import { ExternalLink, User, Menu, X } from 'lucide-react'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav 
      className="shadow-sm border-b relative"
      style={{ 
        backgroundColor: (community as any)?.topbar?.background_color || '#ffffff',
        color: (community as any)?.topbar?.text_color || '#000000'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
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
              className="text-lg sm:text-xl font-bold truncate"
              style={{ color: (community as any)?.topbar?.text_color || config?.title_color || '#000' }}
            >
              {websiteName}
            </span>
          </div>

          {/* Desktop Navigation Items */}
          {navigationItems.length > 0 && (
            <div className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => {
                if (!item || !item.name || !item.url) return null
                
                return (
                  <div key={item.id}>
                    {item.isExternal ? (
                      <button
                        onClick={() => handleNavigationClick(item)}
                        className="px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                        style={{ 
                          color: (community as any)?.topbar?.link_color || '#374151',
                        }}
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
                        }}
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                    Admin Dashboard
                  </Button>
                </Link>
                {isSuperAdmin && (
                  <Link href="/register">
                    <Button size="sm" className="text-xs lg:text-sm">
                      Create Marketplace
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                {isSuperAdmin ? (
                  <div className="flex items-center space-x-2 lg:space-x-4">
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="text-xs lg:text-sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="text-xs lg:text-sm">
                        Create Marketplace
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 lg:space-x-4">
                    <Link href="/login">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs lg:text-sm"
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
              style={{ 
                color: (community as any)?.topbar?.text_color || '#000000'
              }}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: (community as any)?.topbar?.text_color + '20' || '#00000020' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Items */}
              {navigationItems.length > 0 && (
                <>
                  {navigationItems.map((item) => {
                    if (!item || !item.name || !item.url) return null
                    
                    return (
                      <div key={item.id}>
                        {item.isExternal ? (
                          <button
                            onClick={() => handleNavigationClick(item)}
                            className="w-full text-left px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                            style={{ 
                              color: (community as any)?.topbar?.link_color || '#374151',
                            }}
                          >
                            {item.name}
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        ) : (
                          <Link
                            href={item.url || '#'}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-sm font-medium transition-colors"
                            style={{ 
                              color: (community as any)?.topbar?.link_color || '#374151',
                            }}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    )
                  })}
                  <div className="border-t my-2" style={{ borderColor: (community as any)?.topbar?.text_color + '20' || '#00000020' }} />
                </>
              )}

              {/* Mobile Auth Buttons */}
              <div className="space-y-2">
                {user ? (
                  <>
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        Admin Dashboard
                      </Button>
                    </Link>
                    {isSuperAdmin && (
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full justify-start" size="sm">
                          Create Marketplace
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    {isSuperAdmin ? (
                      <>
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start" size="sm">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full justify-start" size="sm">
                            Create Marketplace
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button 
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                          style={{ 
                            color: (community as any)?.topbar?.link_color || '#374151',
                            borderColor: (community as any)?.topbar?.link_color || '#374151'
                          }}
                        >
                          Admin Login
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
