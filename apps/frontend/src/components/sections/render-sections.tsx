import { LandingPageSection } from '@mysaasproject/shared'
import { Jumbotron } from './jumbotron'
import { Gallery } from './gallery'
import { InfoColumns } from './info-columns'
import { ContactForm } from './contact-form'
import { HeroSection } from './hero-section'
import { Testimonials } from './testimonials'
import { Features } from './features'
import { Pricing } from './pricing'
import { ImgDescription } from './img-description'

interface RenderSectionsProps {
  sections: LandingPageSection[]
}

export const RenderSections: React.FC<RenderSectionsProps> = ({ sections }) => {
  const renderSection = (section: LandingPageSection) => {
    // Use the 'type' field from the backend data structure
    const sectionType = section.type
    
    // Ensure content exists
    if (!section.content) {
      console.warn(`Section ${section.id} has no content`, section)
      return null
    }
    
    switch (sectionType) {
      case 'Jumbotron':
        return <Jumbotron key={section.id} {...section.content} />
      case 'HeroSection':
        return <HeroSection key={section.id} {...section.content} />
      case 'Gallery':
        // Map imageUrl to images for Gallery component
        const galleryProps = {
          ...section.content,
          images: section.content.imageUrl?.map((img: any) => ({
            url: img.url,
            alt: img.title || img.description
          })) || []
        }
        return <Gallery key={section.id} {...galleryProps} />
      case 'InfoColumns':
        return <InfoColumns key={section.id} {...section.content} />
      case 'ContactForm':
        return <ContactForm key={section.id} {...section.content} />
      case 'Testimonials':
        return <Testimonials key={section.id} {...section.content} />
      case 'Features':
        return <Features key={section.id} {...section.content} />
      case 'Pricing':
        return <Pricing key={section.id} {...section.content} />
      case 'ImgDescription':
        return <ImgDescription key={section.id} {...section.content} />
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
                Available types: Jumbotron, HeroSection, Gallery, InfoColumns, ContactForm, Testimonials, Features, Pricing, ImgDescription
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

  return <>{sections.map(renderSection)}</>
}
