class Api::SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]
  respond_to :json

  def create
    Rails.logger.info "=== SIGN IN DEBUG ==="
    Rails.logger.info "Params: #{params.inspect}"

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

        render json: {
          status: { code: 200, message: 'Signed in successfully.' },
          data: {
            user: user
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
end