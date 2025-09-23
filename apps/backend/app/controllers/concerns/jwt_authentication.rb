module JwtAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user_from_jwt!
  end

  private

  def authenticate_user_from_jwt!
    token = extract_jwt_token
    return render_unauthorized('No token provided') unless token

    begin
      payload = decode_jwt_token(token)
      @current_user = User.find(payload['sub'])
      
      # Check if token is revoked
      if @current_user.jwt_revoked?
        render_unauthorized('Token has been revoked')
        return
      end
      
      # Check if token is expired
      if payload['exp'] && Time.current.to_i > payload['exp']
        render_unauthorized('Token has expired')
        return
      end
      
      # Validate user belongs to the correct community based on domain
      validate_user_community_access!
      
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT decode error: #{e.message}"
      render_unauthorized('Invalid token')
    rescue ActiveRecord::RecordNotFound
      render_unauthorized('User not found')
    rescue => e
      Rails.logger.error "Authentication error: #{e.message}"
      render_unauthorized('Authentication failed')
    end
  end

  def extract_jwt_token
    auth_header = request.headers['Authorization']
    return nil unless auth_header&.start_with?('Bearer ')
    
    auth_header.split(' ').last
  end

  def decode_jwt_token(token)
    JWT.decode(token, ENV.fetch('JWT_SECRET_KEY'), true, { algorithm: 'HS256' }).first
  end

  def render_unauthorized(message)
    render json: {
      status: 'error',
      message: message,
      errors: { authentication: [message] }
    }, status: :unauthorized
  end

  def current_user
    @current_user
  end

  def validate_user_community_access!
    return unless @current_user

    # Get the current domain from the request
    current_domain = request.host
    
    # Find the community for the current domain
    current_community = Community.find_by(domain: current_domain)
    
    # If no community found for this domain, allow access (might be localhost or unknown domain)
    return unless current_community
    
    # If user has no community assigned, deny access to any specific community
    if @current_user.community_id.nil?
      Rails.logger.warn "User #{@current_user.id} (#{@current_user.email}) has no community assigned but attempted to access community #{current_community.id}"
      render_unauthorized('Access denied: User is not assigned to any community')
      return
    end
    
    # Check if the user belongs to the community for this domain
    unless @current_user.community_id == current_community.id
      Rails.logger.warn "User #{@current_user.id} (#{@current_user.email}) attempted to access community #{current_community.id} but belongs to community #{@current_user.community_id}"
      render_unauthorized('Access denied: User does not belong to this community')
    end
  end
end
