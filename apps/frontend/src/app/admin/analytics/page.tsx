'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Calendar,
  Download,
  Filter
} from 'lucide-react'

export default function AnalyticsPage() {
  const { community } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  // Mock analytics data - in real implementation, this would come from API
  const analyticsData = {
    overview: {
      totalVisitors: 1247,
      pageViews: 3842,
      bounceRate: 34.2,
      avgSessionDuration: '2m 34s',
      newVisitors: 892,
      returningVisitors: 355
    },
    topPages: [
      { page: '/', views: 1842, visitors: 892 },
      { page: '/about', views: 456, visitors: 234 },
      { page: '/contact', views: 234, visitors: 123 },
      { page: '/pricing', views: 189, visitors: 98 }
    ],
    trafficSources: [
      { source: 'Direct', visitors: 456, percentage: 36.6 },
      { source: 'Google', visitors: 234, percentage: 18.8 },
      { source: 'Social Media', visitors: 189, percentage: 15.2 },
      { source: 'Referral', visitors: 123, percentage: 9.9 },
      { source: 'Other', visitors: 245, percentage: 19.6 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', visitors: 623, percentage: 50.0 },
      { device: 'Mobile', visitors: 498, percentage: 39.9 },
      { device: 'Tablet', visitors: 126, percentage: 10.1 }
    ],
    recentActivity: [
      { time: '2 minutes ago', action: 'New visitor from Google', type: 'visit' },
      { time: '5 minutes ago', action: 'Contact form submitted', type: 'form' },
      { time: '12 minutes ago', action: 'Page view on /pricing', type: 'visit' },
      { time: '18 minutes ago', action: 'New visitor from Facebook', type: 'visit' },
      { time: '25 minutes ago', action: 'Contact form submitted', type: 'form' }
    ]
  }

  const periodOptions = [
    { value: '1d', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your community's performance and engagement</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              -2.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgSessionDuration}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15.3% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{page.page}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{page.views.toLocaleString()} views</div>
                    <div className="text-sm text-muted-foreground">{page.visitors} visitors</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground">{source.visitors} visitors</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
          <CardDescription>How visitors are accessing your site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData.deviceBreakdown.map((device) => (
              <div key={device.device} className="text-center">
                <div className="text-2xl font-bold">{device.percentage}%</div>
                <div className="text-sm text-muted-foreground">{device.device}</div>
                <div className="text-xs text-muted-foreground">{device.visitors} visitors</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest visitor actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'visit' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{activity.action}</div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
