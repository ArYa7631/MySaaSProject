class Api::V1::SessionsController < ApplicationController
  include DomainNormalization
  skip_before_action :authenticate_user_from_jwt!, only: [:create]
  respond_to :json

  def create

    begin
      # Check if user params exist
      if params[:user].blank?
        Rails.logger.info "No user params provided"
        render json: {
          status: { code: 401, message: "Invalid email or password." }
        }, status: :unauthorized
        return
      end

      email = params[:user][:email]
      password = params[:user][:password]

      # Check if email and password are provided
      if email.blank? || password.blank?
        Rails.logger.info "Email or password is blank"
        render json: {
          status: { code: 401, message: "Invalid email or password." }
        }, status: :unauthorized
        return
      end

      user = User.find_by(email: email)
      Rails.logger.info "User found: #{user.present?}"

      if user && user.valid_password?(password)
        Rails.logger.info "Authentication successful!"

        # Validate community access during login
        unless validate_user_community_access_during_login(user)
          Rails.logger.warn "User #{user.id} (#{user.email}) login denied due to community access validation"
          render json: {
            status: { code: 403, message: "Access denied: You do not have permission to access this community." }
          }, status: :forbidden
          return
        end

        render json: {
          status: { code: 200, message: 'Signed in successfully.' },
          data: {
            user: user,
            token: user.generate_jwt
          }
        }
      else
        Rails.logger.info "Authentication failed!"
        render json: {
          status: { code: 401, message: "Invalid email or password." }
        }, status: :unauthorized
      end
    rescue => e
      Rails.logger.error "Error during sign in: #{e.message}"
      render json: {
        status: { code: 401, message: "Invalid email or password." }
      }, status: :unauthorized
    end
  end

  def destroy
    render json: {
      status: { code: 200, message: "Signed out successfully." }
    }
  end

  private

  def sign_in_params
    params.require(:user).permit(:email, :password)
  end

  def validate_user_community_access_during_login(user)
    # Get the current domain from the request
    current_domain = request.host
    
    # Find the community for the current domain
    current_community = find_community_by_domain(current_domain)
    
    # If no community found for this domain, allow login (might be localhost or unknown domain)
    return true unless current_community
    
    # If user has no community assigned, deny login
    if user.community_id.nil?
      Rails.logger.warn "User #{user.id} (#{user.email}) has no community assigned but attempted to login to domain #{current_domain} (community #{current_community.id})"
      return false
    end
    
    # Check if the user belongs to the community for this domain
    unless user.community_id == current_community.id
      Rails.logger.warn "User #{user.id} (#{user.email}) attempted to login to domain #{current_domain} (community #{current_community.id}) but belongs to community #{user.community_id}"
      return false
    end
    
    true
  end
end
