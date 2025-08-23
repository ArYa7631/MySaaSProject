class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  
  # SECURITY NOTE: CSRF protection is not needed for JWT-only APIs
  # - JWT tokens are sent in Authorization headers, not cookies
  # - CSRF attacks require cookie-based authentication
  # - API-only mode is designed for stateless authentication
  # - Your frontend will handle JWT tokens securely
  
  before_action :authenticate_user!
end
