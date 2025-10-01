'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus, Edit, Eye, Trash2, Save, X, FileText, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { SectionBuilder } from '@/components/admin/section-builder'
import { SectionTemplates } from '@/components/admin/section-templates'
import { ContentPagePreview } from '@/components/admin/content-page-preview'
import { SortableSections } from '@/components/admin/sortable-sections'
import { LandingPageSection } from '@mysaasproject/shared'
import Link from 'next/link'

interface ContentPage {
  id: number
  title: string
  end_point: string
  data: {
    sections?: LandingPageSection[]
  }
  meta_data: {
    title?: string
    description?: string
    keywords?: string[]
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ContentPageEditor() {
  const { community, user } = useAuth()
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  
  const [contentPage, setContentPage] = useState<ContentPage | null>(null)
  const [sections, setSections] = useState<LandingPageSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isError, setIsError] = useState(false)
  
  // UI State
  const [showSectionBuilder, setShowSectionBuilder] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingSection, setEditingSection] = useState<LandingPageSection | null>(null)

  // Load content page data
  useEffect(() => {
    if (params.id && community) {
      loadContentPage()
    }
  }, [params.id, community])

  const loadContentPage = async () => {
    if (!community?.id || !params.id) return
    
    setIsLoading(true)
    setIsError(false)
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
      const response = await fetch(`${apiBaseUrl}/communities/${community.id}/content_pages/${params.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const page = data.data
        setContentPage(page)
        
        // Extract sections from page data
        const pageSections = page.data?.sections || []
        setSections(Array.isArray(pageSections) ? pageSections : [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to load content page:', response.status, errorData)
        throw new Error(`Failed to load content page: ${response.status}`)
      }
    } catch (error) {
      console.error('Error loading content page:', error)
      setIsError(true)
      toast({
        title: 'Error',
        description: 'Failed to load content page',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSection = () => {
    setEditingSection(null)
    setShowSectionBuilder(true)
  }

  const handleEditSection = (section: LandingPageSection) => {
    setEditingSection(section)
    setShowSectionBuilder(true)
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updatedSections = sections.filter(section => section.id !== sectionId)
      setSections(updatedSections)
      await saveContentPage(updatedSections)
    }
  }

  const handleReorderSections = async (newOrder: string[]) => {
    const reorderedSections = newOrder.map(id => 
      sections.find(section => section.id === id)
    ).filter(Boolean) as LandingPageSection[]
    
    setSections(reorderedSections)
    await saveContentPage(reorderedSections)
  }

  const handleSaveSection = async (section: LandingPageSection) => {
    try {
      let updatedSections: LandingPageSection[]
      
      // Check if this is an existing section by looking for its ID in current sections
      const existingSectionIndex = sections.findIndex(s => s.id === section.id)
      
      if (existingSectionIndex >= 0) {
        // Update existing section
        updatedSections = sections.map(s => 
          s.id === section.id ? section : s
        )
      } else {
        // Add new section (including from templates)
        updatedSections = [...sections, section]
      }
      
      setSections(updatedSections)
      await saveContentPage(updatedSections)
      
      setShowSectionBuilder(false)
      setEditingSection(null)
      
      toast({
        title: 'Success',
        description: 'Section saved successfully',
      })
    } catch (error) {
      console.error('Error saving section:', error)
      toast({
        title: 'Error',
        description: 'Failed to save section',
        variant: 'destructive',
      })
    }
  }

  const saveContentPage = async (updatedSections: LandingPageSection[]) => {
    if (!community?.id || !contentPage) return
    
    setIsSaving(true)
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
      const response = await fetch(`${apiBaseUrl}/communities/${community.id}/content_pages/${contentPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          content_page: {
            data: {
              sections: updatedSections
            }
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to save content page:', response.status, errorData)
        throw new Error(`Failed to save content page: ${response.status}`)
      }
    } catch (error) {
      console.error('Error saving content page:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleTemplateSelect = (template: LandingPageSection) => {
    // Set the template as initial data for the section builder
    setEditingSection(template)
    setShowTemplates(false)
    setShowSectionBuilder(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  if (isError || !contentPage) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Content Page</h2>
        <p className="text-gray-600 mb-4">Failed to load content page data</p>
        <Link href="/admin/content-pages">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Pages
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content-pages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contentPage.title}</h1>
            <p className="text-gray-600 mt-1">
              Edit sections for: <span className="font-mono">{contentPage.end_point}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Page Preview</CardTitle>
            <CardDescription>
              Preview how your content page will look to visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentPagePreview 
              contentPage={contentPage}
              sections={sections}
            />
          </CardContent>
        </Card>
      )}

      {/* Section Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Page Sections
              </CardTitle>
              <CardDescription>
                Build your content page with customizable sections
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowTemplates(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button onClick={handleAddSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sections yet. Add your first section to get started.</p>
              <Button 
                className="mt-4" 
                onClick={handleAddSection}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Section
              </Button>
            </div>
          ) : (
            <SortableSections
              sections={sections}
              onReorder={handleReorderSections}
              onEdit={handleEditSection}
              onDelete={handleDeleteSection}
            />
          )}
        </CardContent>
      </Card>

      {/* Section Builder Modal */}
      {showSectionBuilder && (
        <SectionBuilder
          initialData={editingSection}
          onSave={handleSaveSection}
          onCancel={() => {
            setShowSectionBuilder(false)
            setEditingSection(null)
          }}
        />
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <SectionTemplates
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  )
}
