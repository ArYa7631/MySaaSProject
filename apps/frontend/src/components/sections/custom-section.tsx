'use client'

import React, { useEffect, useState } from 'react'
import { MarketplaceConfiguration } from '@mysaasproject/shared'
import { sanitizeHTML } from '@/utils/sanitize'

interface CustomSectionProps {
  title?: string
  content: string
  backgroundColor?: string
  textColor?: string
  padding?: string
  className?: string
  marketplaceConfig?: MarketplaceConfiguration | null
}

export const CustomSection: React.FC<CustomSectionProps> = ({
  title,
  content,
  backgroundColor,
  textColor,
  padding = 'py-16',
  className = '',
  marketplaceConfig,
}) => {
  const [sanitizedContent, setSanitizedContent] = useState('')

  useEffect(() => {
    // Sanitize HTML content to prevent XSS attacks
    const clean = sanitizeHTML(content)
    setSanitizedContent(clean)
  }, [content])

  // Get colors from marketplace config with fallbacks
  const sectionBackgroundColor = backgroundColor || marketplaceConfig?.global_bg_color || '#ffffff'
  const sectionTextColor = textColor || marketplaceConfig?.global_text_color || '#000000'

  return (
    <section 
      className={`${padding} ${className}`}
      style={{ 
        backgroundColor: sectionBackgroundColor,
        color: sectionTextColor
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-8">
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: sectionTextColor }}
            >
              {title}
            </h2>
          </div>
        )}
        
        <div 
          className="prose prose-lg max-w-none"
          style={{ color: sectionTextColor }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </section>
  )
}
