class MarketplaceConfiguration < ApplicationRecord
  belongs_to :community

  # Validations
  validates :global_text_color, presence: true
  validates :global_bg_color, presence: true
  validates :global_highlight_color, presence: true
  validates :available_locale, presence: true, length: { maximum: 10 }
  validates :available_currency, presence: true
  validates :title, presence: true

  # URL validations (using proper Rails validation)
  validates :facebook_url, format: { with: URI::regexp(%w[http https]), allow_blank: true }
  validates :instagram_url, format: { with: URI::regexp(%w[http https]), allow_blank: true }
  validates :twitter_url, format: { with: URI::regexp(%w[http https]), allow_blank: true }
  validates :github_url, format: { with: URI::regexp(%w[http https]), allow_blank: true }
  validates :skype_url, format: { with: URI::regexp(%w[http https]), allow_blank: true }

  # Default values
  attribute :is_enabled, :boolean, default: true
  attribute :is_super_admin, :boolean, default: false
  attribute :enable_whatsapp_bot, :boolean, default: false
  attribute :available_locale, :string, default: 'en'
  attribute :available_currency, :string, default: 'USD'
  attribute :global_text_color, :string, default: '#000000'
  attribute :global_bg_color, :string, default: '#ffffff'
  attribute :global_highlight_color, :string, default: '#007bff'

  # Instance methods
  def has_social_links?
    facebook_url.present? || instagram_url.present? || twitter_url.present? || github_url.present? || skype_url.present?
  end

  def social_links
    {
      facebook: facebook_url,
      instagram: instagram_url,
      twitter: twitter_url,
      github: github_url,
      skype: skype_url
    }.compact
  end
end
