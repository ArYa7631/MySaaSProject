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
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative py-16 px-4 mx-auto max-w-screen-xl text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white leading-tight">
            {title}
          </h1>
          <p className="mb-10 text-lg font-normal text-gray-600 lg:text-xl dark:text-gray-300 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => handleNavigation(primaryButton.url)}
              className="group inline-flex justify-center items-center py-4 px-8 text-base font-medium text-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {primaryButton.text}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            {secondaryButton && (
              <Button
                variant="outline"
                onClick={() => handleNavigation(secondaryButton.url)}
                className="group inline-flex justify-center items-center py-4 px-8 text-base font-medium text-center text-gray-700 dark:text-gray-300 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
              >
                {secondaryButton.text}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
