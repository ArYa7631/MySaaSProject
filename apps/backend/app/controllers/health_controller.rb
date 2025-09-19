class HealthController < ApplicationController
  skip_before_action :authenticate_user_from_jwt!
  
  def check
    render json: {
      status: 'healthy',
      timestamp: Time.current,
      environment: Rails.env
    }
  end
end


