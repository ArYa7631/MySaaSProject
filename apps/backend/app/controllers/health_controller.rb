class HealthController < ApplicationController
  def check
    render json: {
      status: 'healthy',
      timestamp: Time.current,
      environment: Rails.env
    }
  end
end


