class Api::RegistrationsController < ApplicationController
  respond_to :json

  def create
    Rails.logger.info "=== SIGN UP DEBUG ==="
    Rails.logger.info "Params: #{params.inspect}"

    user = User.new(user_params)

    if user.save
      Rails.logger.info "User created successfully!"
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: {
          user: user
        }
      }
    else
      Rails.logger.info "User creation failed: #{user.errors.full_messages}"
      render json: {
        status: { code: 422, message: "User couldn't be created successfully." },
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end