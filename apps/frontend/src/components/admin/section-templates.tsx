'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LandingPageSection } from '@mysaasproject/shared'
import { Plus, Star, Users, Zap, Award } from 'lucide-react'

interface SectionTemplatesProps {
  onSelectTemplate: (template: LandingPageSection) => void
  onClose: () => void
}

const sectionTemplates: LandingPageSection[] = [
  {
    id: 'hero-startup',
    name: 'Startup Hero',
    description: 'Modern hero section for tech startups',
    type: 'HeroSection',
    content: {
      title: 'Build the Future',
      subtitle: 'Innovative Solutions for Modern Businesses',
      description: 'We help startups and enterprises transform their ideas into scalable digital products that drive growth and success.',
      primaryButton: {
        text: 'Get Started',
        url: '/signup'
      },
      secondaryButton: {
        text: 'Learn More',
        url: '/about'
      },
      backgroundImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    }
  },
  {
    id: 'services-tech',
    name: 'Tech Services',
    description: 'Technology services showcase',
    type: 'InfoColumns',
    content: {
      title: 'Our Services',
      subtitle: 'Comprehensive Digital Solutions',
      columns: [
        {
          title: 'Web Development',
          description: 'Custom websites and web applications built with modern technologies like React, Next.js, and Node.js.',
          icon: '🌐'
        },
        {
          title: 'Mobile Development',
          description: 'Cross-platform mobile applications for iOS and Android using React Native and Flutter.',
          icon: '📱'
        },
        {
          title: 'Cloud Solutions',
          description: 'Scalable cloud infrastructure and deployment solutions using AWS, Azure, and Google Cloud.',
          icon: '☁️'
        },
        {
          title: 'AI & ML',
          description: 'Artificial intelligence and machine learning solutions to automate and optimize your business processes.',
          icon: '🤖'
        }
      ]
    }
  },
  {
    id: 'testimonials-modern',
    name: 'Client Testimonials',
    description: 'Modern testimonials section',
    type: 'Testimonials',
    content: {
      title: 'What Our Clients Say',
      subtitle: 'Trusted by Industry Leaders',
      columns: [
        {
          title: 'Sarah Johnson',
          description: '"Exceptional work! The team delivered our e-commerce platform ahead of schedule with outstanding quality and attention to detail."',
          icon: '⭐'
        },
        {
          title: 'Michael Chen',
          description: '"Professional, reliable, and technically excellent. Highly recommend for any complex web development project."',
          icon: '⭐'
        },
        {
          title: 'TechCorp Inc.',
          description: '"The mobile app they built for us has been a game-changer for our business growth and customer engagement."',
          icon: '⭐'
        }
      ]
    }
  },
  {
    id: 'stats-impressive',
    name: 'Impact Statistics',
    description: 'Numbers that showcase your impact',
    type: 'StatsSection',
    content: {
      title: 'Our Impact',
      description: 'Numbers that speak for themselves',
      stats: [
        {
          number: '500+',
          label: 'Projects Completed',
          description: 'Successfully delivered projects'
        },
        {
          number: '50+',
          label: 'Happy Clients',
          description: 'Satisfied customers worldwide'
        },
        {
          number: '99%',
          label: 'Success Rate',
          description: 'Project completion rate'
        },
        {
          number: '24/7',
          label: 'Support',
          description: 'Round-the-clock assistance'
        }
      ]
    }
  },
  {
    id: 'team-modern',
    name: 'Meet the Team',
    description: 'Modern team showcase',
    type: 'TeamSection',
    content: {
      title: 'Meet Our Team',
      description: 'The talented individuals behind our success',
      members: [
        {
          name: 'Alex Thompson',
          role: 'CEO & Founder',
          bio: 'Visionary leader with 15+ years in tech, passionate about building innovative solutions.',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Maria Rodriguez',
          role: 'CTO',
          bio: 'Technical expert and innovation driver, specializing in scalable architecture.',
          imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'David Kim',
          role: 'Lead Developer',
          bio: 'Full-stack developer with expertise in modern web technologies and best practices.',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        }
      ]
    }
  },
  {
    id: 'faq-comprehensive',
    name: 'FAQ Section',
    description: 'Comprehensive FAQ section',
    type: 'FAQSection',
    content: {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about our services',
      faqs: [
        {
          question: 'What services do you offer?',
          answer: 'We provide comprehensive digital solutions including web development, mobile apps, cloud solutions, and AI/ML services.'
        },
        {
          question: 'How long does a typical project take?',
          answer: 'Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications can take 2-6 months.'
        },
        {
          question: 'Do you provide ongoing support?',
          answer: 'Yes, we offer 24/7 support and maintenance packages to ensure your applications run smoothly.'
        },
        {
          question: 'What technologies do you use?',
          answer: 'We use modern technologies including React, Next.js, Node.js, Python, AWS, and various mobile frameworks.'
        },
        {
          question: 'Can you work with our existing systems?',
          answer: 'Absolutely! We specialize in integrating with existing systems and can help modernize your current infrastructure.'
        }
      ]
    }
  },
  {
    id: 'pricing-saas',
    name: 'SaaS Pricing',
    description: 'Modern SaaS pricing plans',
    type: 'Pricing',
    content: {
      title: 'Choose Your Plan',
      subtitle: 'Flexible pricing for every business size',
      plans: [
        {
          name: 'Starter',
          price: '$99',
          period: 'month',
          features: ['5 pages', 'Basic support', 'SSL certificate', 'Mobile responsive'],
          popular: false
        },
        {
          name: 'Professional',
          price: '$199',
          period: 'month',
          features: ['15 pages', 'Priority support', 'Analytics dashboard', 'Custom integrations', 'SEO optimization'],
          popular: true
        },
        {
          name: 'Enterprise',
          price: '$399',
          period: 'month',
          features: ['Unlimited pages', '24/7 support', 'Custom features', 'Dedicated account manager', 'Advanced analytics'],
          popular: false
        }
      ]
    }
  },
  {
    id: 'newsletter-modern',
    name: 'Newsletter Signup',
    description: 'Modern newsletter subscription',
    type: 'NewsletterSection',
    content: {
      title: 'Stay Updated',
      description: 'Subscribe to our newsletter for the latest updates, tips, and industry insights.',
      placeholder: 'Enter your email address',
      buttonText: 'Subscribe Now'
    }
  },
  {
    id: 'social-proof-logos',
    name: 'Client Logos',
    description: 'Social proof with client logos',
    type: 'SocialProof',
    content: {
      title: 'Trusted By',
      description: 'Leading companies worldwide trust our solutions',
      items: [
        {
          type: 'logo',
          title: 'TechCorp',
          description: 'Fortune 500 Technology Company',
          imageUrl: 'https://via.placeholder.com/150x80/4F46E5/FFFFFF?text=TechCorp'
        },
        {
          type: 'logo',
          title: 'InnovateLab',
          description: 'Leading Innovation Company',
          imageUrl: 'https://via.placeholder.com/150x80/059669/FFFFFF?text=InnovateLab'
        },
        {
          type: 'logo',
          title: 'FutureSoft',
          description: 'Software Solutions Provider',
          imageUrl: 'https://via.placeholder.com/150x80/DC2626/FFFFFF?text=FutureSoft'
        },
        {
          type: 'badge',
          title: 'Award Winner',
          description: 'Best Service Provider 2024',
          imageUrl: 'https://via.placeholder.com/150x80/F59E0B/FFFFFF?text=Award+2024'
        }
      ]
    }
  },
  {
    id: 'video-story',
    name: 'Company Story Video',
    description: 'Video section for company story',
    type: 'VideoSection',
    content: {
      title: 'Our Story',
      description: 'Watch how we started and where we\'re heading in the future of technology.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    }
  },
  {
    id: 'custom-blank',
    name: 'Custom Blank Section',
    description: 'Start with a blank custom section',
    type: 'CustomSection',
    content: {
      title: '',
      content: '<p>Start typing your custom content here...</p>',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: 'py-16',
      className: ''
    }
  },
  {
    id: 'custom-about',
    name: 'About Us Section',
    description: 'Custom about us section with rich content',
    type: 'CustomSection',
    content: {
      title: 'About Our Company',
      content: `
        <h2>Our Story</h2>
        <p>We are a passionate team dedicated to delivering exceptional solutions that drive business growth and innovation.</p>
        
        <h3>Our Mission</h3>
        <p>To empower businesses with cutting-edge technology and creative solutions that make a real difference.</p>
        
        <h3>Our Values</h3>
        <ul>
          <li><strong>Innovation:</strong> We constantly push boundaries and explore new possibilities</li>
          <li><strong>Quality:</strong> We deliver excellence in everything we do</li>
          <li><strong>Integrity:</strong> We maintain the highest ethical standards</li>
          <li><strong>Collaboration:</strong> We work together to achieve common goals</li>
        </ul>
        
        <blockquote>
          <p>"Success is not just about reaching the destination, but about the journey and the impact we make along the way."</p>
        </blockquote>
      `,
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      padding: 'py-20',
      className: ''
    }
  }
]

const templateCategories = [
  { name: 'Popular', icon: Star, color: 'bg-yellow-500' },
  { name: 'Business', icon: Users, color: 'bg-blue-500' },
  { name: 'Tech', icon: Zap, color: 'bg-purple-500' },
  { name: 'Award', icon: Award, color: 'bg-green-500' }
]

export const SectionTemplates: React.FC<SectionTemplatesProps> = ({
  onSelectTemplate,
  onClose
}) => {
  const handleSelectTemplate = (template: LandingPageSection) => {
    // Generate a new unique ID for the template
    const newTemplate = {
      ...template,
      id: `${template.id}-${Date.now()}`
    }
    onSelectTemplate(newTemplate)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Section Templates</CardTitle>
              <CardDescription>
                Choose from pre-built templates to quickly add sections to your landing page
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Template Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {templateCategories.map((category) => (
              <Badge key={category.name} variant="secondary" className="flex items-center gap-1">
                <category.icon className="h-3 w-3" />
                {category.name}
              </Badge>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Preview of template content */}
                  <div className="space-y-2 mb-4">
                    {template.content.title && (
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {template.content.title}
                      </div>
                    )}
                    {template.content.subtitle && (
                      <div className="text-xs text-gray-600 truncate">
                        {template.content.subtitle}
                      </div>
                    )}
                    {template.content.description && (
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {template.content.description}
                      </div>
                    )}
                  </div>

                  {/* Template features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.type === 'InfoColumns' && template.content.columns && (
                      <Badge variant="secondary" className="text-xs">
                        {template.content.columns.length} items
                      </Badge>
                    )}
                    {template.type === 'StatsSection' && template.content.stats && (
                      <Badge variant="secondary" className="text-xs">
                        {template.content.stats.length} stats
                      </Badge>
                    )}
                    {template.type === 'TeamSection' && template.content.members && (
                      <Badge variant="secondary" className="text-xs">
                        {template.content.members.length} members
                      </Badge>
                    )}
                    {template.type === 'FAQSection' && template.content.faqs && (
                      <Badge variant="secondary" className="text-xs">
                        {template.content.faqs.length} FAQs
                      </Badge>
                    )}
                    {template.type === 'Pricing' && template.content.plans && (
                      <Badge variant="secondary" className="text-xs">
                        {template.content.plans.length} plans
                      </Badge>
                    )}
                  </div>

                  <Button 
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty state if no templates */}
          {sectionTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No templates available at the moment.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
