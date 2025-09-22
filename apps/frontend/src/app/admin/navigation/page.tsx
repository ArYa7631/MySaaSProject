'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus, Edit, Trash2, Save, X, Navigation, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useTopbarItems, useFooterSections, useUpdateTopbarNavigation, useUpdateFooterNavigation } from '@/hooks/use-navigation'
import { NavigationItem, FooterSection } from '@/services/navigation.service'

export default function NavigationManagement() {
  const { community, user } = useAuth()
  const { toast } = useToast()
  
  // Use the new hooks
  const topbarItems = useTopbarItems()
  const footerSections = useFooterSections()
  const updateTopbarNavigationMutation = useUpdateTopbarNavigation()
  const updateFooterNavigationMutation = useUpdateFooterNavigation()
  
  // Debug: Log footer sections
  console.log('NavigationManagement - footerSections:', footerSections)
  
  // UI state
  const [editingTopbarItem, setEditingTopbarItem] = useState<NavigationItem | null>(null)
  const [showTopbarForm, setShowTopbarForm] = useState(false)
  const [editingFooterSection, setEditingFooterSection] = useState<FooterSection | null>(null)
  const [showFooterForm, setShowFooterForm] = useState(false)
  
  // Form states
  const [topbarForm, setTopbarForm] = useState({
    name: '',
    url: '',
    isExternal: false
  })
  
  const [footerForm, setFooterForm] = useState({
    label: '',
    links: [] as NavigationItem[]
  })

  const handleAddTopbarItem = () => {
    setTopbarForm({ name: '', url: '', isExternal: false })
    setEditingTopbarItem(null)
    setShowTopbarForm(true)
  }

  const handleEditTopbarItem = (item: NavigationItem) => {
    setTopbarForm({
      name: item.name,
      url: item.url,
      isExternal: item.isExternal
    })
    setEditingTopbarItem(item)
    setShowTopbarForm(true)
  }

  const handleSaveTopbarItem = async () => {
    if (!topbarForm.name.trim() || !topbarForm.url.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    try {
      const newItem: NavigationItem = {
        id: editingTopbarItem?.id || `item-${Date.now()}`,
        name: topbarForm.name.trim(),
        url: topbarForm.url.trim(),
        isExternal: topbarForm.isExternal,
        order: editingTopbarItem?.order || topbarItems.length
      }

      let updatedItems: NavigationItem[]
      if (editingTopbarItem) {
        updatedItems = topbarItems.map(item => 
          item.id === editingTopbarItem.id ? newItem : item
        )
      } else {
        updatedItems = [...topbarItems, newItem]
      }

      await updateTopbarNavigationMutation.mutateAsync(updatedItems)
      
      setShowTopbarForm(false)
      setEditingTopbarItem(null)
      setTopbarForm({ name: '', url: '', isExternal: false })
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }

  const handleDeleteTopbarItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return

    try {
      const updatedItems = topbarItems.filter(item => item.id !== itemId)
      await updateTopbarNavigationMutation.mutateAsync(updatedItems)
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }

  const handleAddFooterSection = () => {
    setFooterForm({ label: '', links: [] })
    setEditingFooterSection(null)
    setShowFooterForm(true)
  }

  const handleEditFooterSection = (section: FooterSection) => {
    setFooterForm({
      label: section.label,
      links: section.links
    })
    setEditingFooterSection(section)
    setShowFooterForm(true)
  }

  const handleSaveFooterSection = async () => {
    if (!footerForm.label.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a section label',
        variant: 'destructive',
      })
      return
    }

    try {
      const newSection: FooterSection = {
        id: editingFooterSection?.id || `section-${Date.now()}`,
        label: footerForm.label.trim(),
        links: footerForm.links
      }

      let updatedSections: FooterSection[]
      if (editingFooterSection) {
        updatedSections = footerSections.map(section => 
          section.id === editingFooterSection.id ? newSection : section
        )
      } else {
        updatedSections = [...footerSections, newSection]
      }

      await updateFooterNavigationMutation.mutateAsync(updatedSections)
      
      setShowFooterForm(false)
      setEditingFooterSection(null)
      setFooterForm({ label: '', links: [] })
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }

  const handleDeleteFooterSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this footer section?')) return

    try {
      const updatedSections = footerSections.filter(section => section.id !== sectionId)
      await updateFooterNavigationMutation.mutateAsync(updatedSections)
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }

  const addLinkToFooterSection = () => {
    const newLink: NavigationItem = {
      id: `link-${Date.now()}`,
      name: '',
      url: '',
      isExternal: false,
      order: footerForm.links.length
    }
    setFooterForm({
      ...footerForm,
      links: [...footerForm.links, newLink]
    })
  }

  const updateFooterLink = (linkId: string, field: keyof NavigationItem, value: any) => {
    setFooterForm({
      ...footerForm,
      links: footerForm.links.map(link => 
        link.id === linkId ? { ...link, [field]: value } : link
      )
    })
  }

  const removeFooterLink = (linkId: string) => {
    setFooterForm({
      ...footerForm,
      links: footerForm.links.filter(link => link.id !== linkId)
    })
  }

  // No loading state needed since we're using hooks that handle loading internally

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Navigation Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your site's topbar navigation and footer links
          </p>
        </div>
      </div>

      <Tabs defaultValue="topbar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="topbar">Topbar Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer Links</TabsTrigger>
        </TabsList>

        {/* Topbar Navigation Tab */}
        <TabsContent value="topbar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Topbar Navigation
                  </CardTitle>
                  <CardDescription>
                    Manage the main navigation items displayed in your site's topbar
                  </CardDescription>
                </div>
                <Button onClick={handleAddTopbarItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {topbarItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No navigation items yet. Add your first item to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topbarItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            {item.isExternal ? (
                              <ExternalLink className="h-3 w-3" />
                            ) : (
                              <LinkIcon className="h-3 w-3" />
                            )}
                            {item.url}
                            {item.isExternal && (
                              <Badge variant="secondary" className="ml-2">External</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTopbarItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTopbarItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Topbar Form Modal */}
          {showTopbarForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingTopbarItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={topbarForm.name}
                    onChange={(e) => setTopbarForm({ ...topbarForm, name: e.target.value })}
                    placeholder="e.g., About, Contact, Services"
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    value={topbarForm.url}
                    onChange={(e) => setTopbarForm({ ...topbarForm, url: e.target.value })}
                    placeholder="e.g., /about or https://example.com"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isExternal"
                    checked={topbarForm.isExternal}
                    onCheckedChange={(checked) => setTopbarForm({ ...topbarForm, isExternal: checked })}
                  />
                  <Label htmlFor="isExternal">External link (opens in new tab)</Label>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveTopbarItem} 
                    disabled={updateTopbarNavigationMutation.isPending}
                  >
                    {updateTopbarNavigationMutation.isPending ? 
                      <LoadingSpinner size={16} /> : 
                      <Save className="h-4 w-4 mr-2" />
                    }
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowTopbarForm(false)
                      setEditingTopbarItem(null)
                      setTopbarForm({ name: '', url: '', isExternal: false })
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Footer Links Tab */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Footer Links
                  </CardTitle>
                  <CardDescription>
                    Organize footer links into sections (e.g., Resources, Legal, Social)
                  </CardDescription>
                </div>
                <Button onClick={handleAddFooterSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {footerSections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No footer sections yet. Add your first section to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {footerSections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{section.label}</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFooterSection(section)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFooterSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {section.links.length === 0 ? (
                        <p className="text-sm text-gray-500">No links in this section</p>
                      ) : (
                        <div className="space-y-2">
                          {section.links.map((link) => (
                            <div key={link.id} className="flex items-center gap-2 text-sm">
                              {link.isExternal ? (
                                <ExternalLink className="h-3 w-3" />
                              ) : (
                                <LinkIcon className="h-3 w-3" />
                              )}
                              <span className="font-medium">{link.name}</span>
                              <span className="text-gray-500">- {link.url}</span>
                              {link.isExternal && (
                                <Badge variant="secondary" className="text-xs">External</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Form Modal */}
          {showFooterForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingFooterSection ? 'Edit Footer Section' : 'Add Footer Section'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sectionLabel">Section Label *</Label>
                  <Input
                    id="sectionLabel"
                    value={footerForm.label}
                    onChange={(e) => setFooterForm({ ...footerForm, label: e.target.value })}
                    placeholder="e.g., Resources, Legal, Social"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Links</Label>
                    <Button variant="outline" size="sm" onClick={addLinkToFooterSection}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  {footerForm.links.length === 0 ? (
                    <p className="text-sm text-gray-500">No links added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {footerForm.links.map((link) => (
                        <div key={link.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Link {footerForm.links.indexOf(link) + 1}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFooterLink(link.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`link-name-${link.id}`}>Name</Label>
                              <Input
                                id={`link-name-${link.id}`}
                                value={link.name}
                                onChange={(e) => updateFooterLink(link.id, 'name', e.target.value)}
                                placeholder="Link name"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`link-url-${link.id}`}>URL</Label>
                              <Input
                                id={`link-url-${link.id}`}
                                value={link.url}
                                onChange={(e) => updateFooterLink(link.id, 'url', e.target.value)}
                                placeholder="Link URL"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`link-external-${link.id}`}
                              checked={link.isExternal}
                              onCheckedChange={(checked) => updateFooterLink(link.id, 'isExternal', checked)}
                            />
                            <Label htmlFor={`link-external-${link.id}`}>External link</Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveFooterSection} 
                    disabled={updateFooterNavigationMutation.isPending}
                  >
                    {updateFooterNavigationMutation.isPending ? 
                      <LoadingSpinner size={16} /> : 
                      <Save className="h-4 w-4 mr-2" />
                    }
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowFooterForm(false)
                      setEditingFooterSection(null)
                      setFooterForm({ label: '', links: [] })
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
