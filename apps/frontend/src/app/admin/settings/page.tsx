'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useCommunityContext } from '@/hooks/use-community-context'
import { useMarketplaceConfiguration } from '@/hooks/use-landing-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Save, Globe, Palette, Image, Bell, Languages } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { LandingPageService } from '@/services/landing-page.service'
import { ImageUpload } from '@/components/ui/image-upload'
import { ImageUploadResponse } from '@/services/image.service'
import { ColorPicker } from '@/components/ui/color-picker'
import { NavigationService } from '@/services/navigation.service'
import { CommunityService } from '@/services/community.service'

// Currency and Locale options
const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
]

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
]

// Professional Color Combinations
const COLOR_COMBINATIONS = [
  {
    name: 'Ocean Blue',
    description: 'Professional and trustworthy',
    colors: {
      globalBgColor: '#f8fafc',
      globalTextColor: '#1e293b',
      globalHighlightColor: '#0ea5e9',
      title_color: '#0f172a'
    }
  },
  {
    name: 'Forest Green',
    description: 'Natural and eco-friendly',
    colors: {
      globalBgColor: '#f0fdf4',
      globalTextColor: '#1f2937',
      globalHighlightColor: '#22c55e',
      title_color: '#14532d'
    }
  },
  {
    name: 'Sunset Orange',
    description: 'Warm and energetic',
    colors: {
      globalBgColor: '#fff7ed',
      globalTextColor: '#1f2937',
      globalHighlightColor: '#f97316',
      title_color: '#c2410c'
    }
  },
  {
    name: 'Royal Purple',
    description: 'Luxurious and creative',
    colors: {
      globalBgColor: '#faf5ff',
      globalTextColor: '#1f2937',
      globalHighlightColor: '#8b5cf6',
      title_color: '#6b21a8'
    }
  },
  {
    name: 'Rose Pink',
    description: 'Elegant and modern',
    colors: {
      globalBgColor: '#fdf2f8',
      globalTextColor: '#1f2937',
      globalHighlightColor: '#ec4899',
      title_color: '#be185d'
    }
  },
  {
    name: 'Midnight Dark',
    description: 'Sleek and professional',
    colors: {
      globalBgColor: '#0f172a',
      globalTextColor: '#f1f5f9',
      globalHighlightColor: '#3b82f6',
      title_color: '#ffffff'
    }
  },
  {
    name: 'Gradient Blue',
    description: 'Modern gradient design',
    colors: {
      globalBgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      globalTextColor: '#ffffff',
      globalHighlightColor: '#fbbf24',
      title_color: '#ffffff'
    }
  },
  {
    name: 'Gradient Sunset',
    description: 'Warm gradient vibes',
    colors: {
      globalBgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      globalTextColor: '#1f2937',
      globalHighlightColor: '#f59e0b',
      title_color: '#92400e'
    }
  },
  {
    name: 'Minimal Gray',
    description: 'Clean and minimal',
    colors: {
      globalBgColor: '#ffffff',
      globalTextColor: '#374151',
      globalHighlightColor: '#6b7280',
      title_color: '#111827'
    }
  },
  {
    name: 'Emerald Green',
    description: 'Fresh and vibrant',
    colors: {
      globalBgColor: '#ecfdf5',
      globalTextColor: '#064e3b',
      globalHighlightColor: '#10b981',
      title_color: '#065f46'
    }
  },
  {
    name: 'Tech Blue',
    description: 'Modern and tech-focused',
    colors: {
      globalBgColor: '#f0f9ff',
      globalTextColor: '#0c4a6e',
      globalHighlightColor: '#0284c7',
      title_color: '#075985'
    }
  },
  {
    name: 'Warm Cream',
    description: 'Soft and welcoming',
    colors: {
      globalBgColor: '#fffbeb',
      globalTextColor: '#92400e',
      globalHighlightColor: '#d97706',
      title_color: '#78350f'
    }
  },
  {
    name: 'Cool Gray',
    description: 'Professional and neutral',
    colors: {
      globalBgColor: '#f9fafb',
      globalTextColor: '#374151',
      globalHighlightColor: '#4b5563',
      title_color: '#111827'
    }
  },
  {
    name: 'Gradient Ocean',
    description: 'Deep ocean vibes',
    colors: {
      globalBgColor: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
      globalTextColor: '#ffffff',
      globalHighlightColor: '#fbbf24',
      title_color: '#ffffff'
    }
  },
  {
    name: 'Gradient Forest',
    description: 'Nature-inspired gradient',
    colors: {
      globalBgColor: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #10b981 100%)',
      globalTextColor: '#ffffff',
      globalHighlightColor: '#fbbf24',
      title_color: '#ffffff'
    }
  }
]

