'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { ArrowRight, Image as ImageIcon, X } from 'lucide-react'
import { ImageUploadResponse } from '@/services/image.service'
import { MarketplaceConfiguration } from '@mysaasproject/shared'

interface HeroSectionProps {
  id: string
  title: string
  subtitle?: string
  description: string
  primaryButton: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
  backgroundImage?: string
  videoUrl?: string
  showVideo?: boolean
  isEditing?: boolean
  onUpdate?: (updates: { backgroundImage?: string }) => void
  marketplaceConfig?: MarketplaceConfiguration | null
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  backgroundImage,
  videoUrl,
  showVideo = false,
  isEditing = false,
  onUpdate,
  marketplaceConfig,
}) => {
  const router = useRouter()
  const [showImageUpload, setShowImageUpload] = useState(false)

  const handleNavigation = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }

  const handleImageUpload = (response: ImageUploadResponse) => {
    onUpdate?.({ backgroundImage: response.url })
    setShowImageUpload(false)
  }

  const removeBackgroundImage = () => {
    onUpdate?.({ backgroundImage: undefined })
  }

  // Get colors from marketplace config with fallbacks
  const backgroundColor = marketplaceConfig?.global_bg_color || '#ffffff'
  const textColor = marketplaceConfig?.global_text_color || '#000000'
  const highlightColor = marketplaceConfig?.global_highlight_color || '#3b82f6'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {isEditing && (
            <div className="absolute top-4 right-4 flex space-x-2 z-20">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowImageUpload(true)}
                className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Change
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={removeBackgroundImage}
                className="bg-red-500/90 hover:bg-red-600 shadow-lg backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && isEditing && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Background Image</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageUpload(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ImageUpload
              onUploadSuccess={handleImageUpload}
              folder="hero"
              maxFiles={1}
            />
          </div>
        </div>
      )}

      {/* Add Background Image Button (when no background) */}
      {!backgroundImage && isEditing && (
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="secondary"
            onClick={() => setShowImageUpload(true)}
            className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Background
          </Button>
        </div>
      )}

      {/* Default Background (when no image) */}
      {!backgroundImage && (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: backgroundColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}

      {/* Video Background */}
      {showVideo && videoUrl && (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {subtitle && (
          <p 
            className="text-lg font-medium mb-4 animate-fade-in drop-shadow-lg"
            style={{ color: textColor }}
          >
            {subtitle}
          </p>
        )}
        
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up drop-shadow-2xl"
          style={{ color: textColor }}
        >
          {title}
        </h1>
        
        <p 
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200 drop-shadow-lg"
          style={{ color: textColor, opacity: 0.9 }}
        >
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
          <Button
            size="lg"
            onClick={() => handleNavigation(primaryButton.url)}
            className="group text-lg px-8 py-4 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            style={{ backgroundColor: highlightColor }}
          >
            {primaryButton.text}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          {secondaryButton && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNavigation(secondaryButton.url)}
              className="group text-lg px-8 py-4 border-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              style={{ 
                borderColor: textColor,
                color: textColor,
                backgroundColor: 'transparent'
              }}
            >
              {secondaryButton.text}
            </Button>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div 
            className="w-6 h-10 border-2 rounded-full flex justify-center"
            style={{ borderColor: textColor }}
          >
            <div 
              className="w-1 h-3 rounded-full mt-2 animate-pulse"
              style={{ backgroundColor: textColor }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
