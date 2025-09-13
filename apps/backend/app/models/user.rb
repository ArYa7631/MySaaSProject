class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :locale, presence: true, length: { maximum: 10 }

  # Associations
  belongs_to :community, optional: true

  # Default values
  attribute :locale, :string, default: 'en'

  # Instance methods
  def as_json(options = {})
    super(options.merge(except: [:encrypted_password, :reset_password_token, :reset_password_sent_at]))
  end

  def full_name
    "#{first_name} #{last_name}".strip
  end

  def display_name
    full_name.presence || email
  end

  # JWT payload methods
  def jwt_payload
    {
      sub: id,
      email: email,
      community_id: community_id,
      iat: Time.current.to_i,
      exp: 24.hours.from_now.to_i
    }
  end

  def jwt_revoked?
    false
  end

  def generate_jwt
    JWT.encode(jwt_payload, ENV.fetch('JWT_SECRET_KEY'), 'HS256')
  end
end


