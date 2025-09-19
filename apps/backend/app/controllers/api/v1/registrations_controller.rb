class Api::V1::RegistrationsController < ApplicationController
  skip_before_action :authenticate_user_from_jwt!, only: [:create]
  respond_to :json

  def create

    begin
      user = User.new(user_params)

      if user.save
        Rails.logger.info "User created successfully!"
        render json: {
          status: { code: 200, message: 'Signed up successfully.' },
          data: {
            user: user,
            token: user.generate_jwt
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
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
  end
end
