'use client'

import { MarketplaceConfiguration } from '@mysaasproject/shared'
import Link from 'next/link'

interface FooterProps {
  config?: MarketplaceConfiguration | null
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="bg-gray-900 text-white">
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
                  style={{ color: config?.title_color || '#fff' }}
                >
                  {config?.title || 'My Community'}
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-4">
              Build and manage your community with powerful tools and beautiful landing pages.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/landing" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                  Admin
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {config?.title || 'My Community'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
