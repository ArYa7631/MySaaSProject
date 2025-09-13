'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { MarketplaceConfiguration } from '@mysaasproject/shared'
import Link from 'next/link'

interface NavbarProps {
  config?: MarketplaceConfiguration | null
}

export const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const { user } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {config?.logo ? (
              <img 
                src={config.logo} 
                alt={config.title || 'Logo'} 
                className="h-8 w-auto"
              />
            ) : (
              <span 
                className="text-xl font-bold"
                style={{ color: config?.title_color || '#000' }}
              >
                {config?.title || 'My Community'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Button variant="outline">Admin Dashboard</Button>
                </Link>
                <Link href="/landing">
                  <Button variant="ghost">View Site</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
