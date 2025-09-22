'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LandingPageSection } from '@mysaasproject/shared'
import { Monitor, Tablet, Smartphone, X, Eye } from 'lucide-react'

interface LandingPagePreviewProps {
  sections: LandingPageSection[]
  onClose: () => void
}

type DeviceType = 'desktop' | 'tablet' | 'mobile'

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
  sections,
  onClose
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')

  const getDeviceStyles = () => {
    switch (deviceType) {
      case 'mobile':
        return 'max-w-sm mx-auto'
      case 'tablet':
        return 'max-w-2xl mx-auto'
      case 'desktop':
      default:
        return 'w-full'
    }
  }

  const renderSection = (section: LandingPageSection) => {
    const { type, content } = section

    switch (type) {
      case 'HeroSection':
      case 'Jumbotron':
        return (
          <div 
            className="min-h-[400px] flex items-center justify-center text-center p-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white"
            style={{
              backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="max-w-4xl">
              {content.title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {content.title}
                </h1>
              )}
              {content.subtitle && (
                <h2 className="text-xl md:text-2xl mb-6 opacity-90">
                  {content.subtitle}
                </h2>
              )}
              {content.description && (
                <p className="text-lg mb-8 opacity-80">
                  {content.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {content.primaryButton && (
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    {content.primaryButton.text}
                  </Button>
                )}
                {content.secondaryButton && (
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    {content.secondaryButton.text}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )

      case 'InfoColumns':
        return (
          <div className="py-16 px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              {content.title && (
                <h2 className="text-3xl font-bold text-center mb-4">{content.title}</h2>
              )}
              {content.subtitle && (
                <p className="text-xl text-gray-600 text-center mb-12">{content.subtitle}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {content.columns?.map((column: any, index: number) => (
                  <div key={index} className="text-center">
                    {column.icon && (
                      <div className="text-4xl mb-4">{column.icon}</div>
                    )}
                    {column.title && (
                      <h3 className="text-xl font-semibold mb-2">{column.title}</h3>
                    )}
                    {column.description && (
                      <p className="text-gray-600">{column.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'Gallery':
        return (
          <div className="py-16 px-8">
            <div className="max-w-6xl mx-auto">
              {content.title && (
                <h2 className="text-3xl font-bold text-center mb-4">{content.title}</h2>
              )}
              {content.subtitle && (
                <p className="text-xl text-gray-600 text-center mb-12">{content.subtitle}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.imageUrl?.map((image: any, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.title || `Gallery image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                        {image.title && <h3 className="font-semibold mb-2">{image.title}</h3>}
                        {image.description && <p className="text-sm">{image.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'Testimonials':
        return (
          <div className="py-16 px-8 bg-blue-50">
            <div className="max-w-6xl mx-auto">
              {content.title && (
                <h2 className="text-3xl font-bold text-center mb-4">{content.title}</h2>
              )}
              {content.subtitle && (
                <p className="text-xl text-gray-600 text-center mb-12">{content.subtitle}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.columns?.map((testimonial: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    {testimonial.icon && (
                      <div className="text-2xl mb-4">{testimonial.icon}</div>
                    )}
                    {testimonial.description && (
                      <p className="text-gray-700 mb-4 italic">"{testimonial.description}"</p>
                    )}
                    {testimonial.title && (
                      <p className="font-semibold text-gray-900">{testimonial.title}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'StatsSection':
        return (
          <div className="py-16 px-8 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto">
              {content.title && (
                <h2 className="text-3xl font-bold text-center mb-4">{content.title}</h2>
              )}
              {content.description && (
                <p className="text-xl text-gray-300 text-center mb-12">{content.description}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {content.stats?.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    {stat.number && (
                      <div className="text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                    )}
                    {stat.label && (
                      <div className="text-xl font-semibold mb-2">{stat.label}</div>
                    )}
                    {stat.description && (
                      <div className="text-gray-300">{stat.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'ContactForm':
        return (
          <div className="py-16 px-8 bg-gray-50">
            <div className="max-w-2xl mx-auto">
              {content.title && (
                <h2 className="text-3xl font-bold text-center mb-4">{content.title}</h2>
              )}
              {content.description && (
                <p className="text-xl text-gray-600 text-center mb-12">{content.description}</p>
              )}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your message"
                    />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        )

      case 'ImgDescription':
        return (
          <div className="py-16 px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  {content.header && (
                    <h2 className="text-3xl font-bold mb-4">{content.header}</h2>
                  )}
                  {content.description && (
                    <p className="text-lg text-gray-600 mb-8">{content.description}</p>
                  )}
                  {content.buttonLabel && content.buttonURL && (
                    <Button size="lg">
                      {content.buttonLabel}
                    </Button>
                  )}
                </div>
                {content.imageURL && (
                  <div>
                    <img
                      src={content.imageURL}
                      alt={content.header || 'Section image'}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'NewsletterSection':
        return (
          <div className="py-16 px-8 bg-blue-600 text-white">
            <div className="max-w-2xl mx-auto text-center">
              {content.title && (
                <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
              )}
              {content.description && (
                <p className="text-xl mb-8 opacity-90">{content.description}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder={content.placeholder || 'Enter your email'}
                  className="flex-1 px-4 py-3 rounded-md text-gray-900"
                />
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  {content.buttonText || 'Subscribe'}
                </Button>
              </div>
            </div>
          </div>
        )

      case 'CustomSection':
        return (
          <div 
            className={`${content.padding || 'py-16'} px-8`}
            style={{
              backgroundColor: content.backgroundColor || '#ffffff',
              color: content.textColor || '#000000'
            }}
          >
            <div className="max-w-6xl mx-auto">
              {content.title && (
                <h2 
                  className="text-3xl font-bold text-center mb-8"
                  style={{ color: content.textColor || '#000000' }}
                >
                  {content.title}
                </h2>
              )}
              <div 
                className="prose prose-lg max-w-none"
                style={{ color: content.textColor || '#000000' }}
                dangerouslySetInnerHTML={{ __html: content.content || '<p>No content added yet.</p>' }}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="py-8 px-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">{section.name}</p>
              <p className="text-sm">Section type: {section.type}</p>
              <p className="text-xs mt-2">Preview not available for this section type</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Landing Page Preview
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Preview your landing page in different device sizes
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Device Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={deviceType === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceType('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceType === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceType('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceType === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceType('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className={`${getDeviceStyles()} bg-white`}>
            {sections.length > 0 ? (
              sections.map((section, index) => (
                <div key={section.id || index}>
                  {renderSection(section)}
                </div>
              ))
            ) : (
              <div className="py-16 px-8 text-center">
                <div className="text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No sections to preview</p>
                  <p className="text-sm">Add some sections to see the preview</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
