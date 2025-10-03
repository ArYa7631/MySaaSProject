'use client'

import { useAuth } from '@/contexts/auth-context'
import { useCommunityContext } from '@/hooks/use-community-context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Users, 
  BarChart3,
  Image,
  Navigation,
  MessageSquare,
  Globe
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
  const { community: communityContext } = useCommunityContext()
  
  // Get logo and community name
  const logo = (communityContext as any)?.marketplace_configuration?.logo
  const communityName = communityContext?.ident || community?.ident || 'Admin'

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo/Brand - Left Aligned */}
        <Link href="/" className="flex items-center space-x-3 px-6 py-3 border-b hover:bg-gray-50 transition-colors">
          {logo ? (
            <img 
              src={logo} 
              alt={communityName}
              className="h-10 w-10 rounded object-cover flex-shrink-0"
            />
          ) : (
            <Globe className="h-10 w-10 text-primary flex-shrink-0" />
          )}
          <span className="text-lg font-bold text-gray-900 truncate">
            {communityName}
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
