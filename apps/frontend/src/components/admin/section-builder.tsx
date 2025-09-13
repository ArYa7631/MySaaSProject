'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Save, X, Eye } from 'lucide-react'
import { LandingPageSection } from '@mysaasproject/shared'

interface SectionBuilderProps {
  onSave: (section: LandingPageSection) => void
  onCancel: () => void
  initialData?: LandingPageSection | null
}

const sectionTypes = [
  { value: 'HeroSection', label: 'Hero Section', description: 'Full-screen hero with background image/video' },
  { value: 'Jumbotron', label: 'Jumbotron', description: 'Simple hero section with title and buttons' },
  { value: 'Gallery', label: 'Gallery', description: 'Image gallery with multiple photos' },
  { value: 'InfoColumns', label: 'Info Columns', description: 'Information displayed in columns' },
  { value: 'ContactForm', label: 'Contact Form', description: 'Contact form for visitors' },
  { value: 'Testimonials', label: 'Testimonials', description: 'Customer testimonials and reviews' },
  { value: 'Features', label: 'Features', description: 'Product features showcase' },
  { value: 'Pricing', label: 'Pricing', description: 'Pricing plans and packages' },
]

export const SectionBuilder: React.FC<SectionBuilderProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [sectionData, setSectionData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || initialData?.name || '',
    content: initialData?.content || {},
  })

  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setSectionData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContentChange = (field: string, value: any) => {
    setSectionData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    const section: LandingPageSection = {
      id: initialData?.id || `section-${Date.now()}`,
      name: sectionData.name,
      description: sectionData.description,
      type: sectionData.type,
      content: sectionData.content,
    }
    onSave(section)
  }

  const renderContentFields = () => {
    switch (sectionData.type) {
      case 'HeroSection':
      case 'Jumbotron':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle (optional)</Label>
              <Input
                id="subtitle"
                value={sectionData.content.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryButtonText">Primary Button Text</Label>
                <Input
                  id="primaryButtonText"
                  value={sectionData.content.primaryButton?.text || ''}
                  onChange={(e) => handleContentChange('primaryButton', {
                    ...sectionData.content.primaryButton,
                    text: e.target.value
                  })}
                  placeholder="Get Started"
                />
              </div>
              <div>
                <Label htmlFor="primaryButtonUrl">Primary Button URL</Label>
                <Input
                  id="primaryButtonUrl"
                  value={sectionData.content.primaryButton?.url || ''}
                  onChange={(e) => handleContentChange('primaryButton', {
                    ...sectionData.content.primaryButton,
                    url: e.target.value
                  })}
                  placeholder="/signup"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="secondaryButtonText">Secondary Button Text (optional)</Label>
                <Input
                  id="secondaryButtonText"
                  value={sectionData.content.secondaryButton?.text || ''}
                  onChange={(e) => handleContentChange('secondaryButton', {
                    ...sectionData.content.secondaryButton,
                    text: e.target.value
                  })}
                  placeholder="Learn More"
                />
              </div>
              <div>
                <Label htmlFor="secondaryButtonUrl">Secondary Button URL</Label>
                <Input
                  id="secondaryButtonUrl"
                  value={sectionData.content.secondaryButton?.url || ''}
                  onChange={(e) => handleContentChange('secondaryButton', {
                    ...sectionData.content.secondaryButton,
                    url: e.target.value
                  })}
                  placeholder="/about"
                />
              </div>
            </div>
            {sectionData.type === 'HeroSection' && (
              <>
                <div>
                  <Label htmlFor="backgroundImage">Background Image URL (optional)</Label>
                  <Input
                    id="backgroundImage"
                    value={sectionData.content.backgroundImage || ''}
                    onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="videoUrl">Video URL (optional)</Label>
                  <Input
                    id="videoUrl"
                    value={sectionData.content.videoUrl || ''}
                    onChange={(e) => handleContentChange('videoUrl', e.target.value)}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </>
            )}
          </div>
        )

      case 'Gallery':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="galleryTitle">Gallery Title (optional)</Label>
              <Input
                id="galleryTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Our Gallery"
              />
            </div>
            <div>
              <Label htmlFor="images">Image URLs (one per line)</Label>
              <Textarea
                id="images"
                value={sectionData.content.images?.map((img: any) => img.url).join('\n') || ''}
                onChange={(e) => {
                  const urls = e.target.value.split('\n').filter(url => url.trim())
                  const images = urls.map(url => ({ url: url.trim() }))
                  handleContentChange('images', images)
                }}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={5}
              />
            </div>
          </div>
        )

      case 'ContactForm':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contactTitle">Form Title</Label>
              <Input
                id="contactTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Get in Touch"
              />
            </div>
            <div>
              <Label htmlFor="contactDescription">Form Description</Label>
              <Textarea
                id="contactDescription"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="We'd love to hear from you. Send us a message."
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Select a section type to configure its content</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {initialData ? 'Edit Section' : 'Create New Section'}
              </CardTitle>
              <CardDescription>
                Configure your section content and settings
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isPreviewMode ? (
            <>
              {/* Basic Settings */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sectionName">Section Name</Label>
                  <Input
                    id="sectionName"
                    value={sectionData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter section name"
                  />
                </div>
                <div>
                  <Label htmlFor="sectionDescription">Description</Label>
                  <Textarea
                    id="sectionDescription"
                    value={sectionData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of this section"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="sectionType">Section Type</Label>
                  <Select
                    value={sectionData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Configuration */}
              {sectionData.type && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content Configuration</h3>
                  {renderContentFields()}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Section Preview:</p>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                  {JSON.stringify(sectionData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!sectionData.name || !sectionData.type}>
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Update Section' : 'Create Section'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
