import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { QueryProvider } from '@/providers/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { DomainRedirect } from '@/components/domain-redirect'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MySaaSProject',
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


