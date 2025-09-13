class Topbar < ApplicationRecord
  belongs_to :community

  # Validations
  validates :navigation, presence: true
  validates :profile, presence: true

  # Default values (using jsonb to match migrations)
  attribute :is_multilingual, :boolean, default: false
  attribute :navigation, :jsonb, default: {}
  attribute :profile, :jsonb, default: {}

  # Instance methods
  def navigation_items
    # Handle both array format and object format
    if navigation.is_a?(Array)
      navigation
    else
      navigation['items'] || []
    end
  end

  def profile_settings
    # Handle both array format and object format
    if profile.is_a?(Array)
      profile
    else
      profile['settings'] || {}
    end
  end

  def show_language_selector?
    is_multilingual
  end
end
