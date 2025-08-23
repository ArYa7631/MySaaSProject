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
    navigation['items'] || []
  end

  def profile_settings
    profile['settings'] || {}
  end

  def show_language_selector?
    is_multilingual
  end
end
