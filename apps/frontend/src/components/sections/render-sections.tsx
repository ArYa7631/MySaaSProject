import React from 'react'
import { LandingPageSection, MarketplaceConfiguration } from '@mysaasproject/shared'
import { Jumbotron } from './jumbotron'
import { Gallery } from './gallery'
import { InfoColumns } from './info-columns'
import { ContactForm } from './contact-form'
import { HeroSection } from './hero-section'
import { Testimonials } from './testimonials'
import { Features } from './features'
import { Pricing } from './pricing'
import { ImgDescription } from './img-description'
import { VideoSection } from './video-section'
import { StatsSection } from './stats-section'
import { TeamSection } from './team-section'
import { FAQSection } from './faq-section'
import { NewsletterSection } from './newsletter-section'
import { SocialProof } from './social-proof'

interface RenderSectionsProps {
  sections: LandingPageSection[]
  marketplaceConfig?: MarketplaceConfiguration | null
}

export const RenderSections: React.FC<RenderSectionsProps> = ({ sections, marketplaceConfig }) => {
  // Debug: Log sections to identify duplicates
  console.log('RenderSections - sections:', sections)
  
  const renderSection = (section: LandingPageSection) => {
    // Ensure section has required properties
    if (!section || !section.id || !section.type) {
      console.warn('Invalid section structure:', section)
      return null
    }
    
    // Debug: Log each section being rendered
    console.log('Rendering section:', section.id, section.type)

    // Use the 'type' field from the backend data structure
    const sectionType = section.type
    
    // Ensure content exists and is an object
    if (!section.content || typeof section.content !== 'object') {
      console.warn(`Section ${section.id} has invalid content:`, section.content)
      return null
    }
    
    switch (sectionType) {
      case 'Jumbotron':
        return <Jumbotron key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'HeroSection':
        return <HeroSection key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'Gallery':
        // Handle both 'images' and 'imageUrl' fields for backward compatibility
        const images = section.content?.images || section.content?.imageUrl || []
        const galleryProps = {
          ...section.content,
          images: Array.isArray(images) 
            ? images.map((img: any) => ({
                url: img?.url || '',
                alt: img?.alt || img?.title || img?.description || ''
              }))
            : []
        }
        return <Gallery key={section.id} {...galleryProps} marketplaceConfig={marketplaceConfig} />
      case 'InfoColumns':
        return <InfoColumns key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'ContactForm':
        return <ContactForm key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'Testimonials':
        // Map columns to testimonials for Testimonials component
        const testimonialsProps = {
          ...section.content,
          testimonials: section.content?.columns?.map((col: any, index: number) => ({
            id: `testimonial-${index}`,
            name: col.title || 'Anonymous',
            role: 'Client',
            company: '',
            content: col.description || col.content || '',
            rating: 5,
            avatar: col.avatar
          })) || []
        }
        return <Testimonials key={section.id} {...testimonialsProps} marketplaceConfig={marketplaceConfig} />
      case 'Features':
        return <Features key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'Pricing':
        return <Pricing key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'ImgDescription':
        return <ImgDescription key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'VideoSection':
        return <VideoSection key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'StatsSection':
        return <StatsSection key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'TeamSection':
        return <TeamSection key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'FAQSection':
        return <FAQSection key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'NewsletterSection':
        return <NewsletterSection key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      case 'SocialProof':
        return <SocialProof key={section.id} {...section.content} marketplaceConfig={marketplaceConfig} />
      default:
        console.warn(`Unknown section type: ${sectionType}`, section)
        return (
          <div key={section.id} className="py-8 bg-red-50 border border-red-200 rounded-lg mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unknown Section Type
              </h3>
              <p className="text-red-600">
                Section type "{sectionType}" is not supported yet.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Available types: Jumbotron, HeroSection, Gallery, InfoColumns, ContactForm, Testimonials, Features, Pricing, ImgDescription, VideoSection, StatsSection, TeamSection, FAQSection, NewsletterSection, SocialProof
              </p>
            </div>
          </div>
        )
    }
  }

  // Ensure sections is an array
  if (!Array.isArray(sections)) {
    console.warn('Sections is not an array:', sections)
    return null
  }

  // Filter out any null/undefined sections and render
  const validSections = sections.filter(Boolean)
  
  if (validSections.length === 0) {
    console.warn('No valid sections to render')
    return null
  }

  return <>{validSections.map((section, index) => (
    <React.Fragment key={`${section.id}-${index}`}>
      {renderSection(section)}
    </React.Fragment>
  ))}</>
}
