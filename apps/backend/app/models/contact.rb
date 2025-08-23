class Contact < ApplicationRecord
  belongs_to :community

  # Validations
  validates :message, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_email, ->(email) { where(email: email) }

  # Instance methods
  def full_name
    name.presence || 'Anonymous'
  end

  def contact_info
    [email, contact_number].compact.join(' | ')
  end

  def short_message
    message.truncate(100) if message.present?
  end
end
