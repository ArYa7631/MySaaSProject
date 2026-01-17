import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { QueryProvider } from '@/providers/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { DomainRedirect } from '@/components/domain-redirect'

const inter = Inter({ subsets: ['latin'] })

const API_BASE_URL = process.env.API_INTERNAL_URL || 'http://backend:3001/api/v1'

interface CommunityResponse {
  status: string
  data: {
    id: number
    uuid: string
    ident: string
    domain: string
    display_name: string
    landing_page?: {
      title?: string
      description?: string
      content?: any[]
      logo?: string
    }
    marketplace_configuration?: {
      logo?: string
      notification?: string
      title?: string
    }
  }
}

async function getCommunityByDomain(domain: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/communities/by-domain?domain=${domain}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null

    const result: CommunityResponse = await res.json()
    return result.data
  } catch (error) {
    console.error('Error fetching community:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host')
  const domain = host?.split(':')[0] || 'localhost'

  const community = await getCommunityByDomain(domain)

  if (!community) {
    return {
      title: 'MySaaSProject',
      description: 'A modern SaaS application built with Rails and Next.js',
    }
  }

  const title = community.display_name || community.landing_page?.title || community.ident
  const description =
    community.landing_page?.description ||
    community.marketplace_configuration?.notification ||
    'Welcome to our community'

  // Prefer the landing page logo, fallback to marketplace configuration logo
  const logo =
    community.landing_page?.logo ||
    community.marketplace_configuration?.logo ||
    undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: logo ? [{ url: logo }] : [],
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <DomainRedirect>
              {children}
            </DomainRedirect>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}