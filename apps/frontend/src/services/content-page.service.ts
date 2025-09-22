import { LandingPageSection } from '@mysaasproject/shared'

export interface ContentPage {
  id: number
  title: string
  end_point: string
  data: {
    sections?: LandingPageSection[]
  }
  meta_data: {
    title?: string
    description?: string
    keywords?: string[]
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateContentPageData {
  title: string
  end_point: string
  meta_data: {
    title?: string
    description?: string
    keywords?: string[]
  }
  data: {
    sections?: LandingPageSection[]
  }
  is_active: boolean
}

export interface UpdateContentPageData {
  title?: string
  end_point?: string
  meta_data?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  data?: {
    sections?: LandingPageSection[]
  }
  is_active?: boolean
}

export class ContentPageService {
  private static getApiBaseUrl() {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1`
  }

  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  static async getContentPages(communityId: number, options: {
    activeOnly?: boolean
    endPoint?: string
  } = {}): Promise<ContentPage[]> {
    const params = new URLSearchParams()
    if (options.activeOnly) params.append('active_only', 'true')
    if (options.endPoint) params.append('end_point', options.endPoint)

    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/content_pages?${params.toString()}`,
      {
        headers: this.getAuthHeaders()
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch content pages')
    }

    const data = await response.json()
    return data.data || []
  }

  static async getContentPage(communityId: number, pageId: number): Promise<ContentPage> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/content_pages/${pageId}`,
      {
        headers: this.getAuthHeaders()
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch content page')
    }

    const data = await response.json()
    return data.data
  }

  static async createContentPage(communityId: number, data: CreateContentPageData): Promise<ContentPage> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/content_pages`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          content_page: data
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to create content page')
    }

    const result = await response.json()
    return result.data
  }

  static async updateContentPage(communityId: number, pageId: number, data: UpdateContentPageData): Promise<ContentPage> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/content_pages/${pageId}`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          content_page: data
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update content page')
    }

    const result = await response.json()
    return result.data
  }

  static async deleteContentPage(communityId: number, pageId: number): Promise<void> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/content_pages/${pageId}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete content page')
    }
  }

  static async updateContentPageSections(communityId: number, pageId: number, sections: LandingPageSection[]): Promise<ContentPage> {
    return this.updateContentPage(communityId, pageId, {
      data: { sections }
    })
  }
}
