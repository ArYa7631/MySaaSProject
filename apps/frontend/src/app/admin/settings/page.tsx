'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useMarketplaceConfiguration } from '@/hooks/use-landing-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Save, Globe, Palette, Image } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { LandingPageService } from '@/services/landing-page.service'

export default function SettingsPage() {
  const { community } = useAuth()
  const { data: config, isLoading, error } = useMarketplaceConfiguration()
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    logo: '',
    globalTextColor: '',
    globalBgColor: '',
    globalHighlightColor: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    githubUrl: '',
    whatsappNumber: '',
    copyright: '',
  })

  // Update form data when config loads
  useEffect(() => {
    if (config) {
      setFormData({
        title: config.title || '',
        logo: config.logo || '',
        globalTextColor: config.global_text_color || '',
        globalBgColor: config.global_bg_color || '',
        globalHighlightColor: config.global_highlight_color || '',
        facebookUrl: config.facebook_url || '',
        instagramUrl: config.instagram_url || '',
        twitterUrl: config.twitter_url || '',
        githubUrl: config.github_url || '',
        whatsappNumber: config.whatsapp_number || '',
        copyright: config.copyright || '',
      })
    }
  }, [config])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const communityId = community?.id || 3 // Use community ID 3 for development
      
      const result = await LandingPageService.updateMarketplaceConfiguration(communityId, {
        title: formData.title,
        logo: formData.logo,
        global_text_color: formData.globalTextColor,
        global_bg_color: formData.globalBgColor,
        global_highlight_color: formData.globalHighlightColor,
        facebook_url: formData.facebookUrl,
        instagram_url: formData.instagramUrl,
        twitter_url: formData.twitterUrl,
        github_url: formData.githubUrl,
        whatsapp_number: formData.whatsappNumber,
        copyright: formData.copyright,
      })
      
      toast({
        title: 'Settings Saved',
        description: 'Your settings have been saved successfully.',
      })
      
      console.log('Settings saved:', result)
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Settings</h2>
        <p className="text-gray-600">Failed to load community settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your community settings and branding</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Community Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Community Information
          </CardTitle>
          <CardDescription>Basic information about your community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="community-name">Community Name</Label>
              <Input
                id="community-name"
                value={community?.ident || ''}
                disabled
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">Community name cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={community?.domain || ''}
                disabled
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">Domain cannot be changed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Branding
          </CardTitle>
          <CardDescription>Customize your community's appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Site Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter your site title"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => handleInputChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">Enter the URL of your logo image</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="text-color"
                  value={formData.globalTextColor}
                  onChange={(e) => handleInputChange('globalTextColor', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
                <div 
                  className="w-8 h-8 border rounded"
                  style={{ backgroundColor: formData.globalTextColor || '#000000' }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="bg-color"
                  value={formData.globalBgColor}
                  onChange={(e) => handleInputChange('globalBgColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
                <div 
                  className="w-8 h-8 border rounded"
                  style={{ backgroundColor: formData.globalBgColor || '#ffffff' }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="highlight-color">Highlight Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="highlight-color"
                  value={formData.globalHighlightColor}
                  onChange={(e) => handleInputChange('globalHighlightColor', e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
                <div 
                  className="w-8 h-8 border rounded"
                  style={{ backgroundColor: formData.globalHighlightColor || '#3b82f6' }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media & Contact</CardTitle>
          <CardDescription>Manage your social media links and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                value={formData.facebookUrl}
                onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/yourpage"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input
                id="twitter"
                value={formData.twitterUrl}
                onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/yourpage"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                placeholder="https://github.com/yourpage"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="+1234567890"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                value={formData.copyright}
                onChange={(e) => handleInputChange('copyright', e.target.value)}
                placeholder="© 2025 Your Company. All rights reserved."
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Community Status</CardTitle>
          <CardDescription>Manage your community's status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Community Status</p>
              <p className="text-sm text-gray-600">
                {community?.is_enabled ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              community?.is_enabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {community?.is_enabled ? 'Active' : 'Inactive'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your branding will look</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: formData.globalBgColor || '#ffffff',
              color: formData.globalTextColor || '#000000'
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              {formData.logo && (
                <img 
                  src={formData.logo} 
                  alt="Logo" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <h3 className="text-xl font-bold">{formData.title || 'Your Site Title'}</h3>
            </div>
            <p className="text-sm">
              This is how your site title and colors will appear to visitors.
            </p>
            <div className="mt-4">
              <Button 
                size="sm"
                style={{ 
                  backgroundColor: formData.globalHighlightColor || '#3b82f6',
                  borderColor: formData.globalHighlightColor || '#3b82f6'
                }}
              >
                Sample Button
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-700">
            <p><strong>Community ID:</strong> {community?.id || 3}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
            <p><strong>Config Data:</strong> {config ? 'Loaded' : 'Not loaded'}</p>
            <p><strong>Form Data:</strong> {JSON.stringify(formData, null, 2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
