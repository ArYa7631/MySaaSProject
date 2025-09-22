class ContentPage < ApplicationRecord
  belongs_to :community

  # Validations
  validates :title, presence: true
  validates :end_point, presence: true, uniqueness: { scope: :community_id }
  validates :data, presence: true, allow_blank: true
  validates :meta_data, presence: true, allow_blank: true

  # Default values (using jsonb to match migrations)
  attribute :is_active, :boolean, default: true
  attribute :data, :jsonb, default: {}
  attribute :meta_data, :jsonb, default: {}

  # Scopes
  scope :active, -> { where(is_active: true) }
  scope :by_end_point, ->(end_point) { where(end_point: end_point) }

  # Instance methods
  def slug
    end_point.parameterize
  end

  def page_title
    meta_data['title'] || title
  end

  def page_description
    meta_data['description'] || ''
  end

  def page_keywords
    meta_data['keywords'] || []
  end

  def content_sections
    return [] unless data.is_a?(Hash)
    data['sections'] || []
  end
end
