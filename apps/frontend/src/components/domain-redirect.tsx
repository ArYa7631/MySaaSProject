'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface DomainRedirectProps {
  children: React.ReactNode
}

export function DomainRedirect({ children }: DomainRedirectProps) {
  const { user, community, loading } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Only check domain redirection if user is logged in and has a community
    if (!loading && user && community && !isRedirecting) {
      const currentDomain = window.location.hostname
      const expectedDomain = community.domain

      // If we're on localhost but the community domain is not localhost, redirect
      if (currentDomain === 'localhost' && expectedDomain !== 'localhost') {
        const protocol = window.location.protocol
        const port = window.location.port
        const redirectUrl = `${protocol}//${expectedDomain}${port ? `:${port}` : ''}${window.location.pathname}`
        
        setIsRedirecting(true)
        window.location.href = redirectUrl
        return
      }

      // If we're on a different domain than expected, redirect
      if (currentDomain !== expectedDomain && expectedDomain !== 'localhost') {
        const protocol = window.location.protocol
        const port = window.location.port
        const redirectUrl = `${protocol}//${expectedDomain}${port ? `:${port}` : ''}${window.location.pathname}`
        
        setIsRedirecting(true)
        window.location.href = redirectUrl
        return
      }
    }
  }, [user, community, loading, isRedirecting])

  // Show loading spinner while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-gray-600">Redirecting to your community...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
