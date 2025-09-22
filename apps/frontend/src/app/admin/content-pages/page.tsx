'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus, Edit, Trash2, Save, X, FileText, Eye, ExternalLink, Link as LinkIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useContentPages, useCreateContentPage, useUpdateContentPage, useDeleteContentPage } from '@/hooks/use-content-pages'
import { ContentPage, CreateContentPageData, UpdateContentPageData } from '@/services/content-page.service'

export default function ContentPagesManagement() {
  const { community, user } = useAuth()
  const { toast } = useToast()
  
  // Use the new hooks
  const { data: contentPages = [], isLoading, isError } = useContentPages()
  const createContentPageMutation = useCreateContentPage()
  const updateContentPageMutation = useUpdateContentPage()
  const deleteContentPageMutation = useDeleteContentPage()
  
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  const [form, setForm] = useState({
    title: '',
    end_point: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_active: true
  })

  const handleAddPage = () => {
    setForm({
      title: '',
      end_point: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      is_active: true
    })
    setEditingPage(null)
    setShowForm(true)
  }

  const handleEditPage = (page: ContentPage) => {
    setForm({
      title: page.title,
      end_point: page.end_point,
      meta_title: page.meta_data?.title || '',
      meta_description: page.meta_data?.description || '',
      meta_keywords: page.meta_data?.keywords?.join(', ') || '',
      is_active: page.is_active
    })
    setEditingPage(page)
    setShowForm(true)
  }

  const handleSavePage = async () => {
    if (!form.title.trim() || !form.end_point.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    // Validate endpoint format
    if (!form.end_point.startsWith('/')) {
      toast({
        title: 'Validation Error',
        description: 'Endpoint must start with / (e.g., /about)',
        variant: 'destructive',
      })
      return
    }

    const pageData: CreateContentPageData | UpdateContentPageData = {
      title: form.title.trim(),
      end_point: form.end_point.trim(),
      meta_data: {
        title: form.meta_title.trim() || form.title.trim(),
        description: form.meta_description.trim(),
        keywords: form.meta_keywords.trim() ? form.meta_keywords.split(',').map(k => k.trim()) : []
      },
      data: editingPage?.data || { sections: [] },
      is_active: form.is_active
    }

    try {
      if (editingPage) {
        await updateContentPageMutation.mutateAsync({
          pageId: editingPage.id,
          data: pageData as UpdateContentPageData
        })
      } else {
        await createContentPageMutation.mutateAsync(pageData as CreateContentPageData)
      }
      
      setShowForm(false)
      setEditingPage(null)
      setForm({
        title: '',
        end_point: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_active: true
      })
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  }

  const handleDeletePage = async (pageId: number) => {
    if (!confirm('Are you sure you want to delete this content page?')) return

    try {
      await deleteContentPageMutation.mutateAsync(pageId)
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }

  const handleToggleActive = async (page: ContentPage) => {
    try {
      await updateContentPageMutation.mutateAsync({
        pageId: page.id,
        data: { is_active: !page.is_active }
      })
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }

  const getPageUrl = (endPoint: string) => {
    if (!community?.domain) return endPoint
    return `https://${community.domain}${endPoint}`
  }

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
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Content Pages</h2>
        <p className="text-gray-600">Failed to load content pages</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Pages</h1>
          <p className="text-gray-600 mt-2">
            Create and manage custom content pages for your site
          </p>
        </div>
        <Button onClick={handleAddPage}>
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>

      {/* Content Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Content Pages
          </CardTitle>
          <CardDescription>
            Manage your custom content pages and their sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contentPages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content pages yet. Create your first page to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contentPages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">{page.title}</h3>
                        <Badge variant={page.is_active ? "default" : "secondary"}>
                          {page.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          <span>{page.end_point}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          <a 
                            href={getPageUrl(page.end_point)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600"
                          >
                            View Page
                          </a>
                        </div>
                        <span>
                          {page.data?.sections?.length || 0} sections
                        </span>
                        <span>
                          Created {new Date(page.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {page.meta_data?.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {page.meta_data.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(page)}
                      >
                        {page.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Link href={`/admin/content-pages/${page.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePage(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPage ? 'Edit Content Page' : 'Create Content Page'}
            </CardTitle>
            <CardDescription>
              {editingPage ? 'Update your content page details' : 'Create a new content page for your site'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., About Us, Contact, Services"
                />
              </div>
              <div>
                <Label htmlFor="end_point">Endpoint *</Label>
                <Input
                  id="end_point"
                  value={form.end_point}
                  onChange={(e) => setForm({ ...form, end_point: e.target.value })}
                  placeholder="e.g., /about, /contact, /services"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must start with / (e.g., /about)
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="meta_title">SEO Title</Label>
              <Input
                id="meta_title"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                placeholder="Leave empty to use page title"
              />
            </div>

            <div>
              <Label htmlFor="meta_description">SEO Description</Label>
              <Textarea
                id="meta_description"
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                placeholder="Brief description for search engines"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="meta_keywords">SEO Keywords</Label>
              <Input
                id="meta_keywords"
                value={form.meta_keywords}
                onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                placeholder="Comma-separated keywords (e.g., about, company, team)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
              />
              <Label htmlFor="is_active">Active (visible to visitors)</Label>
            </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSavePage} 
                    disabled={createContentPageMutation.isPending || updateContentPageMutation.isPending}
                  >
                    {(createContentPageMutation.isPending || updateContentPageMutation.isPending) ? 
                      <LoadingSpinner size={16} /> : 
                      <Save className="h-4 w-4 mr-2" />
                    }
                    {editingPage ? 'Update Page' : 'Create Page'}
                  </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingPage(null)
                  setForm({
                    title: '',
                    end_point: '',
                    meta_title: '',
                    meta_description: '',
                    meta_keywords: '',
                    is_active: true
                  })
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
