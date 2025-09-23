'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Users, 
  Globe, 
  Settings, 
  FileText, 
  BarChart3, 
  Eye,
  Edit,
  Plus
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, community } = useAuth()

  const stats = [
    {
      title: 'Community',
      value: community?.ident || 'Not set',
      icon: Users,
      description: 'Your community name',
      color: 'text-blue-600',
    },
    {
      title: 'Domain',
      value: community?.domain || 'Not set',
      icon: Globe,
      description: 'Your custom domain',
      color: 'text-green-600',
    },
    {
      title: 'Status',
      value: community?.is_enabled ? 'Active' : 'Inactive',
      icon: Settings,
      description: 'Community status',
      color: community?.is_enabled ? 'text-green-600' : 'text-red-600',
    },
  ]

  const quickActions = [
    {
      title: 'Landing Page',
      description: 'Customize your landing page sections',
      href: '/admin/landing-page',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Navigation',
      description: 'Manage topbar and footer navigation',
      href: '/admin/navigation',
      icon: Globe,
      color: 'bg-indigo-500',
    },
    {
      title: 'Content Pages',
      description: 'Create and manage custom pages',
      href: '/admin/content-pages',
      icon: FileText,
      color: 'bg-teal-500',
    },
    {
      title: 'Settings',
      description: 'Manage community settings and branding',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-green-500',
    },
    {
      title: 'View Site',
      description: 'Preview your landing page',
      href: '/landing',
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      title: 'Analytics',
      description: 'View community analytics and insights',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.first_name || user?.email}!</h1>
        <p className="text-gray-600 mt-2">
          {user?.admin ? 'Admin' : 'Member'} of {community?.ident || 'your community'} • Manage your community and customize your landing page
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {action.title}
                    </CardTitle>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Community Activity</CardTitle>
            <CardDescription>Recent updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Edit className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Community created</p>
                  <p className="text-xs text-gray-500">
                    {community?.ident || 'Your community'} was created
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Account activated</p>
                  <p className="text-xs text-gray-500">
                    Your account is now active and ready to use
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Complete these steps to set up your community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Create your account</p>
                  <p className="text-xs text-gray-500">Account successfully created</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Community created</p>
                  <p className="text-xs text-gray-500">Your community "{community?.ident}" is ready with a beautiful landing page</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Customize your landing page</p>
                  <p className="text-xs text-gray-500">Add sections and content to your landing page</p>
                </div>
                <Link href="/admin/landing-page">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">4</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Configure settings</p>
                  <p className="text-xs text-gray-500">Set up your community branding and preferences</p>
                </div>
                <Link href="/admin/settings">
                  <Button size="sm" variant="outline">Configure</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
