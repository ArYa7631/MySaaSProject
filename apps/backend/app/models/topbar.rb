class Topbar < ApplicationRecord
  belongs_to :community

  # Validations - allow empty objects but ensure they exist
  validates :navigation, presence: true, allow_blank: true
  validates :profile, presence: true, allow_blank: true

  # Color validations
  validates :background_color, format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z|\Alinear-gradient\(.*\)\z|\A[a-zA-Z]+\z/, message: "must be a valid color (hex, gradient, or CSS color name)" }, allow_blank: true
  validates :text_color, format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z|\Alinear-gradient\(.*\)\z|\A[a-zA-Z]+\z/, message: "must be a valid color (hex, gradient, or CSS color name)" }, allow_blank: true
  validates :link_color, format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z|\Alinear-gradient\(.*\)\z|\A[a-zA-Z]+\z/, message: "must be a valid color (hex, gradient, or CSS color name)" }, allow_blank: true
  validates :hover_color, format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z|\Alinear-gradient\(.*\)\z|\A[a-zA-Z]+\z/, message: "must be a valid color (hex, gradient, or CSS color name)" }, allow_blank: true

  # Default values (using jsonb to match migrations)
  attribute :is_multilingual, :boolean, default: false
  attribute :navigation, :jsonb, default: {}
  attribute :profile, :jsonb, default: {}

  # Instance methods
  def navigation_items
    # Handle both array format and object format
    if navigation.is_a?(Array)
      # Convert old format to new format if needed
      navigation.map.with_index do |item, index|
        if item.is_a?(Hash) && item.key?('linkHref')
          # Convert old format to new format
          {
            'id' => "item-#{index}",
            'name' => item['linkTitle'] || 'Untitled',
            'url' => item['linkHref'] || '#',
            'isExternal' => item['linkHref']&.start_with?('http'),
            'order' => index
          }
        else
          # Already in new format or ensure it has required fields
          item.merge(
            'id' => item['id'] || "item-#{index}",
            'order' => item['order'] || index
          )
        end
      end
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
