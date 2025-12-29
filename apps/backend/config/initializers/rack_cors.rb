# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      'https://aryasoftwaretech.com',
      'https://www.aryasoftwaretech.com', 
      'https://sanskritikanchal.com', 
      'https://www.sanskritikanchal.com', 
      'https://prashantkishor.in', 
      'https://www.prashantkishor.in' 
    )
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization']
  end
end
