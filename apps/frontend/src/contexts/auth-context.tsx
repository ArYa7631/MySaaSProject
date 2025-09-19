'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginCredentials, RegisterCredentials, Community } from '@mysaasproject/shared'
import { createApiClient } from '@mysaasproject/shared'

interface AuthContextType {
  user: User | null
  community: Community | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const apiClient = createApiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1`)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [community, setCommunity] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const userData = localStorage.getItem('user')
      const communityData = localStorage.getItem('community')
      const token = localStorage.getItem('authToken')
      
      if (userData && token) {
        const user = JSON.parse(userData)
        setUser(user)
        
        // Fetch community data if user has community_id
        if (user.community_id && !communityData) {
          try {
            const communityResponse = await apiClient.get<{ data: Community }>(
              `/communities/${user.community_id}`
            )
            const community = communityResponse.data
            setCommunity(community)
            localStorage.setItem('community', JSON.stringify(community))
          } catch (error) {
            console.error('Failed to fetch community:', error)
          }
        } else if (communityData) {
          setCommunity(JSON.parse(communityData))
        }
      } else if (userData && !token) {
        // User data exists but no token - clear everything
        localStorage.removeItem('user')
        localStorage.removeItem('community')
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('user')
      localStorage.removeItem('community')
      localStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<{ data: { user: User; token: string } }>(
        '/auth/sign_in',
        { user: credentials }
      )
      
      const { user, token } = response.data
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('authToken', token)
      setUser(user)
      
      // Fetch community data if user has community_id
      if (user.community_id) {
        try {
          const communityResponse = await apiClient.get<{ data: Community }>(
            `/communities/${user.community_id}`
          )
          const community = communityResponse.data
          setCommunity(community)
          localStorage.setItem('community', JSON.stringify(community))
        } catch (error) {
          console.error('Failed to fetch community after login:', error)
        }
      }
    } catch (error: any) {
      if (error.response?.data?.status?.message) {
        throw new Error(error.response.data.status.message)
      }
      throw new Error('Login failed')
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await apiClient.post<{ data: { user: User; token: string } }>(
        '/auth/sign_up',
        { user: credentials }
      )
      
      const { user, token } = response.data
      
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('authToken', token)
      setUser(user)
      // Note: Community will be created separately or fetched later
    } catch (error: any) {
      if (error.response?.data?.status?.message) {
        throw new Error(error.response.data.status.message)
      }
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessage = Object.values(errors).flat().join(', ')
        throw new Error(errorMessage)
      }
      throw new Error('Registration failed')
    }
  }

  const logout = async () => {
    try {
      await apiClient.delete('/auth/sign_out')
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      localStorage.removeItem('user')
      localStorage.removeItem('community')
      localStorage.removeItem('authToken')
      setUser(null)
      setCommunity(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    community,
    loading,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


