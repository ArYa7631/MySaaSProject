'use client'

import { useAuth } from '@/contexts/auth-context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Users, 
  Globe,
  Palette,
  BarChart3,
  Image,
  Navigation,
  MessageSquare
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Landing Page',
    href: '/admin/landing-page',
    icon: FileText,
  },
  {
    name: 'Navigation',
    href: '/admin/navigation',
    icon: Navigation,
  },
  {
    name: 'Content Pages',
    href: '/admin/content-pages',
    icon: FileText,
  },
  {
    name: 'Contact Inquiries',
    href: '/admin/contacts',
    icon: MessageSquare,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    name: 'Community',
    href: '/admin/community',
    icon: Users,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Images',
    href: '/admin/images',
    icon: Image,
  },
]

export const AdminSidebar = () => {
  const pathname = usePathname()
  const { community } = useAuth()

  const websiteName = community?.ident || community?.domain || 'My Community'
  const marketplaceConfig = community?.marketplace_configuration

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
          <Link href={'/'} className="flex items-center space-x-3 mt-4 ml-4">
            {marketplaceConfig?.logo && (
              <img 
                src={marketplaceConfig.logo} 
                alt={websiteName} 
                className="h-8 w-auto"
              />
            )}
            
            <span 
              className="text-xl font-bold truncate"
              style={{ color: (community as any)?.topbar?.text_color || marketplaceConfig?.title_color || '#000' }}
            >
              {websiteName}
            </span>
          </Link>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 text-center">
            {community?.domain || 'No domain set'}
          </div>
        </div>
      </div>
    </div>
  )
}
