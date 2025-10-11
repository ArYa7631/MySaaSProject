import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { QueryProvider } from '@/providers/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { DomainRedirect } from '@/components/domain-redirect'
import { DynamicTitle } from '@/components/dynamic-title'
import { GlobalWhatsAppButton } from '@/components/ui/global-whatsapp-button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  description: 'A modern SaaS application built with Rails and Next.js',
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
            <DynamicTitle />
            <DomainRedirect>
              {children}
            </DomainRedirect>
            <GlobalWhatsAppButton />
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}


