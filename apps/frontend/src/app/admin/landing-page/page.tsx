'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLandingPageState } from '@/hooks/use-landing-page-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus, Edit, Eye, Trash2, FileText, Save, X, Layout } from 'lucide-react'
import Link from 'next/link'
import { SectionBuilder } from '@/components/admin/section-builder'
import { SectionTemplates } from '@/components/admin/section-templates'
import { LandingPagePreview } from '@/components/admin/landing-page-preview'
import { SortableSections } from '@/components/admin/sortable-sections'
import { LandingPageSection } from '@mysaasproject/shared'

export default function LandingPageEditor() {
  const { community, user } = useAuth()
  const {
    sections,
    isLoading,
    isError,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    isEditing,
    setIsEditing,
    selectedSectionId,
    setSelectedSectionId
  } = useLandingPageState()

  const [showSectionBuilder, setShowSectionBuilder] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingSection, setEditingSection] = useState<LandingPageSection | null>(null)

  // Debug: Log sections data
  useEffect(() => {
    console.log('Current sections:', sections)
  }, [sections])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Sections</h2>
        <p className="text-gray-600">Failed to load landing page sections</p>
      </div>
    )
  }

  const handleAddSection = () => {
    console.log('Adding section - Community ID:', community?.id)
    console.log('User data:', user)
    console.log('Community data:', community)
    setEditingSection(null)
    setShowSectionBuilder(true)
  }

  const handleEditSection = (section: LandingPageSection) => {
    setEditingSection(section)
    setShowSectionBuilder(true)
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      await deleteSection(sectionId)
    }
  }

  const handleReorderSections = async (newOrder: string[]) => {
    await reorderSections(newOrder)
  }

  const handleSaveSection = async (section: LandingPageSection) => {
    console.log('Saving section:', section)
    console.log('Community ID:', community?.id)
    console.log('User ID:', user?.id)
    try {
      if (editingSection) {
        console.log('Updating existing section:', editingSection.id)
        await updateSection(editingSection.id, section)
      } else {
        console.log('Adding new section')
        await addSection(section)
      }
      setShowSectionBuilder(false)
      setEditingSection(null)
    } catch (error) {
      console.error('Error saving section:', error)
      alert('Failed to save section. Please try again.')
    }
  }

  const handleCancelSection = () => {
    setShowSectionBuilder(false)
    setEditingSection(null)
  }

  const handleSelectTemplate = async (template: LandingPageSection) => {
    try {
      await addSection(template)
      setShowTemplates(false)
    } catch (error) {
      console.error('Error adding template section:', error)
      alert('Failed to add template section. Please try again.')
    }
  }

  // Add test section for debugging
  const handleAddTestSection = async () => {
    const testSection: LandingPageSection = {
      id: `test-section-${Date.now()}`,
      name: 'Test Hero Section',
      description: 'A test hero section for debugging',
      type: 'HeroSection',
      content: {
        title: 'Welcome to Our Platform',
        subtitle: 'The best solution for your needs',
        description: 'This is a test section to verify the integration is working properly.',
        primaryButton: {
          text: 'Get Started',
          url: '/signup'
        },
        secondaryButton: {
          text: 'Learn More',
          url: '/about'
        }
      }
    }
    
    try {
      await addSection(testSection)
      console.log('Test section added successfully')
    } catch (error) {
      console.error('Error adding test section:', error)
      alert('Failed to add test section')
    }
  }

  // Add multiple test sections for reordering
  const handleAddMultipleTestSections = async () => {
    const testSections: LandingPageSection[] = [
      {
        id: `test-section-1-${Date.now()}`,
        name: 'First Section',
        description: 'This is the first section',
        type: 'Jumbotron',
        content: {
          title: 'First Section Title',
          description: 'First section description',
          primaryButton: { text: 'Button 1', url: '/first' }
        }
      },
      {
        id: `test-section-2-${Date.now()}`,
        name: 'Second Section',
        description: 'This is the second section',
        type: 'Features',
        content: {
          title: 'Second Section Title',
          description: 'Second section description',
          primaryButton: { text: 'Button 2', url: '/second' }
        }
      },
      {
        id: `test-section-3-${Date.now()}`,
        name: 'Third Section',
        description: 'This is the third section',
        type: 'Gallery',
        content: {
          title: 'Third Section Title',
          description: 'Third section description',
          primaryButton: { text: 'Button 3', url: '/third' }
        }
      }
    ]
    
    try {
      for (const section of testSections) {
        await addSection(section)
      }
      console.log('Multiple test sections added successfully')
    } catch (error) {
      console.error('Error adding test sections:', error)
      alert('Failed to add test sections')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Landing Page Editor</h1>
          <p className="text-gray-600 mt-2">Customize your landing page sections and content</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Link href="/landing">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Live View
            </Button>
          </Link>
          <Button onClick={() => setShowTemplates(true)}>
            <Layout className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={handleAddSection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
          <Button variant="outline" onClick={handleAddTestSection}>
            Add Test Section
          </Button>
          <Button variant="outline" onClick={handleAddMultipleTestSections}>
            Add 3 Test Sections
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-700">
            <p><strong>Community ID:</strong> {community?.id}</p>
            <p><strong>Sections Count:</strong> {sections?.length || 0}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {isError ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Sections List */}
      {sections && sections.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Sections ({sections.length})</h2>
            <p className="text-sm text-gray-600">Drag and drop to reorder sections</p>
          </div>
          <SortableSections
            sections={sections}
            onReorder={handleReorderSections}
            onEdit={handleEditSection}
            onDelete={handleDeleteSection}
          />
        </div>
      ) : null}

      {/* Empty State */}
      {(!sections || sections.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No sections yet</h3>
                <p className="text-gray-600 mt-1">
                  Get started by adding your first landing page section
                </p>
              </div>
              <div className="flex space-x-4 justify-center">
                <Button onClick={() => setShowTemplates(true)}>
                  <Layout className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
                <Button onClick={handleAddSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Section
                </Button>
                <Button variant="outline" onClick={handleAddTestSection}>
                  Add Test Section
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Types Info */}
      <Card>
        <CardHeader>
          <CardTitle>Available Section Types</CardTitle>
          <CardDescription>Choose from these section types to build your landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'HeroSection', description: 'Full-screen hero with background image/video' },
              { name: 'Jumbotron', description: 'Simple hero section with title and buttons' },
              { name: 'Gallery', description: 'Image gallery with multiple photos' },
              { name: 'InfoColumns', description: 'Information displayed in columns' },
              { name: 'ContactForm', description: 'Contact form for visitors' },
              { name: 'Testimonials', description: 'Customer testimonials and reviews' },
              { name: 'Features', description: 'Product features showcase' },
              { name: 'Pricing', description: 'Pricing plans and packages' },
            ].map((type) => (
              <div key={type.name} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900">{type.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Builder Modal */}
      {showSectionBuilder && (
        <SectionBuilder
          onSave={handleSaveSection}
          onCancel={handleCancelSection}
          initialData={editingSection}
        />
      )}

      {/* Section Templates Modal */}
      {showTemplates && (
        <SectionTemplates
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Landing Page Preview Modal */}
      {showPreview && (
        <LandingPagePreview
          sections={sections || []}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
