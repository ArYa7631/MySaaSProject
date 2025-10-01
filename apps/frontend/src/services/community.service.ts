import { apiClientMethods, PaginatedResponse } from '@/lib/api-client'
import { Community } from '@mysaasproject/shared'

export interface CommunityStats {
  total_members: number
  active_members: number
  total_posts: number
  total_comments: number
  growth_rate: number
  engagement_rate: number
}

export interface CommunitySettings {
  allow_registration: boolean
  require_approval: boolean
  allow_guest_access: boolean
  max_members: number
  auto_approve_posts: boolean
  moderation_enabled: boolean
  email_notifications: boolean
  custom_domain: string
}

export interface CommunityMember {
  id: number
  user_id: number
  community_id: number
  role: 'admin' | 'moderator' | 'member'
  status: 'active' | 'pending' | 'suspended'
  joined_at: string
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
    avatar?: string
  }
}

export interface CreateCommunityRequest {
  name: string
  domain: string
  description?: string
  logo?: File
  settings?: Partial<CommunitySettings>
}

export interface UpdateCommunityRequest {
  name?: string
  description?: string
  logo?: File
  settings?: Partial<CommunitySettings>
}

export class CommunityService {
  // Get all communities (for admin)
  static async getCommunities(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Community>> {
    const response = await apiClientMethods.get<PaginatedResponse<Community>>(`/communities?page=${page}&per_page=${perPage}`)
    return response.data
  }

  // Get community by ID
  static async getCommunity(id: number): Promise<Community> {
    const response = await apiClientMethods.get<Community>(`/communities/${id}`)
    return response.data
  }

  // Get community by domain
  static async getCommunityByDomain(domain: string): Promise<Community> {
    // Use query parameter to avoid Rails format interpretation of .com/.net
    const response = await apiClientMethods.get<Community>(`/communities/by-domain?domain=${encodeURIComponent(domain)}`)
    return response.data
  }

  // Create new community
  static async createCommunity(data: CreateCommunityRequest): Promise<Community> {
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await apiClientMethods.post<Community>('/communities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Update community
  static async updateCommunity(id: number, data: UpdateCommunityRequest): Promise<Community> {
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await apiClientMethods.put<Community>(`/communities/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Delete community
  static async deleteCommunity(id: number): Promise<void> {
    await apiClientMethods.delete(`/communities/${id}`)
  }

  // Get community statistics
  static async getCommunityStats(id: number): Promise<CommunityStats> {
    const response = await apiClientMethods.get<CommunityStats>(`/communities/${id}/stats`)
    return response.data
  }

  // Get community members
  static async getCommunityMembers(
    id: number, 
    page: number = 1, 
    perPage: number = 20,
    role?: string,
    status?: string
  ): Promise<PaginatedResponse<CommunityMember>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    
    if (role) params.append('role', role)
    if (status) params.append('status', status)

    const response = await apiClientMethods.get<PaginatedResponse<CommunityMember>>(`/communities/${id}/members?${params}`)
    return response.data
  }

  // Add member to community
  static async addMember(communityId: number, userId: number, role: string = 'member'): Promise<CommunityMember> {
    const response = await apiClientMethods.post<CommunityMember>(`/communities/${communityId}/members`, {
      user_id: userId,
      role,
    })
    return response.data
  }

  // Update member role
  static async updateMemberRole(communityId: number, memberId: number, role: string): Promise<CommunityMember> {
    const response = await apiClientMethods.put<CommunityMember>(`/communities/${communityId}/members/${memberId}`, {
      role,
    })
    return response.data
  }

  // Remove member from community
  static async removeMember(communityId: number, memberId: number): Promise<void> {
    await apiClientMethods.delete(`/communities/${communityId}/members/${memberId}`)
  }

  // Get community settings
  static async getCommunitySettings(id: number): Promise<CommunitySettings> {
    const response = await apiClientMethods.get<CommunitySettings>(`/communities/${id}/settings`)
    return response.data
  }

  // Update community settings
  static async updateCommunitySettings(id: number, settings: Partial<CommunitySettings>): Promise<CommunitySettings> {
    const response = await apiClientMethods.put<CommunitySettings>(`/communities/${id}/settings`, settings)
    return response.data
  }

  // Check domain availability
  static async checkDomainAvailability(domain: string): Promise<{ available: boolean }> {
    const response = await apiClientMethods.get<{ available: boolean }>(`/communities/domain/check?domain=${encodeURIComponent(domain)}`)
    return response.data
  }

  // Get community activity
  static async getCommunityActivity(
    id: number, 
    page: number = 1, 
    perPage: number = 20,
    type?: string
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    
    if (type) params.append('type', type)

    const response = await apiClientMethods.get(`/communities/${id}/activity?${params}`)
    return response.data
  }

  // Get community analytics
  static async getCommunityAnalytics(
    id: number, 
    startDate: string, 
    endDate: string,
    metrics: string[] = []
  ): Promise<any> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    })
    
    if (metrics.length > 0) {
      params.append('metrics', metrics.join(','))
    }

    const response = await apiClientMethods.get(`/communities/${id}/analytics?${params}`)
    return response.data
  }

  // Export community data
  static async exportCommunityData(id: number, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClientMethods.get(`/communities/${id}/export?format=${format}`, {
      responseType: 'blob',
    })
    return response.data
  }

  // Import community data
  static async importCommunityData(id: number, file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)

    await apiClientMethods.post(`/communities/${id}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Backup community
  static async backupCommunity(id: number): Promise<{ backup_id: string; download_url: string }> {
    const response = await apiClientMethods.post<{ backup_id: string; download_url: string }>(`/communities/${id}/backup`)
    return response.data
  }

  // Restore community from backup
  static async restoreCommunity(id: number, backupId: string): Promise<void> {
    await apiClientMethods.post(`/communities/${id}/restore`, { backup_id: backupId })
  }
}

export default CommunityService
