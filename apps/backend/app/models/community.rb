class Community < ApplicationRecord
  # Validations
  validates :uuid, presence: true, uniqueness: true
  validates :ident, presence: true, uniqueness: true
  validates :domain, presence: true, uniqueness: true
  validates :locale, presence: true, length: { maximum: 10 }
  validates :currency, presence: true, length: { maximum: 10 }
  validates :country, presence: true
  validates :person_id, presence: true, uniqueness: true

  # Default values
  attribute :use_domain, :boolean, default: false
  attribute :is_enabled, :boolean, default: true
  attribute :locale, :string, default: 'en'
  attribute :currency, :string, default: 'USD'
  attribute :country, :string, default: 'US'

  # Relationships
  has_many :users, dependent: :destroy
  has_one :marketplace_configuration, dependent: :destroy
  has_one :landing_page, dependent: :destroy
  has_one :topbar, dependent: :destroy
  has_one :footer, dependent: :destroy
  has_many :content_pages, dependent: :destroy
  has_many :contacts, dependent: :destroy
  has_many :community_translations, dependent: :destroy

  # Callbacks
  before_validation :generate_uuid, on: :create
  before_validation :generate_ident, on: :create

  # Instance methods
  def display_name
    ident.humanize
  end

  def active?
    is_enabled
  end

  private

  def generate_uuid
    self.uuid ||= SecureRandom.uuid
  end

  def generate_ident
    self.ident ||= domain&.gsub(/[^a-zA-Z0-9]/, '_')&.downcase
  end
end
