'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseLocalStorageOptions {
  serializer?: {
    stringify: (value: any) => string
    parse: (value: string) => any
  }
  onError?: (error: Error) => void
}

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
) => {
  const { serializer = JSON, onError } = options

  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? serializer.parse(item) : initialValue
    } catch (error) {
      onError?.(error as Error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        
        // Save state
        setStoredValue(valueToStore)
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer.stringify(valueToStore))
        }
      } catch (error) {
        onError?.(error as Error)
      }
    },
    [key, serializer, storedValue, onError]
  )

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      onError?.(error as Error)
    }
  }, [key, initialValue, onError])

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(serializer.parse(e.newValue))
        } catch (error) {
          onError?.(error as Error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, serializer, onError])

  return [storedValue, setValue, removeValue] as const
}

// Specialized hooks for common data types
export const useLocalStorageString = (key: string, initialValue: string = '') => {
  return useLocalStorage(key, initialValue, {
    serializer: {
      stringify: (value: string) => value,
      parse: (value: string) => value,
    },
  })
}

export const useLocalStorageNumber = (key: string, initialValue: number = 0) => {
  return useLocalStorage(key, initialValue, {
    serializer: {
      stringify: (value: number) => value.toString(),
      parse: (value: string) => Number(value),
    },
  })
}

export const useLocalStorageBoolean = (key: string, initialValue: boolean = false) => {
  return useLocalStorage(key, initialValue, {
    serializer: {
      stringify: (value: boolean) => value.toString(),
      parse: (value: string) => value === 'true',
    },
  })
}

export const useLocalStorageArray = <T>(key: string, initialValue: T[] = []) => {
  return useLocalStorage<T[]>(key, initialValue)
}

export const useLocalStorageObject = <T extends Record<string, any>>(
  key: string,
  initialValue: T
) => {
  return useLocalStorage<T>(key, initialValue)
}
