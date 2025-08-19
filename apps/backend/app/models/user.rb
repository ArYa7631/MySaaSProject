class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  # Associations
  has_many :jwt_denylist, dependent: :destroy

  # Instance methods
  def as_json(options = {})
    super(options.merge(except: [:encrypted_password, :reset_password_token, :reset_password_sent_at]))
  end
end


