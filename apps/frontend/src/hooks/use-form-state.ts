'use client'

import { useState, useCallback } from 'react'
import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'

interface UseFormStateOptions<T extends FieldValues> {
  schema?: z.ZodSchema<T>
  defaultValues?: Partial<T>
  onSubmit?: (data: T) => Promise<void> | void
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseFormStateReturn<T extends FieldValues> extends UseFormReturn<T> {
  isSubmitting: boolean
  isDirty: boolean
  isValid: boolean
  errors: Record<string, string>
  handleSubmit: (data: T) => Promise<void>
  resetForm: () => void
  setFieldValue: (name: Path<T>, value: any) => void
  setFieldError: (name: Path<T>, message: string) => void
  clearFieldError: (name: Path<T>) => void
}

export const useFormState = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onSuccess,
  onError,
}: UseFormStateOptions<T> = {}): UseFormStateReturn<T> => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaultValues as T,
    mode: 'onChange',
  })

  const {
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { isDirty, isValid, errors },
  } = form

  const handleSubmit = useCallback(
    async (data: T) => {
      if (!onSubmit) return

      setIsSubmitting(true)
      try {
        await onSubmit(data)
        onSuccess?.(data)
        toast({
          title: 'Success',
          description: 'Form submitted successfully.',
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        onError?.(error as Error)
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, onSuccess, onError, toast]
  )

  const resetForm = useCallback(() => {
    reset(defaultValues as T)
  }, [reset, defaultValues])

  const setFieldValue = useCallback(
    (name: Path<T>, value: any) => {
      setValue(name, value, { shouldValidate: true, shouldDirty: true })
    },
    [setValue]
  )

  const setFieldError = useCallback(
    (name: Path<T>, message: string) => {
      setError(name, { type: 'manual', message })
    },
    [setError]
  )

  const clearFieldError = useCallback(
    (name: Path<T>) => {
      clearErrors(name)
    },
    [clearErrors]
  )

  // Convert errors to a simple string map
  const errorMap = Object.keys(errors).reduce((acc, key) => {
    const error = errors[key as keyof typeof errors]
    if (error?.message) {
      acc[key] = error.message
    }
    return acc
  }, {} as Record<string, string>)

  return {
    ...form,
    isSubmitting,
    isDirty,
    isValid,
    errors: errorMap,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    clearFieldError,
  }
}
