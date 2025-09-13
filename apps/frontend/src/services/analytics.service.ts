import { apiClientMethods } from '@/lib/api-client'

export interface AnalyticsMetrics {
  page_views: number
  unique_visitors: number
  bounce_rate: number
  avg_session_duration: number
  conversion_rate: number
  top_pages: Array<{
    path: string
    views: number
    unique_visitors: number
  }>
  traffic_sources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  device_types: Array<{
    device: string
    visitors: number
    percentage: number
  }>
}

export interface UserActivity {
  id: number
  user_id: number
  action: string
  resource_type: string
  resource_id: number
  metadata: Record<string, any>
  created_at: string
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
}

export interface CommunityGrowth {
  date: string
  new_members: number
  active_members: number
  total_members: number
  posts_created: number
  comments_created: number
}

export interface EngagementMetrics {
  total_posts: number
  total_comments: number
  total_reactions: number
  avg_posts_per_user: number
  avg_comments_per_post: number
  most_active_users: Array<{
    user_id: number
    user_name: string
    posts_count: number
    comments_count: number
    total_activity: number
  }>
  top_content: Array<{
    id: number
    title: string
    type: string
    views: number
    reactions: number
    comments: number
  }>
}

export interface AnalyticsFilters {
  start_date?: string
  end_date?: string
  metrics?: string[]
  group_by?: 'day' | 'week' | 'month'
  community_id?: number
}

export class AnalyticsService {
  // Get community analytics overview
  static async getCommunityAnalytics(
    communityId: number,
    filters: AnalyticsFilters = {}
  ): Promise<AnalyticsMetrics> {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','))
        } else {
          params.append(key, String(value))
        }
      }
    })

    const response = await apiClientMethods.get<AnalyticsMetrics>(
      `/analytics/communities/${communityId}?${params}`
    )
    return response.data
  }

  // Get user activity
  static async getUserActivity(
    communityId: number,
    page: number = 1,
    perPage: number = 20,
    filters: {
      user_id?: number
      action?: string
      resource_type?: string
      start_date?: string
      end_date?: string
    } = {}
  ): Promise<{ data: UserActivity[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value))
      }
    })

    const response = await apiClientMethods.get<{ data: UserActivity[]; pagination: any }>(
      `/analytics/communities/${communityId}/activity?${params}`
    )
    return response.data
  }

  // Get community growth data
  static async getCommunityGrowth(
    communityId: number,
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<CommunityGrowth[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      group_by: groupBy,
    })

    const response = await apiClientMethods.get<CommunityGrowth[]>(
      `/analytics/communities/${communityId}/growth?${params}`
    )
    return response.data
  }

  // Get engagement metrics
  static async getEngagementMetrics(
    communityId: number,
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<EngagementMetrics> {
    const response = await apiClientMethods.get<EngagementMetrics>(
      `/analytics/communities/${communityId}/engagement?period=${period}`
    )
    return response.data
  }

  // Track page view
  static async trackPageView(data: {
    community_id: number
    page_path: string
    user_id?: number
    session_id?: string
    referrer?: string
    user_agent?: string
    ip_address?: string
  }): Promise<void> {
    await apiClientMethods.post('/analytics/track/page-view', data)
  }

  // Track user action
  static async trackUserAction(data: {
    community_id: number
    user_id: number
    action: string
    resource_type: string
    resource_id: number
    metadata?: Record<string, any>
  }): Promise<void> {
    await apiClientMethods.post('/analytics/track/user-action', data)
  }

  // Track conversion
  static async trackConversion(data: {
    community_id: number
    user_id?: number
    conversion_type: string
    value?: number
    metadata?: Record<string, any>
  }): Promise<void> {
    await apiClientMethods.post('/analytics/track/conversion', data)
  }

  // Get real-time analytics
  static async getRealTimeAnalytics(communityId: number): Promise<{
    current_visitors: number
    active_sessions: number
    recent_activity: Array<{
      user_id: number
      user_name: string
      action: string
      timestamp: string
    }>
  }> {
    const response = await apiClientMethods.get(
      `/analytics/communities/${communityId}/realtime`
    )
    return response.data
  }

  // Get export analytics data
  static async exportAnalytics(
    communityId: number,
    format: 'csv' | 'json' | 'xlsx' = 'csv',
    filters: AnalyticsFilters = {}
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
    })
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','))
        } else {
          params.append(key, String(value))
        }
      }
    })

    const response = await apiClientMethods.get(
      `/analytics/communities/${communityId}/export?${params}`,
      {
        responseType: 'blob',
      }
    )
    return response.data
  }

  // Get custom report
  static async getCustomReport(
    communityId: number,
    reportConfig: {
      metrics: string[]
      dimensions: string[]
      filters: Record<string, any>
      sort: Array<{ field: string; direction: 'asc' | 'desc' }>
      limit?: number
    }
  ): Promise<any> {
    const response = await apiClientMethods.post(
      `/analytics/communities/${communityId}/custom-report`,
      reportConfig
    )
    return response.data
  }

  // Get funnel analysis
  static async getFunnelAnalysis(
    communityId: number,
    funnelSteps: string[],
    startDate: string,
    endDate: string
  ): Promise<{
    steps: Array<{
      step: string
      visitors: number
      conversion_rate: number
      drop_off_rate: number
    }>
    total_conversion_rate: number
  }> {
    const response = await apiClientMethods.post(
      `/analytics/communities/${communityId}/funnel`,
      {
        steps: funnelSteps,
        start_date: startDate,
        end_date: endDate,
      }
    )
    return response.data
  }

  // Get cohort analysis
  static async getCohortAnalysis(
    communityId: number,
    cohortType: 'registration' | 'first_action',
    startDate: string,
    endDate: string,
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<{
    cohorts: Array<{
      cohort_date: string
      size: number
      retention: number[]
    }>
  }> {
    const response = await apiClientMethods.get(
      `/analytics/communities/${communityId}/cohort?` +
      `type=${cohortType}&start_date=${startDate}&end_date=${endDate}&period=${period}`
    )
    return response.data
  }
}

export default AnalyticsService
