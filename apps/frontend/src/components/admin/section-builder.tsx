'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Save, X, Eye } from 'lucide-react'
import { LandingPageSection } from '@mysaasproject/shared'
import { ImageUpload } from '@/components/ui/image-upload'
import { ImageUploadResponse } from '@/services/image.service'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

interface SectionBuilderProps {
  onSave: (section: LandingPageSection) => void
  onCancel: () => void
  initialData?: LandingPageSection | null
}

const sectionTypes = [
  { value: 'HeroSection', label: 'Hero Section', description: 'Full-screen hero with background image/video', icon: '🎯' },
  { value: 'Jumbotron', label: 'Jumbotron', description: 'Simple hero section with title and buttons', icon: '📢' },
  { value: 'Gallery', label: 'Gallery', description: 'Image gallery with multiple photos', icon: '🖼️' },
  { value: 'InfoColumns', label: 'Info Columns', description: 'Information displayed in columns', icon: '📊' },
  { value: 'ContactForm', label: 'Contact Form', description: 'Contact form for visitors', icon: '📝' },
  { value: 'Testimonials', label: 'Testimonials', description: 'Customer testimonials and reviews', icon: '⭐' },
  { value: 'Features', label: 'Features', description: 'Product features showcase', icon: '✨' },
  { value: 'Pricing', label: 'Pricing', description: 'Pricing plans and packages', icon: '💰' },
  { value: 'ImgDescription', label: 'Image & Description', description: 'Image with descriptive text and button', icon: '🖋️' },
  { value: 'VideoSection', label: 'Video Section', description: 'Video player with title and description', icon: '🎥' },
  { value: 'StatsSection', label: 'Statistics', description: 'Numbers and statistics display', icon: '📈' },
  { value: 'TeamSection', label: 'Team Section', description: 'Team members with photos and bios', icon: '👥' },
  { value: 'FAQSection', label: 'FAQ Section', description: 'Frequently asked questions', icon: '❓' },
  { value: 'NewsletterSection', label: 'Newsletter Signup', description: 'Email subscription form', icon: '📧' },
  { value: 'SocialProof', label: 'Social Proof', description: 'Logos, badges, and trust indicators', icon: '🏆' },
  { value: 'CustomSection', label: 'Custom Section', description: 'Fully customizable section with rich text editor', icon: '✏️' },
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

  // Update sectionData when initialData changes (e.g., when selecting a template)
  useEffect(() => {
    if (initialData) {
      setSectionData({
        name: initialData.name || '',
        description: initialData.description || '',
        type: initialData.type || initialData.name || '',
        content: initialData.content || {},
      })
    }
  }, [initialData])

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

  const handleImageUpload = (field: string, response: ImageUploadResponse) => {
    handleContentChange(field, response.url)
  }

  const handleMultipleImageUpload = (field: string, response: ImageUploadResponse) => {
    const currentImages = sectionData.content[field] || []
    const newImages = [...currentImages, { 
      url: response.url, 
      alt: response.filename || `Gallery image ${currentImages.length + 1}` 
    }]
    handleContentChange(field, newImages)
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
                  <Label>Background Image</Label>
                  <div className="space-y-2">
                    <ImageUpload
                      onUploadSuccess={(response) => handleImageUpload('backgroundImage', response)}
                      folder="hero"
                      maxFiles={1}
                      maxSizeMB={10}
                      className="mb-2"
                    />
                    {sectionData.content.backgroundImage && (
                      <div className="mt-2">
                        <Label htmlFor="backgroundImageUrl">Or enter URL manually:</Label>
                        <Input
                          id="backgroundImageUrl"
                          value={sectionData.content.backgroundImage || ''}
                          onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    )}
                  </div>
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
              <Label>Gallery Images</Label>
              <div className="space-y-2">
                <ImageUpload
                  onUploadSuccess={(response) => handleMultipleImageUpload('images', response)}
                  folder="gallery"
                  maxFiles={10}
                  maxSizeMB={10}
                  className="mb-2"
                />
                
                {/* Current Images with Alt Text Editing */}
                {sectionData.content.images && sectionData.content.images.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <Label>Current Images ({sectionData.content.images.length})</Label>
                    {sectionData.content.images.map((img: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img 
                          src={img.url} 
                          alt={img.alt || `Gallery image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <Input
                            value={img.url || ''}
                            onChange={(e) => {
                              const updatedImages = [...sectionData.content.images]
                              updatedImages[index] = { ...updatedImages[index], url: e.target.value }
                              handleContentChange('images', updatedImages)
                            }}
                            placeholder="Image URL"
                            className="text-sm"
                          />
                          <Input
                            value={img.alt || ''}
                            onChange={(e) => {
                              const updatedImages = [...sectionData.content.images]
                              updatedImages[index] = { ...updatedImages[index], alt: e.target.value }
                              handleContentChange('images', updatedImages)
                            }}
                            placeholder="Alt text (optional)"
                            className="text-sm"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updatedImages = sectionData.content.images.filter((_: any, i: number) => i !== index)
                            handleContentChange('images', updatedImages)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Manual URL Input */}
                <div className="mt-2">
                  <Label htmlFor="images">Or enter URLs manually (one per line):</Label>
                  <Textarea
                    id="images"
                    value={sectionData.content.images?.map((img: any) => img.url).join('\n') || ''}
                    onChange={(e) => {
                      const urls = e.target.value.split('\n').filter(url => url.trim())
                      const images = urls.map((url, index) => ({ 
                        url: url.trim(), 
                        alt: `Gallery image ${index + 1}` 
                      }))
                      handleContentChange('images', images)
                    }}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={3}
                  />
                </div>
              </div>
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

      case 'ImgDescription':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="imgHeader">Header</Label>
              <Input
                id="imgHeader"
                value={sectionData.content.header || ''}
                onChange={(e) => handleContentChange('header', e.target.value)}
                placeholder="Section Header"
              />
            </div>
            <div>
              <Label htmlFor="imgDescription">Description</Label>
              <Textarea
                id="imgDescription"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Detailed description"
                rows={4}
              />
            </div>
            <div>
              <Label>Image</Label>
              <div className="space-y-2">
                <ImageUpload
                  onUploadSuccess={(response) => handleImageUpload('imageURL', response)}
                  folder="sections"
                  maxFiles={1}
                  maxSizeMB={10}
                  className="mb-2"
                />
                {sectionData.content.imageURL && (
                  <div className="mt-2">
                    <Label htmlFor="imageURL">Or enter URL manually:</Label>
                    <Input
                      id="imageURL"
                      value={sectionData.content.imageURL || ''}
                      onChange={(e) => handleContentChange('imageURL', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonLabel">Button Label</Label>
                <Input
                  id="buttonLabel"
                  value={sectionData.content.buttonLabel || ''}
                  onChange={(e) => handleContentChange('buttonLabel', e.target.value)}
                  placeholder="Learn More"
                />
              </div>
              <div>
                <Label htmlFor="buttonURL">Button URL</Label>
                <Input
                  id="buttonURL"
                  value={sectionData.content.buttonURL || ''}
                  onChange={(e) => handleContentChange('buttonURL', e.target.value)}
                  placeholder="/about"
                />
              </div>
            </div>
          </div>
        )

      case 'VideoSection':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoTitle">Video Title</Label>
              <Input
                id="videoTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Watch Our Story"
              />
            </div>
            <div>
              <Label htmlFor="videoDescription">Description</Label>
              <Textarea
                id="videoDescription"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Learn more about our company"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={sectionData.content.videoUrl || ''}
                onChange={(e) => handleContentChange('videoUrl', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label>Video Thumbnail (optional)</Label>
              <div className="space-y-2">
                <ImageUpload
                  onUploadSuccess={(response) => handleImageUpload('thumbnailUrl', response)}
                  folder="videos"
                  maxFiles={1}
                  maxSizeMB={10}
                  className="mb-2"
                />
                {sectionData.content.thumbnailUrl && (
                  <div className="mt-2">
                    <Label htmlFor="thumbnailUrl">Or enter URL manually:</Label>
                    <Input
                      id="thumbnailUrl"
                      value={sectionData.content.thumbnailUrl || ''}
                      onChange={(e) => handleContentChange('thumbnailUrl', e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'StatsSection':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="statsTitle">Section Title</Label>
              <Input
                id="statsTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Our Impact"
              />
            </div>
            <div>
              <Label htmlFor="statsDescription">Description</Label>
              <Textarea
                id="statsDescription"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Numbers that matter"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="stats">Statistics (one per line, format: "Number|Label|Description")</Label>
              <Textarea
                id="stats"
                value={sectionData.content.stats?.map((stat: any) => `${stat.number}|${stat.label}|${stat.description}`).join('\n') || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim())
                  const stats = lines.map(line => {
                    const [number, label, description] = line.split('|')
                    return { number: number?.trim(), label: label?.trim(), description: description?.trim() }
                  })
                  handleContentChange('stats', stats)
                }}
                placeholder="1000|Happy Customers|Satisfied clients worldwide&#10;50|Projects|Successfully completed&#10;5|Years|Of experience"
                rows={5}
              />
            </div>
          </div>
        )

      case 'TeamSection':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamTitle">Section Title</Label>
              <Input
                id="teamTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Meet Our Team"
              />
            </div>
            <div>
              <Label htmlFor="teamDescription">Description</Label>
              <Textarea
                id="teamDescription"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="The people behind our success"
                rows={2}
              />
            </div>
            <div>
              <Label>Team Members</Label>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Add team members using the format: "Name|Role|Bio|ImageURL"</p>
                  <p>You can upload images first and then copy the URLs, or enter URLs directly.</p>
                </div>
                <ImageUpload
                  onUploadSuccess={(response) => {
                    // Show a toast with the uploaded URL for easy copying
                    const url = response.url
                    navigator.clipboard.writeText(url).then(() => {
                      alert(`Image uploaded! URL copied to clipboard: ${url}`)
                    }).catch(() => {
                      alert(`Image uploaded! URL: ${url}`)
                    })
                  }}
                  folder="team"
                  maxFiles={5}
                  maxSizeMB={10}
                  className="mb-2"
                />
                <Textarea
                  id="teamMembers"
                  value={sectionData.content.members?.map((member: any) => `${member.name}|${member.role}|${member.bio}|${member.imageUrl}`).join('\n') || ''}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(line => line.trim())
                    const members = lines.map(line => {
                      const [name, role, bio, imageUrl] = line.split('|')
                      return { name: name?.trim(), role: role?.trim(), bio: bio?.trim(), imageUrl: imageUrl?.trim() }
                    })
                    handleContentChange('members', members)
                  }}
                  placeholder="John Doe|CEO|Visionary leader with 10+ years experience|https://example.com/john.jpg&#10;Jane Smith|CTO|Technical expert and innovation driver|https://example.com/jane.jpg"
                  rows={6}
                />
              </div>
            </div>
          </div>
        )

      case 'FAQSection':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="faqTitle">Section Title</Label>
              <Input
                id="faqTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Frequently Asked Questions"
              />
            </div>
            <div>
              <Label htmlFor="faqDescription">Description</Label>
              <Textarea
                id="faqDescription"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Find answers to common questions"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="faqs">FAQ Items (one per line, format: "Question|Answer")</Label>
              <Textarea
                id="faqs"
                value={sectionData.content.faqs?.map((faq: any) => `${faq.question}|${faq.answer}`).join('\n') || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim())
                  const faqs = lines.map(line => {
                    const [question, answer] = line.split('|')
                    return { question: question?.trim(), answer: answer?.trim() }
                  })
                  handleContentChange('faqs', faqs)
                }}
                placeholder="What services do you offer?|We provide web development, mobile apps, and consulting&#10;How long does a project take?|Typically 2-8 weeks depending on complexity"
                rows={8}
              />
            </div>
          </div>
        )

      case 'NewsletterSection':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="newsletterTitle">Section Title</Label>
              <Input
                id="newsletterTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Stay Updated"
              />
            </div>
            <div>
              <Label htmlFor="newsletterDescription">Description</Label>
              <Textarea
                id="newsletterDescription"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Subscribe to our newsletter for updates"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="newsletterPlaceholder">Email Input Placeholder</Label>
              <Input
                id="newsletterPlaceholder"
                value={sectionData.content.placeholder || ''}
                onChange={(e) => handleContentChange('placeholder', e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <Label htmlFor="newsletterButtonText">Button Text</Label>
              <Input
                id="newsletterButtonText"
                value={sectionData.content.buttonText || ''}
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
                placeholder="Subscribe"
              />
            </div>
          </div>
        )

      case 'SocialProof':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="socialTitle">Section Title</Label>
              <Input
                id="socialTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Trusted By"
              />
            </div>
            <div>
              <Label htmlFor="socialDescription">Description</Label>
              <Textarea
                id="socialDescription"
                value={sectionData.content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Leading companies trust our solutions"
                rows={2}
              />
            </div>
            <div>
              <Label>Social Proof Items</Label>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Add social proof items using the format: "Type|Title|Description|ImageURL"</p>
                  <p>You can upload images first and then copy the URLs, or enter URLs directly.</p>
                </div>
                <ImageUpload
                  onUploadSuccess={(response) => {
                    // Show a toast with the uploaded URL for easy copying
                    const url = response.url
                    navigator.clipboard.writeText(url).then(() => {
                      alert(`Image uploaded! URL copied to clipboard: ${url}`)
                    }).catch(() => {
                      alert(`Image uploaded! URL: ${url}`)
                    })
                  }}
                  folder="social-proof"
                  maxFiles={10}
                  maxSizeMB={10}
                  className="mb-2"
                />
                <Textarea
                  id="socialItems"
                  value={sectionData.content.items?.map((item: any) => `${item.type}|${item.title}|${item.description}|${item.imageUrl}`).join('\n') || ''}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(line => line.trim())
                    const items = lines.map(line => {
                      const [type, title, description, imageUrl] = line.split('|')
                      return { type: type?.trim(), title: title?.trim(), description: description?.trim(), imageUrl: imageUrl?.trim() }
                    })
                    handleContentChange('items', items)
                  }}
                  placeholder="logo|Company A|Leading tech company|https://example.com/logo1.png&#10;badge|Award Winner|Best Service 2024|https://example.com/badge.png&#10;testimonial|5-Star Rating|Customer satisfaction|https://example.com/rating.png"
                  rows={6}
                />
              </div>
            </div>
          </div>
        )

      case 'InfoColumns':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="columnsTitle">Section Title</Label>
              <Input
                id="columnsTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Our Services"
              />
            </div>
            <div>
              <Label htmlFor="columnsSubtitle">Subtitle</Label>
              <Input
                id="columnsSubtitle"
                value={sectionData.content.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                placeholder="What we offer"
              />
            </div>
            <div>
              <Label htmlFor="columns">Columns (one per line, format: "Title|Description|Icon")</Label>
              <Textarea
                id="columns"
                value={sectionData.content.columns?.map((col: any) => `${col.title}|${col.description}|${col.icon}`).join('\n') || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim())
                  const columns = lines.map(line => {
                    const [title, description, icon] = line.split('|')
                    return { title: title?.trim(), description: description?.trim(), icon: icon?.trim() }
                  })
                  handleContentChange('columns', columns)
                }}
                placeholder="Web Development|Custom websites and applications|🌐&#10;Mobile Apps|iOS and Android development|📱&#10;Consulting|Technical guidance and strategy|💡"
                rows={6}
              />
            </div>
          </div>
        )

      case 'Testimonials':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="testimonialsTitle">Section Title</Label>
              <Input
                id="testimonialsTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="What Our Clients Say"
              />
            </div>
            <div>
              <Label htmlFor="testimonialsSubtitle">Subtitle</Label>
              <Input
                id="testimonialsSubtitle"
                value={sectionData.content.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                placeholder="Trusted by businesses worldwide"
              />
            </div>
            <div>
              <Label htmlFor="testimonials">Testimonials (one per line, format: "Name|Quote|Icon")</Label>
              <Textarea
                id="testimonials"
                value={sectionData.content.columns?.map((testimonial: any) => `${testimonial.title}|${testimonial.description}|${testimonial.icon}`).join('\n') || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim())
                  const testimonials = lines.map(line => {
                    const [name, quote, icon] = line.split('|')
                    return { title: name?.trim(), description: quote?.trim(), icon: icon?.trim() }
                  })
                  handleContentChange('columns', testimonials)
                }}
                placeholder="John Doe|Exceptional work! Delivered ahead of schedule.|⭐&#10;Jane Smith|Professional and reliable service.|⭐&#10;Tech Startup|Game-changing solution for our business.|⭐"
                rows={6}
              />
            </div>
          </div>
        )

      case 'Features':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="featuresTitle">Section Title</Label>
              <Input
                id="featuresTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Key Features"
              />
            </div>
            <div>
              <Label htmlFor="featuresSubtitle">Subtitle</Label>
              <Input
                id="featuresSubtitle"
                value={sectionData.content.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                placeholder="Why choose us"
              />
            </div>
            <div>
              <Label htmlFor="features">Features (one per line, format: "Title|Description|Icon")</Label>
              <Textarea
                id="features"
                value={sectionData.content.columns?.map((feature: any) => `${feature.title}|${feature.description}|${feature.icon}`).join('\n') || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim())
                  const features = lines.map(line => {
                    const [title, description, icon] = line.split('|')
                    return { title: title?.trim(), description: description?.trim(), icon: icon?.trim() }
                  })
                  handleContentChange('columns', features)
                }}
                placeholder="Fast Delivery|Quick turnaround times|⚡&#10;Quality Code|Clean, maintainable code|🔧&#10;24/7 Support|Always here to help|🛠️"
                rows={6}
              />
            </div>
          </div>
        )

      case 'Pricing':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pricingTitle">Section Title</Label>
              <Input
                id="pricingTitle"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Pricing Plans"
              />
            </div>
            <div>
              <Label htmlFor="pricingSubtitle">Subtitle</Label>
              <Input
                id="pricingSubtitle"
                value={sectionData.content.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                placeholder="Choose the perfect plan"
              />
            </div>
            <div>
              <Label htmlFor="pricingPlans">Pricing Plans (one per line, format: "Name|Price|Period|Features|Popular")</Label>
              <Textarea
                id="pricingPlans"
                value={sectionData.content.plans?.map((plan: any) => `${plan.name}|${plan.price}|${plan.period}|${plan.features?.join(',')}|${plan.popular || 'false'}`).join('\n') || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim())
                  const plans = lines.map(line => {
                    const [name, price, period, features, popular] = line.split('|')
                    return { 
                      name: name?.trim(), 
                      price: price?.trim(), 
                      period: period?.trim(), 
                      features: features?.split(',').map(f => f.trim()).filter(f => f),
                      popular: popular?.trim() === 'true'
                    }
                  })
                  handleContentChange('plans', plans)
                }}
                placeholder="Basic|$99|month|5 pages, Basic support|false&#10;Pro|$199|month|15 pages, Priority support, Analytics|true&#10;Enterprise|$399|month|Unlimited pages, 24/7 support, Custom features|false"
                rows={6}
              />
            </div>
          </div>
        )

      case 'CustomSection':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title (optional)</Label>
              <Input
                id="title"
                value={sectionData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={sectionData.content.content || ''}
                onChange={(content) => handleContentChange('content', content)}
                placeholder="Start typing your custom content..."
                className="min-h-[300px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="backgroundColor">Background Color (optional)</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={sectionData.content.backgroundColor || '#ffffff'}
                  onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="textColor">Text Color (optional)</Label>
                <Input
                  id="textColor"
                  type="color"
                  value={sectionData.content.textColor || '#000000'}
                  onChange={(e) => handleContentChange('textColor', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="padding">Padding (optional)</Label>
              <Select
                value={sectionData.content.padding || 'py-16'}
                onValueChange={(value) => handleContentChange('padding', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select padding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="py-8">Small (py-8)</SelectItem>
                  <SelectItem value="py-12">Medium (py-12)</SelectItem>
                  <SelectItem value="py-16">Large (py-16)</SelectItem>
                  <SelectItem value="py-20">Extra Large (py-20)</SelectItem>
                  <SelectItem value="py-24">Huge (py-24)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="className">Custom CSS Classes (optional)</Label>
              <Input
                id="className"
                value={sectionData.content.className || ''}
                onChange={(e) => handleContentChange('className', e.target.value)}
                placeholder="e.g., custom-gradient, special-border"
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
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{type.icon}</span>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
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
