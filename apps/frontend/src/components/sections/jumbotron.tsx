'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface JumbotronProps {
  id: string
  title: string
  description: string
  primaryButton: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
}

export const Jumbotron: React.FC<JumbotronProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
}) => {
  const router = useRouter()

  const handleNavigation = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {title}
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
          {description}
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={() => handleNavigation(primaryButton.url)}
            className="inline-flex justify-center items-center py-7 px-5 text-base font-medium text-center rounded-lg focus:ring-4"
          >
            {primaryButton.text}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {secondaryButton && (
            <Button
              variant="outline"
              onClick={() => handleNavigation(secondaryButton.url)}
              className="inline-flex justify-center items-center py-7 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              {secondaryButton.text}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
