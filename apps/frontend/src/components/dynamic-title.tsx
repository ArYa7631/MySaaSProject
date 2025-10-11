'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

export function DynamicTitle() {
  const { community, loading } = useAuth()

  useEffect(() => {
    // Wait for community data to load
    if (loading) {
      return
    }

    // If we have community data, use the community's domain
    if (community?.domain) {
      document.title = community.domain
    } else {
      // Fallback to hostname for non-authenticated users or when no community
      const hostname = window.location.hostname
      const title = hostname === 'localhost' 
        ? 'MySaaSProject'
        : hostname.replace(/^www\./, '')
      
      document.title = title
    }
  }, [community, loading])

  return null
}

