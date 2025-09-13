'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Shield, 
  Users, 
  Globe, 
  BarChart3, 
  Settings,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  category?: string
  highlighted?: boolean
  benefits?: string[]
}

interface FeaturesProps {
  id: string
  title?: string
  subtitle?: string
  features: Feature[]
  layout?: 'grid' | 'list' | 'cards'
  showCategories?: boolean
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Zap,
  Shield,
  Users,
  Globe,
  BarChart3,
  Settings,
}

export const Features: React.FC<FeaturesProps> = ({
  title = 'Powerful Features',
  subtitle = 'Everything you need to build and grow your community',
  features,
  layout = 'grid',
  showCategories = false,
}) => {
  const categories = [...new Set(features.map(f => f.category).filter(Boolean))]

  const renderFeatureCard = (feature: Feature) => {
    const IconComponent = iconMap[feature.icon] || Zap

    return (
      <Card 
        key={feature.id} 
        className={`h-full transition-all duration-300 hover:shadow-lg ${
          feature.highlighted ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' : ''
        }`}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconComponent className="h-6 w-6 text-blue-600" />
            </div>
            {feature.highlighted && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Popular
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {feature.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {feature.description}
          </p>
          
          {feature.benefits && feature.benefits.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Key Benefits:
              </h4>
              <ul className="space-y-1">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-2">
            <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
              Learn more
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderFeatureList = (feature: Feature) => {
    const IconComponent = iconMap[feature.icon] || Zap

    return (
      <div key={feature.id} className="flex items-start space-x-4 p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
          <IconComponent className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            {feature.highlighted && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Popular
              </Badge>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {feature.description}
          </p>
          {feature.benefits && feature.benefits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {feature.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Category Filter */}
        {showCategories && categories.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="cursor-pointer">
                All Features
              </Badge>
              {categories.map((category) => (
                <Badge key={category} variant="outline" className="cursor-pointer hover:bg-gray-100">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Features Content */}
        {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(renderFeatureCard)}
          </div>
        )}

        {layout === 'list' && (
          <div className="space-y-4">
            {features.map(renderFeatureList)}
          </div>
        )}

        {layout === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map(renderFeatureCard)}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to get started?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of communities already using our platform to build amazing experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
