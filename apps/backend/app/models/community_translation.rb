class CommunityTranslation < ApplicationRecord
  belongs_to :community

  # Validations
  validates :locale, presence: true, length: { maximum: 10 }
  validates :translation, presence: true
  validates :translation_key, presence: true
  validates :translation_key, uniqueness: { scope: [:community_id, :locale] }

  # Scopes
  scope :by_locale, ->(locale) { where(locale: locale) }
  scope :by_key, ->(key) { where(translation_key: key) }

  # Instance methods
  def localized_key
    "#{locale}.#{translation_key}"
  end

  def self.find_translation(community_id, locale, key)
    find_by(community_id: community_id, locale: locale, translation_key: key)
  end

  def self.translate(community_id, locale, key, default = nil)
    translation = find_translation(community_id, locale, key)
    translation&.translation || default || key
  end
end
