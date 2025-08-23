class LandingPage < ApplicationRecord
  belongs_to :community

  # Validations
  validates :meta_data, presence: true
  validates :content, presence: true

  # Default values (using jsonb to match migrations)
  attribute :meta_data, :jsonb, default: {}
  attribute :content, :jsonb, default: {}

  # Instance methods
  def title
    meta_data['title'] || community.display_name
  end

  def description
    meta_data['description'] || ''
  end

  def keywords
    meta_data['keywords'] || []
  end
end
