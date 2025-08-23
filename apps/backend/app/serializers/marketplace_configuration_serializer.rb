class MarketplaceConfigurationSerializer < ApplicationSerializer
  private

  def serialize_single(config)
    {
      id: config.id,
      community_id: config.community_id,
      
      # Theme colors
      global_text_color: config.global_text_color,
      global_bg_color: config.global_bg_color,
      global_highlight_color: config.global_highlight_color,
      title_color: config.title_color,
      
      # Locale and currency
      available_locale: config.available_locale,
      available_currency: config.available_currency,
      
      # Status flags
      is_enabled: config.is_enabled,
      is_super_admin: config.is_super_admin,
      enable_whatsapp_bot: config.enable_whatsapp_bot,
      
      # Branding
      logo: config.logo,
      profile_logo: config.profile_logo,
      favicon: config.favicon,
      title: config.title,
      
      # Content
      notification: config.notification,
      copyright: config.copyright,
      cookie_text: config.cookie_text,
      
      # Contact information
      whatsapp_number: config.whatsapp_number,
      
      # Social media
      social_links: config.social_links,
      has_social_links: config.has_social_links?,
      facebook_url: config.facebook_url,
      instagram_url: config.instagram_url,
      twitter_url: config.twitter_url,
      github_url: config.github_url,
      skype_url: config.skype_url,
      
      # Timestamps
      created_at: config.created_at,
      updated_at: config.updated_at
    }
  end
end
