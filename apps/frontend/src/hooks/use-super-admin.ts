'use client'

import { useAuth } from '@/contexts/auth-context'
import { useCommunityContext } from '@/hooks/use-community-context'
import { useState, useEffect } from 'react'

interface UseSuperAdminReturn {
  isSuperAdmin: boolean
  isLoading: boolean
  error: string | null
}

export function useSuperAdmin(): UseSuperAdminReturn {
  const { user, loading: authLoading } = useAuth()
  const { community, loading: communityLoading } = useCommunityContext()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      try {
        setError(null)

        // If we're still loading auth or community data, keep loading state
        if (authLoading || communityLoading) {
          setIsLoading(true)
          return
        }

        // Check if current domain is super admin
        const currentDomain = window.location.hostname
        
        console.log('Super Admin Check:', {
          currentDomain,
          community,
          marketplaceConfig: (community as any)?.marketplace_configuration,
          isSuperAdmin: (community as any)?.marketplace_configuration?.is_super_admin,
          authLoading,
          communityLoading
        })
        
        // Check if current domain is super admin
        let isSuperAdminDomain = false
        
        if (currentDomain === 'localhost') {
          // For localhost, check if:
          // 1. No community is loaded (main platform domain)
          // 2. Community has super admin configuration
          if (!community) {
            // No community loaded means we're on the main platform domain
            isSuperAdminDomain = true
            console.log('Localhost - no community loaded, treating as super admin')
          } else {
            // Check if community has super admin configuration
            isSuperAdminDomain = (community as any)?.marketplace_configuration?.is_super_admin || false
            console.log('Localhost - community loaded, checking super admin flag:', isSuperAdminDomain)
          }
        } else {
          // For non-localhost domains, check if it's a super admin domain
          // This would typically be your main platform domain
          const superAdminDomain = process.env.NEXT_PUBLIC_SUPER_ADMIN_DOMAIN
          const isMainDomain = currentDomain === superAdminDomain
          isSuperAdminDomain = isMainDomain
          console.log('Super Admin Domain Check:', {
            currentDomain,
            superAdminDomain,
            envVariable: process.env.NEXT_PUBLIC_SUPER_ADMIN_DOMAIN,
            isMainDomain
          })
        }
        
        setIsSuperAdmin(isSuperAdminDomain)
        setIsLoading(false)
      } catch (err) {
        console.error('Error checking super admin status:', err)
        setError('Failed to check super admin status')
        setIsSuperAdmin(false)
        setIsLoading(false)
      }
    }

    checkSuperAdminStatus()
  }, [user, community, authLoading, communityLoading])

  return {
    isSuperAdmin,
    isLoading,
    error
  }
}
