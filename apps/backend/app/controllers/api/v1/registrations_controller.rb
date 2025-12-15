class Api::V1::RegistrationsController < ApplicationController
  skip_before_action :authenticate_user_from_jwt!, only: [:create]
  respond_to :json

  def create
    begin
      current_community = get_current_community
      if current_community && !current_community.marketplace_configuration&.is_super_admin
        return render json: {
          status: { code: 403, message: 'Registration is not available for this community' },
          errors: ['Only super admin communities can accept new registrations']
        }, status: :forbidden
      end

      user = User.new(user_params)

      if user.save
        Rails.logger.info "User created successfully!"
        
        community = CommunitySetupService.create_community_with_defaults(
          user, 
          params[:user][:domain], 
          "#{user.first_name} #{user.last_name}'s Community"
        )
        
        Rails.logger.info "Community created successfully for user #{user.id}: #{community.domain}"
        
        render json: {
          status: { code: 200, message: 'Signed up successfully.' },
          data: {
            user: user,
            community: community,
            token: user.generate_jwt,
            redirect_url: build_community_url(community)
          }
        }
      else
        Rails.logger.info "User creation failed: #{user.errors.full_messages}"
        render json: {
          status: { code: 422, message: "User couldn't be created successfully." },
          errors: user.errors.full_messages
        }, status: :unprocessable_content
      end
    rescue ActionController::ParameterMissing => e
      Rails.logger.info "Parameter missing: #{e.message}"
      render json: {
        status: { code: 422, message: "Missing required parameters." },
        errors: [e.message]
      }, status: :unprocessable_content
    rescue => e
      Rails.logger.error "Registration failed: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: {
        status: { code: 500, message: "Registration failed. Please try again." },
        errors: ["An unexpected error occurred during registration."]
      }, status: :internal_server_error
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
  end

  def get_current_community
    domain = request.host
    
    Community.find_by(domain: domain)
  end

  def build_community_url(community)
    protocol = Rails.env.production? ? 'https' : 'http'
    port = Rails.env.production? ? '' : ':3000'
    
    if community.domain == 'localhost'
      "#{protocol}://localhost#{port}"
    else
      "#{protocol}://#{community.domain}#{port}"
    end
  end
end
