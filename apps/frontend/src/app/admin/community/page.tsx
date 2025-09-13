'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Save, 
  Globe, 
  Users, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Edit,
  Eye
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function CommunityPage() {
  const { community, user } = useAuth()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    ident: '',
    domain: '',
    locale: 'en',
    currency: 'USD',
    country: 'US',
    is_enabled: true,
    use_domain: false
  })

  // Update form data when community loads
  useEffect(() => {
    if (community) {
      setFormData({
        ident: community.ident || '',
        domain: community.domain || '',
        locale: community.locale || 'en',
        currency: community.currency || 'USD',
        country: community.country || 'US',
        is_enabled: community.is_enabled ?? true,
        use_domain: community.use_domain ?? false
      })
    }
  }, [community])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement actual API call to update community
      console.log('Updating community:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Community Updated',
        description: 'Your community settings have been saved successfully.',
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update community settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (community) {
      setFormData({
        ident: community.ident || '',
        domain: community.domain || '',
        locale: community.locale || 'en',
        currency: community.currency || 'USD',
        country: community.country || 'US',
        is_enabled: community.is_enabled ?? true,
        use_domain: community.use_domain ?? false
      })
    }
    setIsEditing(false)
  }

  if (!community) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Community Found</h3>
          <p className="text-gray-500">Unable to load community information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Settings</h1>
          <p className="text-gray-600 mt-2">Manage your community configuration and settings</p>
        </div>
        <div className="flex items-center space-x-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {community.is_enabled ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={community.is_enabled ? 'default' : 'destructive'}>
                {community.is_enabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Community status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domain</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{community.domain || 'Not set'}</div>
            <p className="text-xs text-muted-foreground">Custom domain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total members</p>
          </CardContent>
        </Card>
      </div>

      {/* Community Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Community Configuration</CardTitle>
          <CardDescription>
            Configure your community's basic settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ident">Community Identifier</Label>
              <Input
                id="ident"
                value={formData.ident}
                onChange={(e) => handleInputChange('ident', e.target.value)}
                disabled={!isEditing}
                placeholder="my-community"
              />
              <p className="text-xs text-muted-foreground">
                A unique identifier for your community (used in URLs)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                disabled={!isEditing}
                placeholder="example.com"
              />
              <p className="text-xs text-muted-foreground">
                Your custom domain (e.g., example.com)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <select
                id="locale"
                value={formData.locale}
                onChange={(e) => handleInputChange('locale', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="ES">Spain</option>
                <option value="IT">Italy</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_enabled">Community Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable your community
                </p>
              </div>
              <Switch
                id="is_enabled"
                checked={formData.is_enabled}
                onCheckedChange={(checked) => handleInputChange('is_enabled', checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="use_domain">Use Custom Domain</Label>
                <p className="text-sm text-muted-foreground">
                  Enable custom domain routing
                </p>
              </div>
              <Switch
                id="use_domain"
                checked={formData.use_domain}
                onCheckedChange={(checked) => handleInputChange('use_domain', checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common actions for managing your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Eye className="h-5 w-5 mb-2" />
              <span className="font-medium">View Public Site</span>
              <span className="text-sm text-muted-foreground">Preview your landing page</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Settings className="h-5 w-5 mb-2" />
              <span className="font-medium">Advanced Settings</span>
              <span className="text-sm text-muted-foreground">Configure advanced options</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Users className="h-5 w-5 mb-2" />
              <span className="font-medium">Manage Members</span>
              <span className="text-sm text-muted-foreground">View and manage community members</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
