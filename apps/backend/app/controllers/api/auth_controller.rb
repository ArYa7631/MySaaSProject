class Api::AuthController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: {
      status: { code: 200, message: 'User retrieved successfully.' },
      data: { user: current_user }
    }
  end
end


