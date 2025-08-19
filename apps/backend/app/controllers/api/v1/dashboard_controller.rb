class Api::V1::DashboardController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: {
      status: { code: 200, message: 'Dashboard data retrieved successfully.' },
      data: {
        user: current_user,
        stats: {
          total_users: User.count,
          welcome_message: "Welcome to your dashboard, #{current_user.email}!"
        }
      }
    }
  end
end


