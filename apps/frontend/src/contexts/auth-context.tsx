'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginCredentials, RegisterCredentials } from '@mysaasproject/shared'
import { createApiClient } from '@mysaasproject/shared'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      // For now, just check if user exists in localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<{ data: { user: User } }>(
        '/api/auth/sign_in',
        { user: credentials }
      )
      
      const { user } = response.data
      // Store user data in localStorage instead of using tokens
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    } catch (error: any) {
      if (error.response?.data?.status?.message) {
        throw new Error(error.response.data.status.message)
      }
      throw new Error('Login failed')
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await apiClient.post<{ data: { user: User } }>(
        '/api/auth/sign_up',
        { user: credentials }
      )
      
      const { user } = response.data
      // Store user data in localStorage instead of using tokens
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
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
      await apiClient.delete('/api/auth/sign_out')
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      // Remove user data from localStorage
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
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


