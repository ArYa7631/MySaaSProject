'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { MarketplaceConfiguration } from '@mysaasproject/shared'

interface JumbotronProps {
  id: string
  title: string
  description: string
  primaryButton: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
  marketplaceConfig?: MarketplaceConfiguration | null
  // Hero section specific colors
  textColor?: string
  titleColor?: string
  subtitleColor?: string
  descriptionColor?: string
  overlayColor?: string
  overlayOpacity?: number
  backgroundImage?: string
}

export const Jumbotron: React.FC<JumbotronProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  marketplaceConfig,
  textColor,
  titleColor,
  subtitleColor,
  descriptionColor,
  overlayColor,
  overlayOpacity,
  backgroundImage,
}) => {
  const router = useRouter()

  const handleNavigation = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }

  // Get colors from hero section props with marketplace config fallbacks
  const backgroundColor = marketplaceConfig?.global_bg_color || '#00FF00'
  const heroTextColor = textColor || marketplaceConfig?.global_text_color || '#1f2937'
  const heroTitleColor = titleColor || textColor || marketplaceConfig?.global_text_color || '#1f2937'
  const heroDescriptionColor = descriptionColor || textColor || marketplaceConfig?.global_text_color || '#4b5563'
  const highlightColor = marketplaceConfig?.global_highlight_color || '#3b82f6'

  return (
    <section 
      className="relative overflow-hidden"
      style={{ 
        backgroundColor: backgroundColor,
        color: heroTextColor
      }}
    >
      {/* Background Image or Pattern */}
      {backgroundImage ? (
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {overlayColor && (
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundColor: overlayColor,
                opacity: overlayOpacity || 0.85
              }}
            />
          )}
        </div>
      ) : (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}
      
      <div className="relative py-16 px-4 mx-auto max-w-screen-xl text-center">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="mb-6 text-4xl font-extrabold md:text-5xl lg:text-6xl leading-tight"
            style={{ color: heroTitleColor }}
          >
            {title}
          </h1>
          <p 
            className="mb-10 text-lg font-normal lg:text-xl leading-relaxed"
            style={{ color: heroDescriptionColor, opacity: 0.8 }}
          >
            {description}
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => handleNavigation(primaryButton.url)}
              className="group inline-flex justify-center items-center py-4 px-8 text-base font-medium text-center rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ 
                backgroundColor: highlightColor,
                borderColor: highlightColor
              }}
            >
              {primaryButton.text}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            {secondaryButton && (
              <Button
                variant="outline"
                onClick={() => handleNavigation(secondaryButton.url)}
                className="group inline-flex justify-center items-center py-4 px-8 text-base font-medium text-center rounded-full border-2 transition-all duration-300 transform hover:scale-105"
                style={{ 
                  color: heroTextColor,
                  borderColor: highlightColor,
                  backgroundColor: 'transparent'
                }}
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
