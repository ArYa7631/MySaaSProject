export interface NavigationItem {
  id: string
  name: string
  url: string
  isExternal: boolean
  order: number
}

export interface FooterSection {
  id: string
  label: string
  links: NavigationItem[]
}

export interface TopbarData {
  navigation: {
    items: NavigationItem[]
  }
  profile: any
  is_multilingual: boolean
  background_color?: string
  text_color?: string
  link_color?: string
  hover_color?: string
}

export interface FooterData {
  sections: FooterSection[]
  background_color?: string
  text_color?: string
  link_color?: string
  hover_color?: string
}

export class NavigationService {
  private static getApiBaseUrl() {
    // NEXT_PUBLIC_API_URL already includes /api/v1
    return '/api/v1'
  }

  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  static async getTopbar(communityId: number): Promise<TopbarData | null> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/topbar`,
      {
        headers: this.getAuthHeaders()
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch topbar')
    }

    const data = await response.json()
    return data.data
  }

  static async updateTopbar(communityId: number, data: TopbarData): Promise<TopbarData> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/topbar`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          topbar: data
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Topbar update failed:', response.status, errorText)
      throw new Error(`Failed to update topbar: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return result.data
  }

  static async createTopbar(communityId: number, data: TopbarData): Promise<TopbarData> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/topbar`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          topbar: data
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to create topbar')
    }

    const result = await response.json()
    return result.data
  }

  static async getFooter(communityId: number): Promise<FooterData | null> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/footer`,
      {
        headers: this.getAuthHeaders()
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch footer')
    }

    const data = await response.json()
    return data.data
  }

  static async updateFooter(communityId: number, data: FooterData): Promise<FooterData> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/footer`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          footer: data
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Footer update failed:', response.status, errorText)
      throw new Error(`Failed to update footer: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return result.data
  }

  static async createFooter(communityId: number, data: FooterData): Promise<FooterData> {
    const response = await fetch(
      `${this.getApiBaseUrl()}/communities/${communityId}/footer`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          footer: data
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to create footer')
    }

    const result = await response.json()
    return result.data
  }

  static async updateTopbarNavigation(communityId: number, items: NavigationItem[]): Promise<TopbarData> {
    // First get existing topbar data
    const existingTopbar = await this.getTopbar(communityId)
    
    const topbarData: TopbarData = {
      navigation: { items },
      profile: existingTopbar?.profile || {},
      is_multilingual: existingTopbar?.is_multilingual || false
    }

    if (existingTopbar) {
      return this.updateTopbar(communityId, topbarData)
    } else {
      return this.createTopbar(communityId, topbarData)
    }
  }

  static async updateFooterSections(communityId: number, sections: FooterSection[]): Promise<FooterData> {
    // First get existing footer data
    const existingFooter = await this.getFooter(communityId)
    
    const footerData: FooterData = {
      sections
    }

    if (existingFooter) {
      return this.updateFooter(communityId, footerData)
    } else {
      return this.createFooter(communityId, footerData)
    }
  }

  static async updateTopbarColors(communityId: number, colors: {
    background_color?: string
    text_color?: string
    link_color?: string
    hover_color?: string
  }): Promise<TopbarData> {
    // First get existing topbar data
    const existingTopbar = await this.getTopbar(communityId)
    
    const topbarData: TopbarData = {
      navigation: existingTopbar?.navigation || { items: [] },
      profile: existingTopbar?.profile || {},
      is_multilingual: existingTopbar?.is_multilingual || false,
      ...colors
    }

    if (existingTopbar) {
      return this.updateTopbar(communityId, topbarData)
    } else {
      return this.createTopbar(communityId, topbarData)
    }
  }

  static async updateFooterColors(communityId: number, colors: {
    background_color?: string
    text_color?: string
    link_color?: string
    hover_color?: string
  }): Promise<FooterData> {
    // First get existing footer data
    const existingFooter = await this.getFooter(communityId)
    
    const footerData: FooterData = {
      sections: existingFooter?.sections || [],
      ...colors
    }

    if (existingFooter) {
      return this.updateFooter(communityId, footerData)
    } else {
      return this.createFooter(communityId, footerData)
    }
  }
}
