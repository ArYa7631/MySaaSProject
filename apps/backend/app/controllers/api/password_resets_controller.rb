class Api::PasswordResetsController < Devise::PasswordsController
  skip_before_action :authenticate_user_from_jwt!, only: [:create, :update]

  # POST /api/auth/forgot_password
  def create
    user = User.find_by(email: params[:email])
    
    if user
      user.send_reset_password_instructions
      render json: { 
        message: 'Password reset instructions have been sent to your email.',
        email: params[:email]
      }, status: :ok
    else
      # For security, don't reveal if email exists or not
      render json: { 
        message: 'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.'
      }, status: :ok
    end
  end

  # PUT /api/auth/reset_password
  def update
    user = User.reset_password_by_token(reset_password_params)
    
    if user.errors.empty?
      # Generate JWT token for the user
      token = user.generate_jwt
      
      render json: {
        message: 'Password has been reset successfully.',
        user: user.as_json,
        token: token
      }, status: :ok
    else
      render json: {
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def reset_password_params
    # Handle both nested and top-level parameters
    if params[:password_reset]
      params.require(:password_reset).permit(:reset_password_token, :password, :password_confirmation)
    else
      params.permit(:reset_password_token, :password, :password_confirmation)
    end
  end
end
