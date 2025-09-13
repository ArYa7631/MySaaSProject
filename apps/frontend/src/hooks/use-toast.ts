'use client'

import { useToast as useToastOriginal } from '@/components/ui/use-toast'

export const useToast = () => {
  const { toast } = useToastOriginal()

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    })
  }

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'destructive',
    })
  }

  const showWarning = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
      className: 'border-yellow-500 bg-yellow-50 text-yellow-900',
    })
  }

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
      className: 'border-blue-500 bg-blue-50 text-blue-900',
    })
  }

  return {
    toast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
