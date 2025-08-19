class Api::SessionsController < ApplicationController
  respond_to :json

  def create
    Rails.logger.info "=== SIGN IN DEBUG ==="
    Rails.logger.info "Params: #{params.inspect}"

    user = User.find_by(email: params[:user][:email])
    Rails.logger.info "User found: #{user.present?}"

    if user && user.valid_password?(params[:user][:password])
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