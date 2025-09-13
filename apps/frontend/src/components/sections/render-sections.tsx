import { LandingPageSection } from '@mysaasproject/shared'
import { Jumbotron } from './jumbotron'
import { Gallery } from './gallery'
import { InfoColumns } from './info-columns'
import { ContactForm } from './contact-form'
import { HeroSection } from './hero-section'
import { Testimonials } from './testimonials'
import { Features } from './features'
import { Pricing } from './pricing'

interface RenderSectionsProps {
  sections: LandingPageSection[]
}

export const RenderSections: React.FC<RenderSectionsProps> = ({ sections }) => {
  const renderSection = (section: LandingPageSection) => {
    switch (section.name) {
      case 'Jumbotron':
        return <Jumbotron key={section.id} {...section} />
      case 'HeroSection':
        return <HeroSection key={section.id} {...section} />
      case 'Gallery':
        return <Gallery key={section.id} {...section} />
      case 'InfoColumns':
        return <InfoColumns key={section.id} {...section} />
      case 'ContactForm':
        return <ContactForm key={section.id} {...section} />
      case 'Testimonials':
        return <Testimonials key={section.id} {...section} />
      case 'Features':
        return <Features key={section.id} {...section} />
      case 'Pricing':
        return <Pricing key={section.id} {...section} />
      default:
        console.warn(`Unknown section type: ${section.name}`)
        return null
    }
  }

  return <>{sections.map(renderSection)}</>
}