// Navigation Color Theme Combinations
const NAVIGATION_COLOR_THEMES = [
  {
    name: 'Classic White',
    description: 'Clean and professional',
    topbar: {
      background_color: '#ffffff',
      text_color: '#1f2937',
      link_color: '#374151',
      hover_color: '#111827'
    },
    footer: {
      background_color: '#f8fafc',
      text_color: '#374151',
      link_color: '#6b7280',
      hover_color: '#1f2937'
    }
  },
  {
    name: 'Dark Professional',
    description: 'Modern and sleek',
    topbar: {
      background_color: '#1f2937',
      text_color: '#f9fafb',
      link_color: '#d1d5db',
      hover_color: '#ffffff'
    },
    footer: {
      background_color: '#111827',
      text_color: '#f3f4f6',
      link_color: '#9ca3af',
      hover_color: '#ffffff'
    }
  },
  {
    name: 'Ocean Blue',
    description: 'Calm and trustworthy',
    topbar: {
      background_color: '#0ea5e9',
      text_color: '#ffffff',
      link_color: '#e0f2fe',
      hover_color: '#f0f9ff'
    },
    footer: {
      background_color: '#0369a1',
      text_color: '#ffffff',
      link_color: '#bae6fd',
      hover_color: '#e0f2fe'
    }
  },
  {
    name: 'Forest Green',
    description: 'Natural and eco-friendly',
    topbar: {
      background_color: '#22c55e',
      text_color: '#ffffff',
      link_color: '#dcfce7',
      hover_color: '#f0fdf4'
    },
    footer: {
      background_color: '#16a34a',
      text_color: '#ffffff',
      link_color: '#bbf7d0',
      hover_color: '#dcfce7'
    }
  },
  {
    name: 'Sunset Orange',
    description: 'Warm and energetic',
    topbar: {
      background_color: '#f97316',
      text_color: '#ffffff',
      link_color: '#fed7aa',
      hover_color: '#fff7ed'
    },
    footer: {
      background_color: '#ea580c',
      text_color: '#ffffff',
      link_color: '#fdba74',
      hover_color: '#fed7aa'
    }
  },
  {
    name: 'Royal Purple',
    description: 'Luxurious and creative',
    topbar: {
      background_color: '#8b5cf6',
      text_color: '#ffffff',
      link_color: '#e9d5ff',
      hover_color: '#faf5ff'
    },
    footer: {
      background_color: '#7c3aed',
      text_color: '#ffffff',
      link_color: '#c4b5fd',
      hover_color: '#e9d5ff'
    }
  },
  {
    name: 'Rose Pink',
    description: 'Elegant and modern',
    topbar: {
      background_color: '#ec4899',
      text_color: '#ffffff',
      link_color: '#fce7f3',
      hover_color: '#fdf2f8'
    },
    footer: {
      background_color: '#db2777',
      text_color: '#ffffff',
      link_color: '#f9a8d4',
      hover_color: '#fce7f3'
    }
  },
  {
    name: 'Midnight Dark',
    description: 'Sleek and professional',
    topbar: {
      background_color: '#0f172a',
      text_color: '#f1f5f9',
      link_color: '#cbd5e1',
      hover_color: '#ffffff'
    },
    footer: {
      background_color: '#020617',
      text_color: '#f8fafc',
      link_color: '#94a3b8',
      hover_color: '#f1f5f9'
    }
  },
  {
    name: 'Gradient Blue',
    description: 'Modern gradient design',
    topbar: {
      background_color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text_color: '#ffffff',
      link_color: '#e0e7ff',
      hover_color: '#f0f4ff'
    },
    footer: {
      background_color: 'linear-gradient(135deg, #4c1d95 0%, #581c87 100%)',
      text_color: '#ffffff',
      link_color: '#c4b5fd',
      hover_color: '#e0e7ff'
    }
  },
  {
    name: 'Gradient Sunset',
    description: 'Warm gradient vibes',
    topbar: {
      background_color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      text_color: '#1f2937',
      link_color: '#374151',
      hover_color: '#111827'
    },
    footer: {
      background_color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      text_color: '#ffffff',
      link_color: '#fed7aa',
      hover_color: '#fff7ed'
    }
  },
  {
    name: 'Minimal Gray',
    description: 'Clean and minimal',
    topbar: {
      background_color: '#ffffff',
      text_color: '#374151',
      link_color: '#6b7280',
      hover_color: '#111827'
    },
    footer: {
      background_color: '#f9fafb',
      text_color: '#374151',
      link_color: '#6b7280',
      hover_color: '#111827'
    }
  },
  {
    name: 'Emerald Green',
    description: 'Fresh and vibrant',
    topbar: {
      background_color: '#10b981',
      text_color: '#ffffff',
      link_color: '#d1fae5',
      hover_color: '#ecfdf5'
    },
    footer: {
      background_color: '#059669',
      text_color: '#ffffff',
      link_color: '#a7f3d0',
      hover_color: '#d1fae5'
    }
  }
]

