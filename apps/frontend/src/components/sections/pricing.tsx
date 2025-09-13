'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star } from 'lucide-react'

interface PricingFeature {
  name: string
  included: boolean
  highlight?: boolean
}

interface PricingPlan {
  id: string
  name: string
  price: number
  period: 'monthly' | 'yearly'
  description: string
  features: PricingFeature[]
  popular?: boolean
  buttonText?: string
  buttonVariant?: 'default' | 'outline'
}

interface PricingProps {
  id: string
  title?: string
  subtitle?: string
  plans: PricingPlan[]
  showToggle?: boolean
}

export const Pricing: React.FC<PricingProps> = ({
  title = 'Simple, Transparent Pricing',
  subtitle = 'Choose the plan that\'s right for your community',
  plans,
  showToggle = true,
}) => {
  const [isYearly, setIsYearly] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const getDisplayPrice = (plan: PricingPlan) => {
    if (isYearly && plan.period === 'yearly') {
      return plan.price
    }
    if (!isYearly && plan.period === 'monthly') {
      return plan.price
    }
    // Convert between periods
    if (isYearly && plan.period === 'monthly') {
      return plan.price * 12
    }
    if (!isYearly && plan.period === 'yearly') {
      return Math.round(plan.price / 12)
    }
    return plan.price
  }

  const getPeriodText = () => {
    return isYearly ? 'year' : 'month'
  }

  const getSavings = (plan: PricingPlan) => {
    if (isYearly && plan.period === 'monthly') {
      return Math.round((plan.price * 12 - plan.price * 10) / (plan.price * 12) * 100)
    }
    return 0
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Billing Toggle */}
        {showToggle && (
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-900 p-1 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !isYearly
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isYearly
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const displayPrice = getDisplayPrice(plan)
            const savings = getSavings(plan)

            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 ${
                  plan.popular
                    ? 'ring-2 ring-blue-500 scale-105'
                    : 'hover:scale-105'
                } ${
                  hoveredPlan === plan.id ? 'shadow-2xl' : 'shadow-lg'
                }`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${displayPrice}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        /{getPeriodText()}
                      </span>
                    </div>
                    {savings > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save {savings}% with yearly billing
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 ${
                          feature.highlight ? 'font-medium' : ''
                        }`}
                      >
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full ${
                      plan.buttonVariant === 'outline'
                        ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                        : ''
                    }`}
                    variant={plan.buttonVariant || 'default'}
                  >
                    {plan.buttonText || 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View all features
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Contact sales
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
