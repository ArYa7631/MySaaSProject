'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Check } from 'lucide-react'

interface NewsletterSectionProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = 'Stay Updated',
  description = 'Subscribe to our newsletter for the latest updates and insights.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe'
}) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      setEmail('')
    }, 1000)
  }

  if (isSubscribed) {
    return (
      <div className="py-16 px-8 bg-green-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Check className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-xl opacity-90">
              You've successfully subscribed to our newsletter.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-8 bg-blue-600 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-xl opacity-90">{description}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 rounded-md text-gray-900 border-0 focus:ring-2 focus:ring-white"
            required
          />
          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
          >
            {isLoading ? 'Subscribing...' : buttonText}
          </Button>
        </form>
        
        <p className="text-sm opacity-75 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}