export default function SettingsPage() {
  const { user } = useAuth()
  const { community, isLoading: communityLoading, isError: communityError } = useCommunityContext()
  const { data: config, isLoading, error } = useMarketplaceConfiguration(community)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    // Basic information
    communityName: '',
    // Basic branding
    title: '',
    logo: '',
    profile_logo: '',
    favicon: '',
    title_color: '',
    
    // Colors
    globalTextColor: '',
    globalBgColor: '',
    globalHighlightColor: '',
    
    // Topbar colors
    topbarBackgroundColor: '',
    topbarTextColor: '',
    topbarLinkColor: '',
    topbarHoverColor: '',
    
    // Footer colors
    footerBackgroundColor: '',
    footerTextColor: '',
    footerLinkColor: '',
    footerHoverColor: '',
    
    // Localization
    available_locale: 'en',
    available_currency: 'USD',
    
    // Social media
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    githubUrl: '',
    skypeUrl: '',
    
    // Contact & legal
    whatsappNumber: '',
    enable_whatsapp_bot: false,
    copyright: '',
    notification: '',
    cookie_text: '',
    
  })

  // Update form data when config loads
  useEffect(() => {
    if (config) {
      const configAny = config as any // Temporary type assertion until shared types are updated
      setFormData(prev => ({
        ...prev,
        communityName: community?.ident || '',
        title: config.title || '',
        logo: config.logo || '',
        profile_logo: configAny.profile_logo || '',
        favicon: configAny.favicon || '',
        title_color: configAny.title_color || '',
        globalTextColor: config.global_text_color || '',
        globalBgColor: config.global_bg_color || '',
        globalHighlightColor: config.global_highlight_color || '',
        available_locale: configAny.available_locale || 'en',
        available_currency: configAny.available_currency || 'USD',
        facebookUrl: configAny.facebook_url || '',
        instagramUrl: configAny.instagram_url || '',
        twitterUrl: configAny.twitter_url || '',
        githubUrl: configAny.github_url || '',
        skypeUrl: configAny.skype_url || '',
        whatsappNumber: configAny.whatsapp_number || '',
        enable_whatsapp_bot: configAny.enable_whatsapp_bot || false,
        copyright: configAny.copyright || '',
        notification: configAny.notification || '',
        cookie_text: configAny.cookie_text || '',
      }))
    }
  }, [config])

  // Load topbar and footer data
  useEffect(() => {
    const loadNavigationData = async () => {
      if (!community?.id) return

      try {
        const [topbarData, footerData] = await Promise.all([
          NavigationService.getTopbar(community.id),
          NavigationService.getFooter(community.id)
        ])

        setFormData(prev => ({
          ...prev,
          // Topbar colors
          topbarBackgroundColor: topbarData?.background_color || '',
          topbarTextColor: topbarData?.text_color || '',
          topbarLinkColor: topbarData?.link_color || '',
          topbarHoverColor: topbarData?.hover_color || '',
          // Footer colors
          footerBackgroundColor: footerData?.background_color || '',
          footerTextColor: footerData?.text_color || '',
          footerLinkColor: footerData?.link_color || '',
          footerHoverColor: footerData?.hover_color || '',
        }))
      } catch (error) {
        console.error('Failed to load navigation data:', error)
      }
    }

    loadNavigationData()
  }, [community?.id])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (field: 'logo' | 'profile_logo' | 'favicon') => {
    return (response: ImageUploadResponse) => {
      handleInputChange(field, response.url)
      toast({
        title: 'Image Uploaded',
        description: `${field.replace('_', ' ')} uploaded successfully.`,
      })
    }
  }

  const applyColorCombination = (combination: typeof COLOR_COMBINATIONS[0]) => {
    setFormData(prev => ({
      ...prev,
      globalBgColor: combination.colors.globalBgColor,
      globalTextColor: combination.colors.globalTextColor,
      globalHighlightColor: combination.colors.globalHighlightColor,
      title_color: combination.colors.title_color,
    }))
    
    toast({
      title: 'Color Combination Applied',
      description: `${combination.name} theme has been applied successfully.`,
    })
  }

  const applyNavigationColorTheme = (theme: typeof NAVIGATION_COLOR_THEMES[0]) => {
    setFormData(prev => ({
      ...prev,
      // Topbar colors
      topbarBackgroundColor: theme.topbar.background_color,
      topbarTextColor: theme.topbar.text_color,
      topbarLinkColor: theme.topbar.link_color,
      topbarHoverColor: theme.topbar.hover_color,
      // Footer colors
      footerBackgroundColor: theme.footer.background_color,
      footerTextColor: theme.footer.text_color,
      footerLinkColor: theme.footer.link_color,
      footerHoverColor: theme.footer.hover_color,
    }))
    
    toast({
      title: 'Navigation Theme Applied',
      description: `${theme.name} navigation theme has been applied successfully.`,
    })
  }

  const validateForm = () => {
    const errors: string[] = []
    
    // URL validation
    const urlFields = ['logo', 'profile_logo', 'favicon', 'facebookUrl', 'instagramUrl', 'twitterUrl', 'githubUrl', 'skypeUrl']
    urlFields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string
      if (value && !isValidUrl(value)) {
        errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a valid URL`)
      }
    })
    
    // Color validation
    const colorFields = ['globalTextColor', 'globalBgColor', 'globalHighlightColor', 'title_color']
    colorFields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string
      if (value && !isValidColor(value)) {
        errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a valid color (hex, gradient, or CSS color name)`)
      }
    })
    
    // WhatsApp number validation
    if (formData.whatsappNumber && !isValidPhoneNumber(formData.whatsappNumber)) {
      errors.push('WhatsApp number must be a valid phone number')
    }
    
    return errors
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isValidColor = (color: string) => {
    // Allow hex colors (#fff, #ffffff)
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    
    // Allow linear gradients (basic validation)
    const gradientPattern = /^linear-gradient\(.*\)$/
    
    // Allow CSS color names (basic validation)
    const cssColorPattern = /^[a-zA-Z]+$/
    
    return hexPattern.test(color) || gradientPattern.test(color) || cssColorPattern.test(color)
  }

  const isValidPhoneNumber = (phone: string) => {
    return /^\+?[\d\s\-\(\)]{10,}$/.test(phone)
  }

  const handleSave = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      const communityId = community?.id
      
      if (!communityId) {
        toast({
          title: 'Error',
          description: 'No community found. Please ensure you are logged in.',
          variant: 'destructive',
        })
        return
      }
      
      // Update community name if changed
      if (formData.communityName !== community?.ident) {
        await CommunityService.updateCommunity(communityId, {
          name: formData.communityName,
        })
      }
      
      // Save marketplace configuration
      const result = await LandingPageService.updateMarketplaceConfiguration(communityId, {
        title: formData.title,
        logo: formData.logo,
        profile_logo: formData.profile_logo,
        favicon: formData.favicon,
        title_color: formData.title_color,
        global_text_color: formData.globalTextColor,
        global_bg_color: formData.globalBgColor,
        global_highlight_color: formData.globalHighlightColor,
        available_locale: formData.available_locale,
        available_currency: formData.available_currency,
        facebook_url: formData.facebookUrl,
        instagram_url: formData.instagramUrl,
        twitter_url: formData.twitterUrl,
        github_url: formData.githubUrl,
        skype_url: formData.skypeUrl,
        whatsapp_number: formData.whatsappNumber,
        enable_whatsapp_bot: formData.enable_whatsapp_bot,
        copyright: formData.copyright,
        notification: formData.notification,
        cookie_text: formData.cookie_text,
      } as any) // Temporary type assertion until shared types are updated

      // Save topbar colors
      await NavigationService.updateTopbarColors(communityId, {
        background_color: formData.topbarBackgroundColor,
        text_color: formData.topbarTextColor,
        link_color: formData.topbarLinkColor,
        hover_color: formData.topbarHoverColor,
      })

      // Save footer colors
      await NavigationService.updateFooterColors(communityId, {
        background_color: formData.footerBackgroundColor,
        text_color: formData.footerTextColor,
        link_color: formData.footerLinkColor,
        hover_color: formData.footerHoverColor,
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

  if (communityLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  if (communityError || error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Settings</h2>
        <p className="text-gray-600">
          {communityError ? 'Failed to load community data' : 'Failed to load community settings'}
        </p>
        {communityError && (
          <p className="text-sm text-gray-500 mt-2">
            Make sure you're accessing the correct domain for your community.
          </p>
        )}
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
                value={formData.communityName}
                onChange={(e) => handleInputChange('communityName', e.target.value)}
                placeholder="Enter community name"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">This will be displayed as your community identifier</p>
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

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Languages className="h-5 w-5 mr-2" />
            Localization
          </CardTitle>
          <CardDescription>Set your community's language and currency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="locale">Default Language</Label>
              <Select value={formData.available_locale} onValueChange={(value) => handleInputChange('available_locale', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LOCALES.map((locale) => (
                    <SelectItem key={locale.value} value={locale.value}>
                      {locale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={formData.available_currency} onValueChange={(value) => handleInputChange('available_currency', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          
          <div className="space-y-4">
            {/* Logo Upload */}
            <div>
              <Label>Logo</Label>
              <div className="mt-1 space-y-2">
                <Input
                  value={formData.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                <ImageUpload
                  onUploadSuccess={handleImageUpload('logo')}
                  folder="logos"
                  maxFiles={1}
                  maxSizeMB={5}
                  className="max-w-md"
                />
              </div>
            </div>

            {/* Profile Logo Upload */}
            <div>
              <Label>Profile Logo</Label>
              <div className="mt-1 space-y-2">
                <Input
                  value={formData.profile_logo}
                  onChange={(e) => handleInputChange('profile_logo', e.target.value)}
                  placeholder="https://example.com/profile-logo.png"
                />
                <ImageUpload
                  onUploadSuccess={handleImageUpload('profile_logo')}
                  folder="profile-logos"
                  maxFiles={1}
                  maxSizeMB={5}
                  className="max-w-md"
                />
              </div>
            </div>

            {/* Favicon Upload */}
            <div>
              <Label>Favicon</Label>
              <div className="mt-1 space-y-2">
                <Input
                  value={formData.favicon}
                  onChange={(e) => handleInputChange('favicon', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
                <ImageUpload
                  onUploadSuccess={handleImageUpload('favicon')}
                  folder="favicons"
                  maxFiles={1}
                  maxSizeMB={2}
                  acceptedTypes={['image/png', 'image/ico', 'image/x-icon']}
                  className="max-w-md"
                />
              </div>
            </div>
          </div>

          {/* Color Combinations */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">Quick Color Themes</Label>
              <p className="text-sm text-gray-600 mt-1">Choose from professionally designed color combinations</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {COLOR_COMBINATIONS.map((combination, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => applyColorCombination(combination)}
                >
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 group-hover:shadow-lg">
                    {/* Color Preview */}
                    <div className="h-16 flex">
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: combination.colors.globalBgColor }}
                      />
                      <div 
                        className="w-8"
                        style={{ backgroundColor: combination.colors.globalHighlightColor }}
                      />
                    </div>
                    
                    {/* Color Swatches */}
                    <div className="h-6 flex">
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: combination.colors.globalTextColor }}
                      />
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: combination.colors.title_color }}
                      />
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: combination.colors.globalHighlightColor }}
                      />
                    </div>
                    
                    {/* Label */}
                    <div className="p-3 bg-white">
                      <h4 className="font-medium text-sm text-gray-900">{combination.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{combination.description}</p>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <Palette className="h-4 w-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Color Themes */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">Navigation Color Themes</Label>
              <p className="text-sm text-gray-600 mt-1">Beautiful color combinations for your topbar and footer</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {NAVIGATION_COLOR_THEMES.map((theme, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => applyNavigationColorTheme(theme)}
                >
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 group-hover:shadow-lg">
                    {/* Topbar Preview */}
                    <div className="h-8 flex">
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: theme.topbar.background_color }}
                      />
                      <div 
                        className="w-6"
                        style={{ backgroundColor: theme.topbar.link_color }}
                      />
                    </div>
                    
                    {/* Footer Preview */}
                    <div className="h-8 flex">
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: theme.footer.background_color }}
                      />
                      <div 
                        className="w-6"
                        style={{ backgroundColor: theme.footer.link_color }}
                      />
                    </div>
                    
                    {/* Color Swatches */}
                    <div className="h-4 flex">
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: theme.topbar.text_color }}
                      />
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: theme.topbar.hover_color }}
                      />
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: theme.footer.text_color }}
                      />
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: theme.footer.hover_color }}
                      />
                    </div>
                    
                    {/* Label */}
                    <div className="p-3 bg-white">
                      <h4 className="font-medium text-sm text-gray-900">{theme.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <Globe className="h-4 w-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or customize individual colors</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorPicker
              label="Text Color"
              value={formData.globalTextColor}
              onChange={(color) => handleInputChange('globalTextColor', color)}
              placeholder="#000000"
            />
            
            <ColorPicker
              label="Background Color"
              value={formData.globalBgColor}
              onChange={(color) => handleInputChange('globalBgColor', color)}
              placeholder="#ffffff"
            />
            
            <ColorPicker
              label="Highlight Color"
              value={formData.globalHighlightColor}
              onChange={(color) => handleInputChange('globalHighlightColor', color)}
              placeholder="#3b82f6"
            />

            <ColorPicker
              label="Title Color"
              value={formData.title_color}
              onChange={(color) => handleInputChange('title_color', color)}
              placeholder="#000000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Navigation Colors
          </CardTitle>
          <CardDescription>Customize the appearance of your topbar and footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topbar Colors */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Topbar Colors</h3>
              <p className="text-sm text-gray-600 mb-4">Customize the colors for your site's top navigation bar</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorPicker
                label="Topbar Background Color"
                value={formData.topbarBackgroundColor}
                onChange={(color) => handleInputChange('topbarBackgroundColor', color)}
                placeholder="#ffffff"
              />
              
              <ColorPicker
                label="Topbar Text Color"
                value={formData.topbarTextColor}
                onChange={(color) => handleInputChange('topbarTextColor', color)}
                placeholder="#000000"
              />
              
              <ColorPicker
                label="Topbar Link Color"
                value={formData.topbarLinkColor}
                onChange={(color) => handleInputChange('topbarLinkColor', color)}
                placeholder="#3b82f6"
              />
              
              <ColorPicker
                label="Topbar Hover Color"
                value={formData.topbarHoverColor}
                onChange={(color) => handleInputChange('topbarHoverColor', color)}
                placeholder="#1d4ed8"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Footer Colors</span>
            </div>
          </div>

          {/* Footer Colors */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Footer Colors</h3>
              <p className="text-sm text-gray-600 mb-4">Customize the colors for your site's footer</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorPicker
                label="Footer Background Color"
                value={formData.footerBackgroundColor}
                onChange={(color) => handleInputChange('footerBackgroundColor', color)}
                placeholder="#f8fafc"
              />
              
              <ColorPicker
                label="Footer Text Color"
                value={formData.footerTextColor}
                onChange={(color) => handleInputChange('footerTextColor', color)}
                placeholder="#374151"
              />
              
              <ColorPicker
                label="Footer Link Color"
                value={formData.footerLinkColor}
                onChange={(color) => handleInputChange('footerLinkColor', color)}
                placeholder="#3b82f6"
              />
              
              <ColorPicker
                label="Footer Hover Color"
                value={formData.footerHoverColor}
                onChange={(color) => handleInputChange('footerHoverColor', color)}
                placeholder="#1d4ed8"
              />
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
              <Label htmlFor="skype">Skype URL</Label>
              <Input
                id="skype"
                value={formData.skypeUrl}
                onChange={(e) => handleInputChange('skypeUrl', e.target.value)}
                placeholder="https://skype.com/yourpage"
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
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="whatsapp-bot"
              checked={formData.enable_whatsapp_bot}
              onCheckedChange={(checked) => handleInputChange('enable_whatsapp_bot', checked)}
            />
            <Label htmlFor="whatsapp-bot">Enable WhatsApp Bot</Label>
          </div>
        </CardContent>
      </Card>

      {/* Content & Legal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Content & Legal
          </CardTitle>
          <CardDescription>Manage notifications, copyright, and legal text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notification">Notification Text</Label>
            <Textarea
              id="notification"
              value={formData.notification}
              onChange={(e) => handleInputChange('notification', e.target.value)}
              placeholder="Enter notification text to display to users..."
              className="mt-1"
              rows={3}
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
          
          <div>
            <Label htmlFor="cookie-text">Cookie Consent Text</Label>
            <Textarea
              id="cookie-text"
              value={formData.cookie_text}
              onChange={(e) => handleInputChange('cookie_text', e.target.value)}
              placeholder="Enter cookie consent text..."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>


      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your branding and navigation will look</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navigation Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation Preview</h3>
            
            {/* Topbar Preview */}
            <div 
              className="p-4 rounded-t-lg border border-b-0"
              style={{ 
                backgroundColor: formData.topbarBackgroundColor || '#ffffff',
                color: formData.topbarTextColor || '#000000'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {formData.logo && (
                    <img 
                      src={formData.logo} 
                      alt="Logo" 
                      className="h-6 w-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <span 
                    className="text-lg font-bold"
                    style={{ color: formData.topbarTextColor || '#000000' }}
                  >
                    {formData.title || 'Your Site Title'}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <span 
                    className="text-sm"
                    style={{ color: formData.topbarLinkColor || '#374151' }}
                  >
                    Home
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: formData.topbarLinkColor || '#374151' }}
                  >
                    About
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: formData.topbarLinkColor || '#374151' }}
                  >
                    Contact
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer Preview */}
            <div 
              className="p-4 rounded-b-lg border"
              style={{ 
                backgroundColor: formData.footerBackgroundColor || '#f8fafc',
                color: formData.footerTextColor || '#374151'
              }}
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 
                    className="font-semibold mb-2"
                    style={{ color: formData.footerTextColor || '#374151' }}
                  >
                    Quick Links
                  </h4>
                  <div className="space-y-1">
                    <div 
                      className="text-sm"
                      style={{ color: formData.footerLinkColor || '#6b7280' }}
                    >
                      Home
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: formData.footerLinkColor || '#6b7280' }}
                    >
                      About
                    </div>
                  </div>
                </div>
                <div>
                  <h4 
                    className="font-semibold mb-2"
                    style={{ color: formData.footerTextColor || '#374151' }}
                  >
                    Support
                  </h4>
                  <div className="space-y-1">
                    <div 
                      className="text-sm"
                      style={{ color: formData.footerLinkColor || '#6b7280' }}
                    >
                      Help
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: formData.footerLinkColor || '#6b7280' }}
                    >
                      Contact
                    </div>
                  </div>
                </div>
                <div>
                  <p 
                    className="text-xs"
                    style={{ color: formData.footerTextColor || '#6b7280' }}
                  >
                    © 2025 {formData.title || 'Your Site'}. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Content Preview</h3>
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
                <h3 
                  className="text-xl font-bold"
                  style={{ color: formData.title_color || formData.globalTextColor || '#000000' }}
                >
                  {formData.title || 'Your Site Title'}
                </h3>
              </div>
              <p className="text-sm mb-4">
                This is how your site title and colors will appear to visitors.
              </p>
              {formData.notification && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                  <p className="text-sm text-yellow-800">{formData.notification}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <Button 
                  size="sm"
                  style={{ 
                    backgroundColor: formData.globalHighlightColor || '#3b82f6',
                    borderColor: formData.globalHighlightColor || '#3b82f6'
                  }}
                >
                  Sample Button
                </Button>
                <Button size="sm" variant="outline">
                  Secondary Button
                </Button>
              </div>
              {formData.copyright && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">{formData.copyright}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}