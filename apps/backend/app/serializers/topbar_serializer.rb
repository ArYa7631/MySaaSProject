class TopbarSerializer < ApplicationSerializer
  private

  def serialize_single(topbar)
    {
      id: topbar.id,
      community_id: topbar.community_id,
      
      # Configuration
      is_multilingual: topbar.is_multilingual,
      show_language_selector: topbar.show_language_selector?,
      
      # Navigation
      navigation: topbar.navigation,
      navigation_items: topbar.navigation_items,
      
      # Profile
      profile: topbar.profile,
      profile_settings: topbar.profile_settings,
      
      # Timestamps
      created_at: topbar.created_at,
      updated_at: topbar.updated_at
    }
  end
end
