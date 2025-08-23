class CommunitySerializer < ApplicationSerializer
  private

  def serialize_single(community)
    {
      id: community.id,
      uuid: community.uuid,
      ident: community.ident,
      domain: community.domain,
      use_domain: community.use_domain,
      is_enabled: community.is_enabled,
      locale: community.locale,
      currency: community.currency,
      country: community.country,
      display_name: community.display_name,
      active: community.active?,
      created_at: community.created_at,
      updated_at: community.updated_at,
      
      # Include related data if requested
      marketplace_configuration: include_marketplace_configuration(community),
      landing_page: include_landing_page(community),
      topbar: include_topbar(community),
      footer: include_footer(community),
      stats: build_stats(community)
    }.compact
  end

  def include_marketplace_configuration(community)
    return nil unless @options[:include_marketplace_configuration]
    return nil unless community.marketplace_configuration
    
    MarketplaceConfigurationSerializer.new(community.marketplace_configuration).send(:serialize_single, community.marketplace_configuration)
  end

  def include_landing_page(community)
    return nil unless @options[:include_landing_page]
    return nil unless community.landing_page
    
    LandingPageSerializer.new(community.landing_page).send(:serialize_single, community.landing_page)
  end

  def include_topbar(community)
    return nil unless @options[:include_topbar]
    return nil unless community.topbar
    
    TopbarSerializer.new(community.topbar).send(:serialize_single, community.topbar)
  end

  def include_footer(community)
    return nil unless @options[:include_footer]
    return nil unless community.footer
    
    FooterSerializer.new(community.footer).send(:serialize_single, community.footer)
  end

  def build_stats(community)
    return nil unless @options[:include_stats]
    
    {
      users_count: community.users.count,
      content_pages_count: community.content_pages.count,
      contacts_count: community.contacts.count,
      translations_count: community.community_translations.count
    }
  end
end
