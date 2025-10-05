'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSuperAdmin } from '@/hooks/use-super-admin'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  password_confirmation: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  domain: z.string().min(1, 'Domain is required').regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/, 'Invalid domain format (e.g., sanskritikanchal.com)'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [error, setError] = useState('')
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const { isSuperAdmin, isLoading: superAdminLoading, error: superAdminError } = useSuperAdmin()

  // Redirect non-super-admin users
  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      // Redirect to home page or show access denied
      router.push('/')
    }
  }, [isSuperAdmin, superAdminLoading, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('')
      const result = await registerUser(data)
      
      // Check if we need to redirect to a different domain
      if (result.redirect_url && result.redirect_url !== window.location.origin) {
        // Redirect to the new community's domain
        window.location.href = `${result.redirect_url}/admin`
      } else {
        // Stay on the same domain
        router.push('/admin')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
  }

  // Show loading spinner while checking super admin status
  if (superAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-gray-600">Loading community data...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we verify your access permissions</p>
        </div>
      </div>
    )
  }

  // Show access denied if not super admin
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              This page is only accessible from the main platform domain.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button variant="outline">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="first_name" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="first_name"
                type="text"
                placeholder="Enter your first name"
                {...register('first_name')}
              />
              {errors.first_name && (
                <p className="text-sm text-red-600">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="last_name"
                type="text"
                placeholder="Enter your last name"
                {...register('last_name')}
              />
              {errors.last_name && (
                <p className="text-sm text-red-600">{errors.last_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Domain URL */}
            <div className="space-y-2">
              <label htmlFor="domain" className="text-sm font-medium">
                Domain URL
              </label>
              <Input
                id="domain"
                type="text"
                placeholder="sanskritikanchal.com"
                {...register('domain')}
              />
              {errors.domain && (
                <p className="text-sm text-red-600">{errors.domain.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Enter your full domain name (e.g., sanskritikanchal.com, mycompany.in)
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="password_confirmation" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm your password"
                {...register('password_confirmation')}
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}