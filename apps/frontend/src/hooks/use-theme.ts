'use client'

import { useEffect, useState } from 'react'
import { useLocalStorage } from './use-local-storage'

type Theme = 'light' | 'dark' | 'system'

interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  isDark: boolean
  isLight: boolean
  isSystem: boolean
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      let newTheme: 'light' | 'dark'

      if (theme === 'system') {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        newTheme = theme
      }

      setResolvedTheme(newTheme)

      // Update class on document element
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)

      // Update data attribute for CSS custom properties
      root.setAttribute('data-theme', newTheme)
    }

    updateTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  return {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  }
}

// Hook for getting system theme preference
export const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    updateSystemTheme()
    mediaQuery.addEventListener('change', updateSystemTheme)
    
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  return systemTheme
}

// Hook for checking if user prefers reduced motion
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const updateReducedMotion = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updateReducedMotion()
    mediaQuery.addEventListener('change', updateReducedMotion)
    
    return () => mediaQuery.removeEventListener('change', updateReducedMotion)
  }, [])

  return prefersReducedMotion
}
