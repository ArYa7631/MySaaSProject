import { apiClientMethods } from '@/lib/api-client'
import { LandingPageSection, MarketplaceConfiguration } from '@mysaasproject/shared'

export class LandingPageService {
  static async getSections(communityId: number): Promise<LandingPageSection[]> {
    console.log('LandingPageService.getSections - Community ID:', communityId)
    const response = await apiClientMethods.get<{ landing_page: { sections: LandingPageSection[] } }>(
      `/communities/${communityId}/landing_page`
    )
    console.log('LandingPageService.getSections - Response:', response)
    // The API returns sections in the landing_page.sections property
    return response.data.landing_page?.sections || []
  }

  static async getMarketplaceConfiguration(communityId: number): Promise<MarketplaceConfiguration> {
    const response = await apiClientMethods.get<{ marketplace_configuration: MarketplaceConfiguration }>(
      `/communities/${communityId}/marketplace_configuration`
    )
    return response.data.marketplace_configuration || response.data
  }

  static async updateSections(communityId: number, sections: LandingPageSection[]): Promise<void> {
    console.log('LandingPageService.updateSections - Community ID:', communityId)
    console.log('LandingPageService.updateSections - Sections:', sections)
    const response = await apiClientMethods.put(`/communities/${communityId}/landing_page`, {
      landing_page: {
        sections: sections
      }
    })
    console.log('LandingPageService.updateSections - Response:', response)
  }

  static async updateMarketplaceConfiguration(
    communityId: number, 
    config: Partial<MarketplaceConfiguration>
  ): Promise<MarketplaceConfiguration> {
    const response = await apiClientMethods.put<MarketplaceConfiguration>(
      `/communities/${communityId}/marketplace_configuration`,
      config
    )
    return response.data
  }
}
